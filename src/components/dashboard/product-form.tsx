'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from './image-uploader';
import { VariantBuilder } from './variant-builder';
import { useState } from 'react';

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  price: z.number().min(0),
  compareAtPrice: z.number().optional(),
  categoryId: z.string(),
  hasVariants: z.boolean(),
});

export function ProductForm() {
  const [images, setImages] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasVariants: false,
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input {...form.register('title')} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea {...form.register('description')} rows={4} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <Input type="number" step="0.01" {...form.register('price', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Compare at Price</label>
          <Input type="number" step="0.01" {...form.register('compareAtPrice', { valueAsNumber: true })} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Images (max 5)</label>
        <ImageUploader images={images} onChange={setImages} />
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register('hasVariants')} />
          <span className="text-sm font-medium">This product has variants</span>
        </label>
      </div>
      {form.watch('hasVariants') && <VariantBuilder />}
      <Button type="submit" className="bg-[#1A1A19] text-white">Save Product</Button>
    </form>
  );
}
