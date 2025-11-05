"use client";
import React, { useState } from "react";
import { Download, Laptop, Smartphone, Code2, Eye } from "lucide-react";
import ViewCodeBlock from "./ViewCodeBlock";

type Props = {
  selectedScreenSize: string;
  setSelectedScreenSize: (val: string) => void;
  generatedCode: string;
};

const WebPageTools = ({
  selectedScreenSize,
  setSelectedScreenSize,
  generatedCode,
}: Props) => {
  const [isViewCodeOpen, setIsViewCodeOpen] = useState(false);

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(generatedCode);
      newWindow.document.close();
    }
  };

  return (
    <div className="w-full mt-4 flex flex-wrap justify-center gap-3">
      {/* View size toggle */}
      <button
        onClick={() => setSelectedScreenSize("web")}
        className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition ${
          selectedScreenSize === "web"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Laptop className="w-4 h-4" /> Desktop
      </button>

      <button
        onClick={() => setSelectedScreenSize("mobile")}
        className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition ${
          selectedScreenSize === "mobile"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Smartphone className="w-4 h-4" /> Mobile
      </button>

      {/* View Website */}
      <button
        onClick={openInNewTab}
        className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 text-sm hover:bg-green-700 transition"
      >
        <Eye className="w-4 h-4" /> View Website
      </button>

      {/* View Code */}
      <ViewCodeBlock code={generatedCode}>
      <div className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2 text-sm hover:bg-indigo-700 transition cursor-pointer">
        <Code2 className="w-4 h-4" /> View Code
      </div>
    </ViewCodeBlock>


      {/* Download */}
      <button
        onClick={downloadCode}
        className="px-4 py-2 bg-gray-800 text-white rounded-md flex items-center gap-2 text-sm hover:bg-gray-900 transition"
      >
        <Download className="w-4 h-4" /> Download
      </button>
    </div>
  );
};

export default WebPageTools;
