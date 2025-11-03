import { SwatchBook, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  selectedEl: HTMLElement;
  clearSelection: () => void;
};

const ElementSettingSection = ({ selectedEl, clearSelection }: Props) => {
  const [className, setClassName] = useState(selectedEl?.className || '');

  const applyStyle = (property: string, value: string) => {
    if (selectedEl) {
      (selectedEl.style as any)[property] = value;
    }
  };

  const resetStyles = () => {
    if (selectedEl) {
      selectedEl.removeAttribute('style');
    }
  };

  const applyClass = (value: string) => {
    if (selectedEl) {
      selectedEl.className = value;
      setClassName(value);
    }
  };

  return (
    <div className="w-96 shadow h-[89vh] p-4 overflow-y-auto">
      <h2 className="flex gap-2 items-center font-bold text-lg mb-4">
        <SwatchBook /> Element Settings
      </h2>

      {/* Font Size */}
      <label className="text-sm">Font Size</label>
      <Select
        defaultValue={selectedEl?.style?.fontSize || "18px"}
        onValueChange={(value) => applyStyle('fontSize', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Size" />
        </SelectTrigger>
        <SelectContent>
          {[...Array(40)].map((_, index) => (
            <SelectItem value={index + 12 + 'px'} key={index}>
              {index + 12}px
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Font Weight */}
      <label className="text-sm mt-3 block">Font Weight</label>
      <Select
        defaultValue={selectedEl?.style?.fontWeight || "400"}
        onValueChange={(value) => applyStyle('fontWeight', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Weight" />
        </SelectTrigger>
        <SelectContent>
          {["100", "200", "300", "400", "500", "600", "700", "800", "900"].map(
            (w) => (
              <SelectItem value={w} key={w}>
                {w}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      {/* Text Color */}
      <label className="text-sm mt-3 block">Text Color</label>
      <input
        onChange={(e) => applyStyle('color', e.target.value)}
        type="color"
        className="w-[50px] h-[50px] cursor-pointer rounded-2xl"
      />

      {/* Background Color */}
      <label className="text-sm mt-3 block">Background Color</label>
      <input
        onChange={(e) => applyStyle('backgroundColor', e.target.value)}
        type="color"
        className="w-[50px] h-[50px] cursor-pointer rounded-2xl"
      />

      {/* Text Align */}
      <label className="text-sm mt-3 block">Text Align</label>
      <Select
        defaultValue={selectedEl?.style?.textAlign || "left"}
        onValueChange={(value) => applyStyle('textAlign', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Alignment" />
        </SelectTrigger>
        <SelectContent>
          {["left", "center", "right", "justify"].map((align) => (
            <SelectItem value={align} key={align}>
              {align}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Padding */}
      <label className="text-sm mt-3 block">Padding</label>
      <Select
        defaultValue={selectedEl?.style?.padding || "0px"}
        onValueChange={(value) => applyStyle('padding', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Padding" />
        </SelectTrigger>
        <SelectContent>
          {[...Array(31)].map((_, i) => (
            <SelectItem value={i + 'px'} key={i}>
              {i}px
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Margin */}
      <label className="text-sm mt-3 block">Margin</label>
      <Select
        defaultValue={selectedEl?.style?.margin || "0px"}
        onValueChange={(value) => applyStyle('margin', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Margin" />
        </SelectTrigger>
        <SelectContent>
          {[...Array(31)].map((_, i) => (
            <SelectItem value={i + 'px'} key={i}>
              {i}px
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Border Radius */}
      <label className="text-sm mt-3 block">Border Radius</label>
      <Select
        defaultValue={selectedEl?.style?.borderRadius || "0px"}
        onValueChange={(value) => applyStyle('borderRadius', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Radius" />
        </SelectTrigger>
        <SelectContent>
          {[...Array(51)].map((_, i) => (
            <SelectItem value={i + 'px'} key={i}>
              {i}px
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Width */}
      <label className="text-sm mt-3 block">Width</label>
      <Select
        defaultValue={selectedEl?.style?.width || "auto"}
        onValueChange={(value) => applyStyle('width', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Width" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Auto</SelectItem>
          {[...Array(51)].map((_, i) => (
            <SelectItem value={i * 10 + '%'} key={i}>
              {i * 10}%
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Height */}
      <label className="text-sm mt-3 block">Height</label>
      <Select
        defaultValue={selectedEl?.style?.height || "auto"}
        onValueChange={(value) => applyStyle('height', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Height" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Auto</SelectItem>
          {[...Array(51)].map((_, i) => (
            <SelectItem value={i * 10 + 'px'} key={i}>
              {i * 10}px
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Class Name */}
      <label className="text-sm mt-4 block">Class Name</label>
      <Input
        placeholder="Enter class name"
        value={className}
        onChange={(e) => applyClass(e.target.value)}
        className="mt-1"
      />

      {/* Reset Button */}
      <Button
        variant="destructive"
        className="mt-6 w-full flex items-center gap-2"
        onClick={resetStyles}
      >
        <Trash2 size={18} /> Reset Styles
      </Button>
    </div>
  );
};

export default ElementSettingSection;
