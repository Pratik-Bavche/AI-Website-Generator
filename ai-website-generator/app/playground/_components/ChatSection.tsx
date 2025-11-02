import React, { useState } from "react";
import { Messages } from "../[projectId]/page";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

type Props = {
  messages: Messages[];
  onSend: (input: string) => void;
  loading: boolean;
};

const ChatSection = ({ messages, onSend, loading }: Props) => {
  const [input, setInput] = useState<string>("");

  const handleSet = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="w-96 border-r border-gray-200 h-[89vh] flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="font-semibold text-lg text-gray-800">Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center text-sm">
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-center items-center p-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600" />
              Generating code...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSet();
              }
            }}
            value={input}
            className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[44px] max-h-[120px]"
          />
          <Button
            onClick={handleSet}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 h-[44px] w-[44px] rounded-xl shadow-sm"
          >
            <ArrowUp className="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
