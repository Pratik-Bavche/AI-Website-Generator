import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("API route called");
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("Invalid messages:", messages);
      return NextResponse.json(
        { error: "Messages array is required and must not be empty" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai/";
    const model = process.env.OPENAI_MODEL || "gemini-2.0-flash";
    
    // Debug: Log all available env vars that start with OPENAI (without exposing values)
    const envDebug = Object.keys(process.env)
      .filter(key => key.startsWith('OPENAI'))
      .map(key => `${key}=${process.env[key] ? 'SET' : 'NOT SET'}`)
      .join(', ');
    console.log("Environment variables check:", envDebug || "No OPENAI_* variables found");
    
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY is not configured in environment variables");
      console.error("Available environment variables starting with OPENAI:", Object.keys(process.env).filter(k => k.startsWith('OPENAI')));
      return NextResponse.json(
        { 
          error: "OPENAI_API_KEY is not configured. Please:\n1. Create/update .env.local file in project root\n2. Add: OPENAI_API_KEY=\"your-key-here\"\n3. Restart your dev server (stop with Ctrl+C, then run npm run dev)",
          debug: {
            envVarsFound: Object.keys(process.env).filter(k => k.startsWith('OPENAI')).length,
            openAIVars: Object.keys(process.env).filter(k => k.startsWith('OPENAI'))
          }
        },
        { status: 500 }
      );
    }

    const trimmedKey = apiKey.trim();
    
    // Log API key status (without exposing the actual key)
    const maskedKey = trimmedKey.length > 14 
      ? `${trimmedKey.substring(0, 10)}...${trimmedKey.substring(trimmedKey.length - 4)}`
      : `${trimmedKey.substring(0, Math.min(10, trimmedKey.length))}...`;
    console.log("✅ API Key found:", maskedKey, `(length: ${trimmedKey.length})`);
    console.log("Making request to Google Generative Language API");
    console.log("Base URL:", baseUrl);
    console.log("Model:", model);
    
    // Construct the API URL - Google OpenAI-compatible endpoint uses Bearer token auth
    const apiUrl = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${trimmedKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error("❌ Google Generative Language API error:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
        apiKeyPresent: !!apiKey,
        apiKeyLength: apiKey?.length || 0,
        baseUrl,
        model,
      });
      
      let errorMessage = `Google API request failed: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = 
          errorJson.error?.message || 
          errorJson.message ||
          (typeof errorJson.error === "string" ? errorJson.error : errorMessage);
        
        // Provide helpful error messages
        if (response.status === 401) {
          errorMessage = `Authentication failed: ${errorMessage}. This usually means:
1. Your API key is invalid or expired
2. Your API key doesn't have proper permissions
3. Your API key may be incorrect

Please verify your OPENAI_API_KEY in .env.local file and ensure it's a valid Google API key.`;
        }
      } catch {
        if (errorText && errorText !== "Unknown error") {
          errorMessage = errorText;
        }
        if (response.status === 401) {
          const keyLength = (trimmedKey || apiKey?.trim() || apiKey)?.length || 0;
          errorMessage = `Authentication failed: ${errorMessage}. 

Your API key is being read (length: ${keyLength}), but Google API rejected it. This means:
- The API key is invalid, expired, or has been revoked
- The API key doesn't have the required permissions

Please:
1. Verify your OPENAI_API_KEY in .env.local file
2. Ensure the API key is valid and has Generative Language API enabled
3. Check that OPENAI_BASE_URL and OPENAI_MODEL are correctly set
4. Restart your dev server`;
        }
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    if (!response.body) {
      console.error("No response body from Google API");
      return NextResponse.json(
        { error: "No response body received from Google Generative Language API" },
        { status: 500 }
      );
    }

    console.log("Response OK, starting stream processing");
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        try {
          let buffer = "";
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              // Process any remaining buffer
              if (buffer.trim()) {
                const trimmedLine = buffer.trim();
                if (trimmedLine.startsWith("data: ")) {
                  try {
                    const jsonStr = trimmedLine.slice(6);
                    const json = JSON.parse(jsonStr);
                    const text = json.choices?.[0]?.delta?.content;
                    if (text) {
                      controller.enqueue(encoder.encode(text));
                    }
                  } catch (e) {
                    console.error("Stream JSON parse error (final):", e);
                  }
                }
              }
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              
              if (trimmedLine === "" || trimmedLine === "data: [DONE]") {
                continue;
              }

              if (trimmedLine.startsWith("data: ")) {
                try {
                  const jsonStr = trimmedLine.slice(6);
                  const json = JSON.parse(jsonStr);
                  const text = json.choices?.[0]?.delta?.content;
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch (e) {
                  console.error("Stream JSON parse error:", e, "Line:", trimmedLine);
                }
              }
            }
          }
        } catch (err) {
          console.error("Streaming error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
