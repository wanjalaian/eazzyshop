'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const store = useQuery(api.stores.getByOwner);
  const categories = useQuery(
    api.categories.listByStore,
    store?._id ? { storeId: store._id } : ('skip' as any)
  );

  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const removeCategory = useMutation(api.categories.remove);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !store?._id) return;

    setSubmitting(true);
    try {
      await createCategory({
        storeId: store._id,
        name: newCategoryName.trim(),
        sortOrder: (categories?.length || 0) + 1,
      });
      toast.success('Category created!');
      setNewCategoryName('');
    } catch (err: any) {
      toast.error('Failed to create category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (categoryId: any) => {
    if (!editingName.trim() || !store?._id) return;
    try {
      await updateCategory({
        storeId: store._id,
        categoryId,
        name: editingName.trim(),
      });
      toast.success('Category updated!');
      setEditingId(null);
    } catch (err: any) {
      toast.error('Failed to update category.');
    }
  };

  const handleDelete = async (categoryId: any) => {
    if (!store?._id) return;
    if (confirm('Delete this category? Products in this category will become uncategorized.')) {
      await removeCategory({ storeId: store._id, categoryId });
      toast.success('Category deleted!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-heading text-2xl font-bold text-[#1A1A19]">Categories</h2>
        <p className="text-xs text-[#6B6560]">Organize your storefront products into browseable collections</p>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleCreate} className="bg-white p-4 rounded-xl border border-[#E8E2DC] flex gap-3">
        <input
          type="text"
          placeholder="New Category Name (e.g. Dresses, Shoes, Accessories)"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-[#E8E2DC] rounded-lg text-sm bg-[#FAFAF7] text-[#1A1A19]"
        />
        <button
          type="submit"
          disabled={submitting || !newCategoryName.trim()}
          className="px-5 py-2.5 bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Add Category
        </button>
      </form>

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-[#E8E2DC] overflow-hidden shadow-sm">
        {categories === undefined ? (
          <p className="p-6 text-sm text-[#6B6560]">Loading categories...</p>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6B6560]">
            No categories created yet. Add one above to organize your store!
          </div>
        ) : (
          <div className="divide-y divide-[#E8E2DC]">
            {categories.map((cat: any, idx: number) => (
              <div key={cat._id} className="p-4 flex items-center justify-between hover:bg-[#FAFAF7]">
                {editingId === cat._id ? (
                  <div className="flex items-center gap-2 flex-1 mr-4">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="px-3 py-1.5 border border-[#E8E2DC] rounded text-sm text-[#1A1A19] flex-1 font-bold"
                    />
                    <button
                      onClick={() => handleUpdate(cat._id)}
                      className="p-1.5 bg-[#3D7A4A] text-white rounded hover:bg-[#3D7A4A]/90"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 border border-[#E8E2DC] text-[#6B6560] rounded hover:bg-[#F5F0EB]"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-sm text-[#1A1A19]">{cat.name}</span>
                    <span className="text-xs text-[#A89F97] ml-3">/{cat.slug}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  {editingId !== cat._id && (
                    <button
                      onClick={() => {
                        setEditingId(cat._id);
                        setEditingName(cat.name);
                      }}
                      className="p-1.5 text-[#1A1A19] hover:bg-[#F5F0EB] rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-1.5 text-[#C43A3A] hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
