import React, { useEffect, useRef } from "react";

type Props = {
  generatedCode: string;
};

const WebsiteDesign = ({ generatedCode }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Clean code and remove ```html blocks
  const cleanedCode = generatedCode.replace(/```html|```/g, "").trim();

  // Function to fix duplicate IDs in generated HTML
  const fixDuplicateIds = (html: string) => {
    const idRegex = /id="([^"]+)"/g;
    const idMap = new Map<string, number>();
    return html.replace(idRegex, (match, id) => {
      const count = idMap.get(id) || 0;
      idMap.set(id, count + 1);
      return count === 0 ? match : `id="${id}-${count}"`;
    });
  };

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
      <body id="root"></body>
      </html>
    `);
    doc.close();
  }, []);

  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    const root = doc.getElementById("root");

    if (root) {
      const fixedHTML = fixDuplicateIds(cleanedCode);
      root.innerHTML = fixedHTML || "";
    }
  }, [cleanedCode]);

  return (
    <div className="p-5 w-full overflow-hidden">
      <iframe
        ref={iframeRef}
        className="w-full h-[91vh] border rounded bg-white"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default WebsiteDesign;
