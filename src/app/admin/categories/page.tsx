'use client';

import { FormEvent, useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await adminAPI.getAllCategories();
      setCategories(data?.categories || []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      await adminAPI.createCategory({ name: name.trim(), description: description.trim() || undefined });
      toast.success('Category created');
      setName('');
      setDescription('');
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create category');
    }
  };

  const onToggle = async (category: Category) => {
    try {
      await adminAPI.updateCategory(category._id, { isActive: !category.isActive });
      toast.success('Category updated');
      fetchCategories();
    } catch {
      toast.error('Failed to update category');
    }
  };

  const onStartEdit = (category: Category) => {
    setEditingId(category._id);
    setEditingName(category.name);
    setEditingDescription(category.description || '');
  };

  const onSaveEdit = async () => {
    if (!editingId || !editingName.trim()) return;
    try {
      await adminAPI.updateCategory(editingId, {
        name: editingName.trim(),
        description: editingDescription.trim() || undefined,
      });
      toast.success('Category updated');
      setEditingId(null);
      setEditingName('');
      setEditingDescription('');
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update category');
    }
  };

  const onDelete = async (category: Category) => {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    try {
      await adminAPI.deleteCategory(category._id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tighter text-slate-100">Categories</h1>
        <p className="mt-2 text-sm text-slate-400">Manage product categories for shop filters and admin product forms.</p>
      </div>

      <form onSubmit={onCreate} className="glass-card space-y-4 p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-amber-400">Create Category</p>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Category name"
            className="h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-200 outline-none"
          />
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description (optional)"
            className="h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-200 outline-none"
          />
        </div>
        <button type="submit" className="btn-primary">Add Category</button>
      </form>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-slate-400">Name</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-slate-400">Slug</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-slate-400">Status</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.14em] text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-slate-400" colSpan={4}>Loading categories...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-slate-400" colSpan={4}>No categories found.</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id} className="border-b border-white/5">
                  <td className="px-4 py-3 text-sm text-slate-200">{category.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{category.slug}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`rounded-full px-2 py-1 text-xs ${category.isActive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => onToggle(category)} className="btn-secondary !px-4">
                        {category.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button type="button" onClick={() => onStartEdit(category)} className="btn-secondary !px-4">
                        Edit
                      </button>
                      <button type="button" onClick={() => onDelete(category)} className="rounded-full border border-red-500/70 px-4 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/10">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div className="glass-card space-y-4 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-amber-400">Edit Category</p>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={editingName}
              onChange={(event) => setEditingName(event.target.value)}
              placeholder="Category name"
              className="h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-200 outline-none"
            />
            <input
              value={editingDescription}
              onChange={(event) => setEditingDescription(event.target.value)}
              placeholder="Description (optional)"
              className="h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-200 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onSaveEdit} className="btn-primary">Save</button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setEditingName('');
                setEditingDescription('');
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
