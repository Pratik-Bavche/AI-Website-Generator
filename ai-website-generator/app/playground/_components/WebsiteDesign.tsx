import React, { useEffect, useRef, useState } from "react";
import WebPageTools from "./WebPageTools";
import ElementSettingSection from "./ElementSettingSection";

type Props = {
  generatedCode: string;
};

const WebsiteDesign = ({ generatedCode }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedScreenSize, setSelectedScreenSize] = useState("web");
  const [selectedElement, setSelectedElement] = useState<HTMLElement|null>();

  // Clean & prepare code
  const cleanedCode = generatedCode.replace(/```html|```/g, "").trim();

  // Function to fix duplicate IDs
  const fixDuplicateIds = (html: string) => {
    const idRegex = /id="([^"]+)"/g;
    const idMap = new Map<string, number>();
    return html.replace(idRegex, (match, id) => {
      const count = idMap.get(id) || 0;
      idMap.set(id, count + 1);
      return count === 0 ? match : `id="${id}-${count}"`;
    });
  };

  // Initialize iframe environment (only once)
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
        <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template" />
        <title>AI Website Builder</title>

        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>

        <!-- Flowbite CSS & JS -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

        <!-- Font Awesome / Lucide -->
        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

        <!-- Chart.js -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <!-- AOS -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

        <!-- GSAP -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

        <!-- Lottie -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

        <!-- Swiper -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

        <!-- Tippy.js -->
        <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
        <script src="https://unpkg.com/@popperjs/core@2"></script>
        <script src="https://unpkg.com/tippy.js@6"></script>
      </head>
      <body id="root" style="margin:0; padding:0;"></body>
      </html>
    `);
    doc.close();
  }, []);

  // Update the body with the generated HTML + enable hover/select editing
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    const root = doc.getElementById("root");
    if (!root) return;

    const fixedHTML = fixDuplicateIds(cleanedCode);
    root.innerHTML = fixedHTML || "";

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return;
      const target = e.target as HTMLElement;
      if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
      hoverEl = target;
      hoverEl.style.outline = "2px dotted blue";
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
      selectedEl.style.outline = "2px solid red";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();
      setSelectedElement(selectedEl)
      const handleBlur = () => {
        if (selectedEl) {
          selectedEl.style.outline = "";
          selectedEl.removeAttribute("contenteditable");
          console.log("Edited element:", selectedEl.outerHTML);
        }
      };

      selectedEl.addEventListener("blur", handleBlur, { once: true });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
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
        <div className="p-5 w-full overflow-hidden flex items-center flex-col">
          <iframe
            ref={iframeRef}
            className={`${selectedScreenSize === "web" ? "w-full" : "w-[430px]"} h-[78vh] border rounded bg-white`}
            sandbox="allow-scripts allow-same-origin"
          />
          <WebPageTools
            selectedScreenSize={selectedScreenSize}
            setSelectedScreenSize={(v: string) => setSelectedScreenSize(v)}
            generatedCode={generatedCode}
          />
        </div>
        {/* @ts-ignore */}
        <ElementSettingSection selectedEl={selectedElement} clearSelection={()=>setSelectedElement(null)}/>
    </div>
  );
};

export default WebsiteDesign;
