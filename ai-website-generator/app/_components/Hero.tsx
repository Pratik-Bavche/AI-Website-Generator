"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  HomeIcon,
  ImagePlusIcon,
  Key,
  LayoutDashboard,
  User,
} from "lucide-react";
import { useState } from "react";

const suggestion = [
  {
    label: "Dashboard",
    prompt:
      "Create an analytics dashboard to track customers and revenue data for a SaaS",
    icon: LayoutDashboard,
  },
  {
    label: "SignUp Form",
    prompt:
      "Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox",
    icon: Key,
  },
  {
    label: "Hero",
    prompt:
      "Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a title with a subtle gradient effect",
    icon: HomeIcon,
  },
  {
    label: "User Profile Card",
    prompt:
      "Create a modern user profile card component for a social media website",
    icon: User,
  },
];

const Hero = () => {
  const [userInput, setUserInput] = useState<string>("");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        
      {/* Header & Description */}
      <h2 className="font-bold text-6xl text-center">What should we design</h2>
      <p className="mt-2 text-lg text-gray-500 text-center">
        Generate, Edit & Explore design with AI, Export code as well
      </p>

      {/* Input Box */}
      <div className="w-full max-w-2xl mt-8 p-5 border rounded-2xl shadow-sm">
        <textarea
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe your page design"
          value={userInput}
          className="w-full h-28 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"></textarea>
        <div className="flex justify-between items-center mt-3">
          <Button variant="ghost" className="cursor-pointer">
            <ImagePlusIcon />
          </Button>
          <Button className="cursor-pointer">
            <ArrowUp />
          </Button>
        </div>
      </div>

      {/* Suggestion List */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {suggestion.map((item, index) => (
          <Button
            onClick={() => setUserInput(item.prompt)}
            key={index}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer">
            <item.icon className="w-4 h-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Hero;