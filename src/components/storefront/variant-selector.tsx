"use client";

import { useState, useEffect } from "react";

export function VariantSelector({ 
  options, 
  variants, 
  onVariantChange 
}: { 
  options: any[]; 
  variants: any[];
  onVariantChange: (variant: any) => void;
}) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    // Default to first variant's options
    if (variants.length > 0 && Object.keys(selectedOptions).length === 0) {
      const defaultVariant = variants.find(v => v.isAvailable) || variants[0];
      const initialSelection: Record<string, string> = {};
      
      options.forEach(opt => {
        // Simple mapping assumption: options array maps directly to variant choice structure
        initialSelection[opt.name] = defaultVariant.options?.[opt.name] || opt.values[0];
      });
      
      setSelectedOptions(initialSelection);
      onVariantChange(defaultVariant);
    }
  }, [options, variants, selectedOptions, onVariantChange]);

  const handleSelect = (optionName: string, value: string) => {
    const newSelection = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newSelection);
    
    // Find matching variant
    const matchedVariant = variants.find(v => {
      return Object.entries(newSelection).every(([key, val]) => v.options?.[key] === val);
    });
    
    if (matchedVariant) {
      onVariantChange(matchedVariant);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {options.map((option) => (
        <div key={option.name} className="flex flex-col gap-3">
          <span className="text-sm font-medium text-[#1A1A19]">{option.name}</span>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value: string) => {
              const isSelected = selectedOptions[option.name] === value;
              const isColor = option.name.toLowerCase() === "color" || option.name.toLowerCase() === "colour";
              
              if (isColor) {
                // Render color circle
                return (
                  <button
                    key={value}
                    onClick={() => handleSelect(option.name, value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      isSelected ? "border-[var(--store-accent)] p-[2px]" : "border-transparent"
                    }`}
                    title={value}
                  >
                    <div 
                      className="w-full h-full rounded-full border border-[#E8E2DC]"
                      style={{ backgroundColor: value.toLowerCase() }} 
                    />
                  </button>
                );
              }
              
              return (
                <button
                  key={value}
                  onClick={() => handleSelect(option.name, value)}
                  className={`px-5 py-2 rounded-[20px] text-sm font-medium transition-all ${
                    isSelected 
                      ? "bg-[#1A1A19] text-white border-[#1A1A19]" 
                      : "bg-[#F5F0EB] text-[#6B6560] border-transparent hover:bg-[#E8E2DC]"
                  } border`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
