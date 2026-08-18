'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

export function VariantBuilder() {
  const [options, setOptions] = useState([{ name: '', values: '' }]);

  return (
    <div className="space-y-4 border border-[#E8E2DC] p-4 rounded-lg">
      <h3 className="text-sm font-medium">Options</h3>
      {options.map((opt, idx) => (
        <div key={idx} className="flex gap-4 items-start">
          <div className="flex-1">
            <Input placeholder="Option name (e.g. Size)" value={opt.name} onChange={e => {
              const newOptions = [...options];
              newOptions[idx].name = e.target.value;
              setOptions(newOptions);
            }} />
          </div>
          <div className="flex-[2]">
            <Input placeholder="Values, comma separated (e.g. S, M, L)" value={opt.values} onChange={e => {
              const newOptions = [...options];
              newOptions[idx].values = e.target.value;
              setOptions(newOptions);
            }} />
          </div>
          <Button type="button" variant="outline" size="icon" onClick={() => {
            setOptions(options.filter((_, i) => i !== idx));
          }}><X className="w-4 h-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setOptions([...options, { name: '', values: '' }])}>
        <Plus className="w-4 h-4 mr-2" /> Add Option
      </Button>
      {/* Auto-generated variant matrix would go here */}
    </div>
  );
}
