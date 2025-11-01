import React, { useState } from "react";
import { Messages } from "../[projectId]/page";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

type props = {
  messages: Messages[];
  onSend: any;
};

const ChatSection = ({ messages, onSend }: props) => {
  const [input, setInput] = useState<string>("");

  const handleSet = () => {
    if (!input?.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="w-96 shadow h-[89vh] p-4 flex flex-col">
      ChatSection
      <div className="flex overflow-y-auto p-4 space-y-3 flex-col flex-1">
        {messages?.length === 0 ? (
          <p className="text-gray-400 text-center">No Messages Yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-white text-black"
                    : "bg-gray-100 text-black"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-3 border-t flex items-center gap-2">
        <textarea
          placeholder="Describe your website design idea"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
        />
        <Button onClick={handleSet} className="cursor-pointer">
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
};

export default ChatSection;
