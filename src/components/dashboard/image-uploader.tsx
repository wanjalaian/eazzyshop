'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

interface ImageUploaderProps {
  imageStorageIds: Id<'_storage'>[];
  onChange: (ids: Id<'_storage'>[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  imageStorageIds,
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const generateUploadUrl = useMutation(api.stores.generateUploadUrl);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (imageStorageIds.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setUploading(true);
    try {
      const newIds: Id<'_storage'>[] = [...imageStorageIds];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        const { storageId } = await result.json();
        newIds.push(storageId);
      }

      onChange(newIds);
      toast.success('Image(s) uploaded successfully!');
    } catch (err: any) {
      toast.error('Failed to upload image.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = (index: number) => {
    onChange(imageStorageIds.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="relative border-2 border-dashed border-[#E8E2DC] rounded-xl p-6 text-center bg-[#FAFAF7] hover:bg-[#F5F0EB] transition-colors cursor-pointer">
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading || imageStorageIds.length >= maxImages}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-[#C4653A] animate-spin" />
            <p className="text-xs text-[#6B6560]">Uploading images to storage...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="w-8 h-8 text-[#A89F97]" />
            <p className="text-sm font-medium text-[#1A1A19]">Click or drag images to upload</p>
            <p className="text-xs text-[#6B6560]">
              {imageStorageIds.length} / {maxImages} uploaded (PNG, JPG, WebP)
            </p>
          </div>
        )}
      </div>

      {imageStorageIds.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {imageStorageIds.map((storageId, idx) => (
            <div
              key={storageId}
              className="relative w-20 h-20 rounded-lg border border-[#E8E2DC] overflow-hidden bg-[#F5F0EB] flex items-center justify-center text-[10px] text-[#A89F97]"
            >
              <span>Image {idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-[#C43A3A] hover:bg-red-50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
