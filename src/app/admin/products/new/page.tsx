'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { FiUpload, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface ProductForm {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  basePrice: number;
  baseDiscountPrice: number;
  totalStock: number;
  isFeatured: boolean;
  isHotSelling: boolean;
  isNewArrival: boolean;
}

interface Variant {
  size: string;
  price: number;
  discountPrice: number;
  stock: number;
  sku: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([
    { size: '500g', price: 0, discountPrice: 0, stock: 0, sku: '' }
  ]);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductForm>({
    defaultValues: {
      categoryId: '',
      isFeatured: false,
      isHotSelling: false,
      isNewArrival: true,
    }
  });

  const title = watch('title');
  const sectionClass = 'rounded-2xl border border-white/10 bg-[#0a0a0a] p-6';
  const fieldClass = 'w-full rounded-xl border border-white/15 bg-[#1a1a1a] px-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-amber-400/70';
  const labelClass = 'mb-1 block text-sm font-medium text-slate-100';
  const tinyLabelClass = 'mb-1 block text-xs text-slate-400';

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await adminAPI.getAllCategories();
        const list = data?.categories || [];
        setCategories(list);
        if (list.length > 0) {
          setValue('categoryId', list[0]._id);
        }
      } catch {
        toast.error('Failed to load categories');
      }
    };

    loadCategories();
  }, [setValue]);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setValue('slug', slug);
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', price: 0, discountPrice: 0, stock: 0, sku: '' }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      const selected = Array.from(files);
      const { data } = await adminAPI.uploadImages(selected);
      const urls = (data.images || []).map((img: any) => img.url).filter(Boolean);
      if (urls.length === 0) {
        toast.error('Upload succeeded but returned no URLs');
        return;
      }
      setImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductForm) => {
    if (variants.some(v => !v.size || v.price <= 0)) {
      toast.error('Please fill all variant details');
      return;
    }
    if (images.length === 0) {
      toast.error('Please upload at least 1 product image');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...data,
        images: images.map((url, i) => ({ url, alt: `${data.title} ${i + 1}` })),
        variants: variants.filter(v => v.size),
        ingredients: ingredients.filter(i => i.trim()),
        isActive: true,
      };

      await adminAPI.createProduct(productData);
      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#050505] p-1">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Product Title *</label>
              <input
                {...register('title', { required: 'Title is required' })}
                onChange={(e) => {
                  register('title').onChange(e);
                  handleTitleChange(e);
                }}
                className={fieldClass}
                placeholder="e.g., Creamy Peanut Butter"
              />
              {errors.title && <p className="mt-1 text-sm text-[#EF4444]">{errors.title.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Slug *</label>
              <input
                {...register('slug', { required: 'Slug is required' })}
                className={fieldClass}
                placeholder="creamy-peanut-butter"
              />
              {errors.slug && <p className="mt-1 text-sm text-[#EF4444]">{errors.slug.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Category *</label>
              <select {...register('categoryId', { required: true })} className={fieldClass}>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Total Stock *</label>
              <input
                type="number"
                {...register('totalStock', { required: true, min: 0 })}
                className={fieldClass}
                placeholder="100"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Short Description</label>
              <input
                {...register('shortDescription')}
                className={fieldClass}
                placeholder="Brief description for product cards..."
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Full Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className={`${fieldClass} resize-none`}
                placeholder="Detailed product description..."
              />
              {errors.description && <p className="mt-1 text-sm text-[#EF4444]">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Pricing</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Base Price (Rs.) *</label>
              <input
                type="number"
                {...register('basePrice', { required: true, min: 1 })}
                className={fieldClass}
                placeholder="1500"
              />
            </div>

            <div>
              <label className={labelClass}>Discounted Price (Rs.)</label>
              <input
                type="number"
                {...register('baseDiscountPrice')}
                className={fieldClass}
                placeholder="1200"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Product Images</h2>
            <label className={`btn-outline flex items-center gap-2 cursor-pointer ${uploadingImages ? 'opacity-50 pointer-events-none' : ''}`}>
              <FiUpload className="w-5 h-5" />
              {uploadingImages ? 'Uploading...' : 'Upload Images'}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleUploadImages(e.target.files)}
              />
            </label>
          </div>

          {images.length === 0 ? (
            <p className="text-sm text-slate-400">Upload at least 1 image (stored in Supabase Storage).</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((url, index) => (
                <div key={`${url}-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-[#1a1a1a]">
                  <Image src={url} alt={`Product image ${index + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 rounded-full bg-black/75 p-2 shadow transition hover:bg-black/90"
                    aria-label="Remove image"
                  >
                    <FiX className="w-4 h-4 text-slate-100" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variants */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Variants (Sizes)</h2>
            <button
              type="button"
              onClick={addVariant}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1"
            >
              <FiPlus className="w-4 h-4" /> Add Variant
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="flex items-start gap-4 rounded-lg border border-white/10 bg-[#121212] p-4">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className={tinyLabelClass}>Size</label>
                    <input
                      value={variant.size}
                      onChange={(e) => updateVariant(index, 'size', e.target.value)}
                      className={`${fieldClass} text-sm`}
                      placeholder="500g"
                    />
                  </div>
                  <div>
                    <label className={tinyLabelClass}>Price</label>
                    <input
                      type="number"
                      value={variant.price || ''}
                      onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                      className={`${fieldClass} text-sm`}
                      placeholder="1500"
                    />
                  </div>
                  <div>
                    <label className={tinyLabelClass}>Sale Price</label>
                    <input
                      type="number"
                      value={variant.discountPrice || ''}
                      onChange={(e) => updateVariant(index, 'discountPrice', Number(e.target.value))}
                      className={`${fieldClass} text-sm`}
                      placeholder="1200"
                    />
                  </div>
                  <div>
                    <label className={tinyLabelClass}>Stock</label>
                    <input
                      type="number"
                      value={variant.stock || ''}
                      onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                      className={`${fieldClass} text-sm`}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className={tinyLabelClass}>SKU</label>
                    <input
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      className={`${fieldClass} text-sm`}
                      placeholder="PB-500"
                    />
                  </div>
                </div>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="mt-5 rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Ingredients</h2>
            <button
              type="button"
              onClick={addIngredient}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1"
            >
              <FiPlus className="w-4 h-4" /> Add Ingredient
            </button>
          </div>

          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  className={`${fieldClass} flex-1`}
                  placeholder="e.g., Roasted Peanuts"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="rounded-lg p-3 text-red-400 transition hover:bg-red-500/10"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Flags */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Product Flags</h2>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isFeatured')}
                className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
              />
              <span className="text-slate-300">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isHotSelling')}
                className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
              />
              <span className="text-slate-300">Hot Selling</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isNewArrival')}
                className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
              />
              <span className="text-slate-300">New Arrival</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
