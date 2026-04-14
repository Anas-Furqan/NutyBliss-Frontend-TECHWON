'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { FiUpload, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminAPI } from '@/lib/api';

interface ProductForm {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  basePrice: number;
  baseDiscountPrice: number;
  totalStock: number;
  isFeatured: boolean;
  isHotSelling: boolean;
  isNewArrival: boolean;
  isActive: boolean;
}

interface Variant {
  size: string;
  price: number;
  discountPrice: number;
  stock: number;
  sku: string;
}

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [ingredients, setIngredients] = useState<string[]>(['']);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductForm>();

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getProductAdmin(id);
      const p = data.product;
      reset({
        title: p.title,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription || '',
        category: p.category,
        basePrice: p.basePrice,
        baseDiscountPrice: p.baseDiscountPrice || 0,
        totalStock: p.totalStock,
        isFeatured: !!p.isFeatured,
        isHotSelling: !!p.isHotSelling,
        isNewArrival: !!p.isNewArrival,
        isActive: p.isActive !== false,
      });
      setImages((p.images || []).map((x: any) => x.url).filter(Boolean));
      setVariants((p.variants || []).map((v: any) => ({
        size: v.size,
        price: v.price,
        discountPrice: v.discountPrice || 0,
        stock: v.stock || 0,
        sku: v.sku || '',
      })));
      setIngredients((p.ingredients && p.ingredients.length > 0) ? p.ingredients : ['']);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id, reset]);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id, fetchProduct]);

  const handleTitleChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setValue('slug', slug);
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      const selected = Array.from(files);
      const { data } = await adminAPI.uploadImages(selected);
      const urls = (data.images || []).map((img: any) => img.url).filter(Boolean);
      setImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const addVariant = () => setVariants((prev) => [...prev, { size: '', price: 0, discountPrice: 0, stock: 0, sku: '' }]);
  const removeVariant = (index: number) => setVariants((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value } as Variant;
      return copy;
    });
  };

  const addIngredient = () => setIngredients((prev) => [...prev, '']);
  const removeIngredient = (index: number) => setIngredients((prev) => prev.filter((_, i) => i !== index));
  const updateIngredient = (index: number, value: string) => {
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const onSubmit = async (form: ProductForm) => {
    if (variants.length === 0 || variants.some((v) => !v.size || v.price <= 0)) {
      toast.error('Please fill all variant details');
      return;
    }
    if (images.length === 0) {
      toast.error('Please keep at least 1 image');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        images: images.map((url, i) => ({ url, alt: `${form.title} ${i + 1}` })),
        variants,
        ingredients: ingredients.filter((i) => i.trim()),
      };
      await adminAPI.updateProduct(id, payload);
      toast.success('Product updated');
      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
              <input
                {...register('title', { required: 'Title is required' })}
                onChange={(e) => {
                  register('title').onChange(e);
                  handleTitleChange(e.target.value);
                }}
                className="input-field"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input {...register('slug', { required: 'Slug is required' })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select {...register('category')} className="input-field">
                <option value="peanut-butter">Peanut Butter</option>
                <option value="oats">Oats</option>
                <option value="bundles">Bundles</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock *</label>
              <input type="number" {...register('totalStock', { required: true, min: 0 })} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input {...register('shortDescription')} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
              <textarea {...register('description', { required: 'Description is required' })} rows={4} className="input-field resize-none" />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (Rs.) *</label>
              <input type="number" {...register('basePrice', { required: true, min: 1 })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (Rs.)</label>
              <input type="number" {...register('baseDiscountPrice')} className="input-field" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
            <label className={`btn-outline flex items-center gap-2 cursor-pointer ${uploadingImages ? 'opacity-50 pointer-events-none' : ''}`}>
              <FiUpload className="w-5 h-5" />
              {uploadingImages ? 'Uploading...' : 'Upload Images'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUploadImages(e.target.files)} />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((url, index) => (
              <div key={`${url}-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border">
                <Image src={url} alt={`Product image ${index + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow"
                >
                  <FiX className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Variants (Sizes)</h2>
            <button type="button" onClick={addVariant} className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1">
              <FiPlus className="w-4 h-4" /> Add Variant
            </button>
          </div>
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Size</label>
                    <input value={variant.size} onChange={(e) => updateVariant(index, 'size', e.target.value)} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Price</label>
                    <input type="number" value={variant.price || ''} onChange={(e) => updateVariant(index, 'price', Number(e.target.value))} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Sale Price</label>
                    <input type="number" value={variant.discountPrice || ''} onChange={(e) => updateVariant(index, 'discountPrice', Number(e.target.value))} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Stock</label>
                    <input type="number" value={variant.stock || ''} onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">SKU</label>
                    <input value={variant.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} className="input-field text-sm" />
                  </div>
                </div>
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-5">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
            <button type="button" onClick={addIngredient} className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1">
              <FiPlus className="w-4 h-4" /> Add Ingredient
            </button>
          </div>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input value={ingredient} onChange={(e) => updateIngredient(index, e.target.value)} className="input-field flex-1" />
                <button type="button" onClick={() => removeIngredient(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Flags</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500" />
              <span className="text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isHotSelling')} className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500" />
              <span className="text-gray-700">Hot Selling</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isNewArrival')} className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500" />
              <span className="text-gray-700">New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500" />
              <span className="text-gray-700">Active</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="btn-outline">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

