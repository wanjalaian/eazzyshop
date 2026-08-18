"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function AnnouncementBar({ text }: { text: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hash text to make a simple ID
    const id = `announcement-${btoa(text).substring(0, 10)}`;
    if (!sessionStorage.getItem(id)) {
      setIsVisible(true);
    }
  }, [text]);

  if (!isVisible) return null;

  const dismiss = () => {
    const id = `announcement-${btoa(text).substring(0, 10)}`;
    sessionStorage.setItem(id, "true");
    setIsVisible(false);
  };

  return (
    <div className="relative w-full h-[36px] bg-[var(--store-accent)] flex items-center justify-center px-8 z-50">
      <p className="text-white text-xs sm:text-sm font-medium truncate max-w-full">
        {text}
      </p>
      <button 
        onClick={dismiss}
        className="absolute right-2 p-1 text-white/80 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
