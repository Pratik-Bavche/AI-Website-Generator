"use client";
import React, { useEffect, useState } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import ElementSettingSection from "../_components/ElementSettingSection";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";

export type Messages = {
  role: string;
  content: string;
};

export type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatMessages: Messages[];
};

const prompt = `userInput: {userInput}
Instructions:
If the user input is explicitly asking to generate
code, design, or HTML/CSS/JS output (e.g., "Create a
landing page", "Build a dashboard", "Generate HTML
Tailwind CSS code"), then:
Generate a complete HTML Tailwind CSS code using
Flowbite UI components.
Use a modern design with blue as the primary
color theme.
- Only include the <body> content (do not add
<head> or <title>).
- Make it fully responsive for all screen sizes.
- All primary components must match the theme
color.
- Add proper padding and margin for each element.
- Components should be independent; do not connect
them.
- Use placeholders for all images:
- Light mode:
https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
- Dark mode: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
Add alt tag describing the image prompt.
Use the following libraries/components where
appropriate:
- FontAwesome icons (fa fa-)
- Flowbite UI components: buttons, modals,
forms, tables, tabs, alerts, cards, dialogs,
dropdowns, accordions, etc.
- Chart.js for charts & graphs
- Swiper.js for sliders/carousels
- Tippy.js for tooltips & popovers
Include interactive components like modals,
dropdowns, and accordions.
Ensure proper spacing, alignment, hierarchy, and
theme consistency.
- Ensure charts are visually appealing and match
the theme color.
Header menu options should be spread out and not
connected.
- Do not include broken links.
- Do not add any extra text before or after the
HTML code.

2. If the user input is general text or greetings
(e.g., "Hi", "Hello", "How are you?") or does not
explicitly ask to generate code, then:
- Respond with a simple, friendly text message
instead of generating any code.

Example:
- User: "Hi" > Response: "Hello! How can I help you
today?"
- User: "Build a responsive landing page with Tailwind
CSS" > Response: [Generate full HTML code as per
instructions above]
`;

const Playground = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  const frameId = searchParams.get("frameId");

  const [frameDetail, setFrameDetail] = useState<Frame>();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");

  useEffect(() => {
    if (frameId) GetFrameDetails();
  }, [frameId]);

  const GetFrameDetails = async () => {
    const result = await axios.get(
      `/api/frames?frameId=${frameId}&projectId=${projectId}`
    );
    setFrameDetail(result.data);
    if (result.data?.chatMessages?.length === 1) {
      const msg = result.data?.chatMessages[0].content;
      sendMessage(msg);
    }
  };

  const sendMessage = async (userInput: string) => {
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    const result = await fetch("/api/ai-model", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          { role: "user", content: prompt.replace("{userInput}", userInput) },
        ],
      }),
    });

    const reader = result.body?.getReader();
    const decoder = new TextDecoder();

    let aiResponse = "";
    let isCode = false;

    while (true) {
      const { done, value } = (await reader?.read()) ?? {};
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      aiResponse += chunk;

      if (!isCode && aiResponse.includes("<html")) {
        isCode = true;
        const index = aiResponse.indexOf("<html");
        const initialCodeChunk = aiResponse.slice(index);
        setGeneratedCode((prev) => (prev ?? "") + initialCodeChunk);
      } else if (isCode) {
        setGeneratedCode((prev) => (prev ?? "") + chunk);
      }
    }

    if (isCode) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Your code is ready!" },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log(generatedCode);
  }, [generatedCode]);

  return (
    <div>
      <PlaygroundHeader />
      <div className="flex">
        <ChatSection
          loading={loading}
          messages={messages}
          onSend={(input: string) => sendMessage(input)}
        />
        <WebsiteDesign />
      </div>
    </div>
  );
};

export default Playground;
