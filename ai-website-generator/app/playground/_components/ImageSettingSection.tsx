"use client";
import ImageKit from "imagekit";
import React, { useRef, useState } from "react";
import {
  Image as ImageIcon,
  Crop,
  Expand,
  Image as ImageUpscale,
  ImageMinus,
  Loader2Icon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  selectedEl: HTMLImageElement;
};

const transformOptions = [
  { label: "Smart Crop", value: "smartcrop", icon: <Crop />, transformation: "fo-auto" },
  { label: "Dropshadow", value: "dropshadow", icon: <Expand />, transformation: "e-dropshadow" },
  { label: "Upscale", value: "upscale", icon: <ImageUpscale />, transformation: "e-upscale" },
  { label: "BG Remove", value: "bgremove", icon: <ImageMinus />, transformation: "e-bgremove" },
];

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

function ImageSettingSection({ selectedEl }: Props) {
  const [altText, setAltText] = useState(selectedEl?.alt || "");
  const [width, setWidth] = useState<number>(selectedEl?.width || 300);
  const [height, setHeight] = useState<number>(selectedEl?.height || 200);
  const [borderRadius, setBorderRadius] = useState(selectedEl?.style?.borderRadius || "0px");
  const [preview, setPreview] = useState(selectedEl?.src || "");
  const [activeTransforms, setActiveTransforms] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File>();
  const [loading, setLoading] = useState(false);

  // Toggle Transform
  const toggleTransform = (value: string) => {
    setActiveTransforms((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  // File change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        selectedEl.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };


  const saveUploadedFile = async () => {
    if (selectedImage) {
      setLoading(true);
      try {
        // Convert to base64
        const toBase64 = (file: File) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });

        const base64File = await toBase64(selectedImage);

        const imageRef = await imagekit.upload({
          file: base64File,
          fileName: Date.now() + ".png",
          isPublished: true,
        });

        console.log("Uploaded:", imageRef);

        selectedEl.setAttribute("src", imageRef?.url + "?tr=");
        setPreview(imageRef?.url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please select an image first.");
    }
  };

  // Open File Dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const GenerateAiImage = () => {
    setLoading(true);
    const url = `https://ik.imagekit.io/fw7bitjdh/ik-genimg-prompt-${altText}/${Date.now()}.png?tr=`;
    setPreview(url);
    selectedEl.setAttribute("src", url);
  };

  const ApplyTransformation = (trValue: string) => {
    setLoading(true);

    if (!preview.includes(trValue)) {
      const url = preview + trValue + ",";
      setPreview(url);
      selectedEl.setAttribute("src", url);
    } else {
      const url = preview.replaceAll(trValue + ",", "");
      setPreview(url);
      selectedEl.setAttribute("src", url);
    }
    setLoading(false);
  };

  return (
    <div className="w-96 shadow p-4 space-y-4">
      <h2 className="flex gap-2 items-center font-bold">
        <ImageIcon /> Image Settings
      </h2>

      {/* Preview */}
      <div className="flex justify-center">
        <img
          src={preview}
          alt={altText}
          className="max-h-40 object-contain border rounded cursor-pointer hover:opacity-80"
          onClick={openFileDialog}
          onLoad={() => setLoading(false)}
        />
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Upload Button */}
      <Button type="button" variant="outline" className="w-full" onClick={saveUploadedFile} disabled={loading}>
        {loading && <Loader2Icon className="animate-spin" />} Upload Image
      </Button>

      {/* Alt Text */}
      <div>
        <Label className="text-sm">Alt Text</Label>
        <Input
          type="text"
          value={altText}
          onChange={(e) => {
            setAltText(e.target.value);
            selectedEl.alt = e.target.value;
          }}
          placeholder="Enter alt text"
          className="mt-1"
        />
      </div>

      {/* Generate AI Image Button */}
      <Button className="w-full" disabled={loading} onClick={GenerateAiImage}>
        {loading && <Loader2Icon className="animate-spin" />} Generate AI Image
      </Button>

      {/* AI Transform Buttons */}
      <div>
        <Label className="text-sm mb-1 block">AI Transform</Label>
        <div className="flex gap-2 flex-wrap">
          <TooltipProvider>
            {transformOptions.map((opt) => {
              const applied = activeTransforms.includes(opt.value);
              return (
                <Tooltip key={opt.value}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={preview.includes(opt.transformation) ? "default" : "outline"}
                      className="flex items-center justify-center p-2"
                      onClick={() => ApplyTransformation(opt.transformation)}
                    >
                      {opt.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {opt.label} {applied && "(Applied)"}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>

      {/* Conditional Resize Inputs */}
      {activeTransforms.includes("resize") && (
        <div className="flex gap-2">
          <div className="flex-1">
            <Label className="text-sm">Width</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => {
                setWidth(Number(e.target.value));
                selectedEl.width = Number(e.target.value);
              }}
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <Label className="text-sm">Height</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => {
                setHeight(Number(e.target.value));
                selectedEl.height = Number(e.target.value);
              }}
              className="mt-1"
            />
          </div>
        </div>
      )}

      {/* Border Radius */}
      <div>
        <Label className="text-sm">Border Radius</Label>
        <Input
          type="text"
          value={borderRadius}
          onChange={(e) => {
            setBorderRadius(e.target.value);
            selectedEl.style.borderRadius = e.target.value;
          }}
          placeholder="e.g. 8px or 50%"
          className="mt-1"
        />
      </div>
    </div>
  );
}

export default ImageSettingSection;
