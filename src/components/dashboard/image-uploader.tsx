'use client';

import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImageUploader({ images, onChange }: { images: string[], onChange: (imgs: string[]) => void }) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-[#E8E2DC] rounded-lg p-8 text-center bg-[#FAFAF7]">
        <UploadCloud className="w-8 h-8 text-[#A89F97] mx-auto mb-2" />
        <p className="text-sm text-[#6B6560]">Drag & drop or click to upload</p>
      </div>
      {images.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-lg border border-[#E8E2DC] overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => onChange(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow">
                <X className="w-3 h-3 text-[#C43A3A]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
