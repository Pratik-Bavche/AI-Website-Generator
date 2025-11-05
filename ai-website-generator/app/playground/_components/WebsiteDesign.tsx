"use client";
import React, { useEffect, useRef, useState } from "react";
import WebPageTools from "./WebPageTools";
import ElementSettingSection from "./ElementSettingSection";

type Props = {
  generatedCode: string;
};

const WebsiteDesign = ({ generatedCode }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedScreenSize, setSelectedScreenSize] = useState("web");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  // Clean code
  const cleanedCode = generatedCode.replace(/```html|```/g, "").trim();

  // Fix duplicate IDs
  const fixDuplicateIds = (html: string) => {
    const idRegex = /id="([^"]+)"/g;
    const idMap = new Map<string, number>();
    return html.replace(idRegex, (match, id) => {
      const count = idMap.get(id) || 0;
      idMap.set(id, count + 1);
      return count === 0 ? match : `id="${id}-${count}"`;
    });
  };

  // Set up iframe base environment
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>AI Website Builder</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
        </head>
        <body id="root" style="margin:0;padding:0;"></body>
      </html>
    `);
    doc.close();
  }, []);

  // Render code + make editable
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    const root = doc.getElementById("root");
    if (!root) return;

    root.innerHTML = fixDuplicateIds(cleanedCode);

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return;
      const target = e.target as HTMLElement;
      if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
      hoverEl = target;
      hoverEl.style.outline = "2px dotted #2563eb"; // Tailwind blue
    };

    const handleMouseOut = () => {
      if (selectedEl) return;
      if (hoverEl) hoverEl.style.outline = "";
      hoverEl = null;
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;

      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
      }

      selectedEl = target;
      selectedEl.style.outline = "2px solid #dc2626"; // red
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();
      setSelectedElement(selectedEl);

      const handleBlur = () => {
        if (selectedEl) {
          selectedEl.style.outline = "";
          selectedEl.removeAttribute("contenteditable");
        }
      };
      selectedEl.addEventListener("blur", handleBlur, { once: true });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        setSelectedElement(null);
        selectedEl = null;
      }
    };

    doc.body?.addEventListener("mouseover", handleMouseOver);
    doc.body?.addEventListener("mouseout", handleMouseOut);
    doc.body?.addEventListener("click", handleClick);
    doc.addEventListener("keydown", handleKeyDown);

    return () => {
      doc.body?.removeEventListener("mouseover", handleMouseOver);
      doc.body?.removeEventListener("mouseout", handleMouseOut);
      doc.body?.removeEventListener("click", handleClick);
      doc.removeEventListener("keydown", handleKeyDown);
    };
  }, [cleanedCode]);

  return (
    <div className="flex gap-2 w-full">
      {/* Website Preview Section */}
      <div className="p-5 w-full flex flex-col items-center">
        <iframe
          ref={iframeRef}
          className={`${
            selectedScreenSize === "web" ? "w-full" : "w-[430px]"
          } h-[78vh] border rounded bg-white`}
          sandbox="allow-scripts allow-same-origin"
        />
        {/* WebPage Tools */}
        <WebPageTools
          selectedScreenSize={selectedScreenSize}
          setSelectedScreenSize={(v: string) => setSelectedScreenSize(v)}
          generatedCode={generatedCode}
        />
      </div>

      {/* Element Style Editor */}
      {selectedElement && (
        // @ts-ignore
        <ElementSettingSection
          selectedEl={selectedElement}
          clearSelection={() => setSelectedElement(null)}
        />
      )}
    </div>
  );
};

export default WebsiteDesign;
