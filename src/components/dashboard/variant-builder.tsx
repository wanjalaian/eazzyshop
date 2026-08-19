'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface VariantOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity?: number;
  isAvailable: boolean;
}

interface VariantBuilderProps {
  basePrice: number;
  initialOptions?: VariantOption[];
  initialVariants?: ProductVariant[];
  onChange: (data: { variantOptions: VariantOption[]; variants: ProductVariant[] }) => void;
}

export function VariantBuilder({
  basePrice,
  initialOptions = [],
  initialVariants = [],
  onChange,
}: VariantBuilderProps) {
  const [optionGroups, setOptionGroups] = useState<
    { name: string; valuesInput: string }[]
  >(
    initialOptions.length > 0
      ? initialOptions.map((o) => ({ name: o.name, valuesInput: o.values.join(', ') }))
      : [{ name: 'Size', valuesInput: 'S, M, L' }]
  );

  const [matrix, setMatrix] = useState<ProductVariant[]>(initialVariants);

  const generateCartesianMatrix = (groups: VariantOption[]): ProductVariant[] => {
    const validGroups = groups.filter((g) => g.name.trim() !== '' && g.values.length > 0);
    if (validGroups.length === 0) return [];

    const cartesian = (arrays: string[][]): string[][] => {
      return arrays.reduce<string[][]>(
        (acc, curr) => acc.flatMap((d) => curr.map((e) => [...d, e])),
        [[]]
      );
    };

    const combinations = cartesian(validGroups.map((g) => g.values));

    return combinations.map((combo) => {
      const title = combo.join(' / ');
      const existing = matrix.find((m) => m.title === title);

      return {
        id: existing?.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        price: existing?.price ?? basePrice ?? 0,
        compareAtPrice: existing?.compareAtPrice,
        stockQuantity: existing?.stockQuantity ?? 10,
        isAvailable: existing?.isAvailable ?? true,
      };
    });
  };

  useEffect(() => {
    const formattedOptions: VariantOption[] = optionGroups
      .filter((g) => g.name.trim() !== '')
      .map((g) => ({
        name: g.name.trim(),
        values: g.valuesInput
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
      }));

    const newMatrix = generateCartesianMatrix(formattedOptions);
    setMatrix(newMatrix);

    onChange({
      variantOptions: formattedOptions,
      variants: newMatrix,
    });
  }, [optionGroups, basePrice]);

  const handleUpdateVariant = (index: number, key: keyof ProductVariant, value: any) => {
    const updated = [...matrix];
    updated[index] = { ...updated[index], [key]: value };
    setMatrix(updated);

    const formattedOptions: VariantOption[] = optionGroups
      .filter((g) => g.name.trim() !== '')
      .map((g) => ({
        name: g.name.trim(),
        values: g.valuesInput
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
      }));

    onChange({
      variantOptions: formattedOptions,
      variants: updated,
    });
  };

  return (
    <div className="space-y-6 border border-[#E8E2DC] p-5 rounded-xl bg-[#FAFAF7]">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-heading text-base font-bold text-[#1A1A19]">Option Groups</h3>
          <p className="text-xs text-[#6B6560]">Define attributes like Size, Color, Capacity</p>
        </div>
        <button
          type="button"
          onClick={() => setOptionGroups([...optionGroups, { name: '', valuesInput: '' }])}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A19] text-white text-xs font-semibold rounded-md hover:bg-[#1A1A19]/90"
        >
          <Plus size={14} /> Add Option Group
        </button>
      </div>

      <div className="space-y-3">
        {optionGroups.map((group, idx) => (
          <div key={idx} className="flex gap-3 items-center bg-white p-3 rounded-lg border border-[#E8E2DC]">
            <input
              type="text"
              placeholder="Option Name (e.g. Size)"
              value={group.name}
              onChange={(e) => {
                const next = [...optionGroups];
                next[idx].name = e.target.value;
                setOptionGroups(next);
              }}
              className="w-1/3 px-3 py-2 border border-[#E8E2DC] rounded-md text-xs font-medium text-[#1A1A19]"
            />
            <input
              type="text"
              placeholder="Values, comma separated (e.g. S, M, L, XL)"
              value={group.valuesInput}
              onChange={(e) => {
                const next = [...optionGroups];
                next[idx].valuesInput = e.target.value;
                setOptionGroups(next);
              }}
              className="w-2/3 px-3 py-2 border border-[#E8E2DC] rounded-md text-xs text-[#1A1A19]"
            />
            {optionGroups.length > 1 && (
              <button
                type="button"
                onClick={() => setOptionGroups(optionGroups.filter((_, i) => i !== idx))}
                className="text-[#C43A3A] p-1 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {matrix.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[#E8E2DC]">
          <h4 className="font-heading text-sm font-bold text-[#1A1A19]">
            Generated Combinations ({matrix.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {matrix.map((variant, idx) => (
              <div
                key={variant.id || idx}
                className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E8E2DC] text-xs"
              >
                <span className="font-bold text-[#1A1A19] w-1/3 truncate">{variant.title}</span>

                <div className="flex items-center gap-2">
                  <span className="text-[#6B6560]">Price:</span>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleUpdateVariant(idx, 'price', parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 border border-[#E8E2DC] rounded font-bold text-[#1A1A19]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#6B6560]">Stock:</span>
                  <input
                    type="number"
                    value={variant.stockQuantity || 0}
                    onChange={(e) => handleUpdateVariant(idx, 'stockQuantity', parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-[#E8E2DC] rounded text-[#1A1A19]"
                  />
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={variant.isAvailable}
                    onChange={(e) => handleUpdateVariant(idx, 'isAvailable', e.target.checked)}
                  />
                  <span className="text-xs">Active</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
