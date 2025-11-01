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

const Playground = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  const frameId = searchParams.get("frameId");
  const [frameDetail, setFrameDetail] = useState<Frame>();

  useEffect(() => {
    frameId && GetFrameDetails();
  }, [frameId]);

  const GetFrameDetails = async () => {
    const result = await axios.get(
      "/api/frames?frameId=" + frameId + "&projectId=" + projectId
    );
    console.log(result.data);
    setFrameDetail(result.data);
  };

  const sendMessage = async (userInput: string) => {
    if (!frameId || !userInput.trim()) return;
    
    const newMessage = {
      role: "user",
      content: userInput,
    };

    try {
      // Save message to database
      await axios.post("/api/frames", {
        frameId: frameId,
        messages: newMessage,
      });

      // Refresh frame details to get updated messages
      await GetFrameDetails();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <PlaygroundHeader />
      <div className="flex">
        <ChatSection
          messages={frameDetail?.chatMessages ?? []}
          onSend={(input: string) => sendMessage(input)}
        />
        <WebsiteDesign />
      </div>
    </div>
  );
};

export default Playground;
