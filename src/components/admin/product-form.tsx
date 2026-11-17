'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GripVertical, Loader2, Plus, Star, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { saveProductAction, uploadImageAction } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { Checkbox, Switch } from '@/components/ui/misc';
import { productSchema, type ProductInput } from '@/lib/schemas';
import { cn, slugify } from '@/lib/utils';

export type ProductFormInitial = {
  id?: number; name: string; slug: string; categoryId: number | null; description: string; price: number; salePrice: number | null; sku: string; stock: number;
  tags: string[]; specs: { key: string; value: string }[]; featured: boolean; published: boolean; isNew: boolean; isPlaceholderPrice: boolean;
  images: { src: string; url: string; alt: string }[]; primaryIndex: number;
};

export const EMPTY_PRODUCT: ProductFormInitial = { name: '', slug: '', categoryId: null, description: '', price: 0, salePrice: null, sku: '', stock: 0, tags: [], specs: [], featured: false, published: false, isNew: false, isPlaceholderPrice: false, images: [], primaryIndex: 0 };

const urlFor = (src: string) => (src.startsWith('/') ? src : `/media/${src}`);

export function ProductForm({ initial, categories }: { initial: ProductFormInitial; categories: { id: number; name: string }[] }) {
  const router = useRouter();
  const [images, setImages] = React.useState(initial.images);
  const [primary, setPrimary] = React.useState(initial.primaryIndex);
  const [tags, setTags] = React.useState(initial.tags.join(', '));
  const [uploading, setUploading] = React.useState(false);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [slugTouched, setSlugTouched] = React.useState(!!initial.id);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const { register, control, handleSubmit, watch, setValue, setError, formState: { errors, isSubmitting } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as never,
    defaultValues: { id: initial.id, name: initial.name, slug: initial.slug, categoryId: initial.categoryId, description: initial.description, price: initial.price, salePrice: initial.salePrice, sku: initial.sku, stock: initial.stock, specs: initial.specs, featured: initial.featured, published: initial.published, isNew: initial.isNew, isPlaceholderPrice: initial.isPlaceholderPrice },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'specs' });
  const name = watch('name');
  React.useEffect(() => { if (!slugTouched) setValue('slug', slugify(name ?? '')); }, [name, slugTouched, setValue]);
  const err = (n: keyof ProductInput) => errors[n]?.message as string | undefined;

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      if (images.length >= 12) { toast.error('Maximum 12 images'); break; }
      const fd = new FormData();
      fd.set('file', file);
      const res = await uploadImageAction(fd);
      if (res.ok && res.name) setImages((cur) => [...cur, { src: res.name!, url: urlFor(res.name!), alt: '' }]);
      else toast.error(res.error ?? 'Upload failed');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  function move(from: number, to: number) {
    if (from === to) return;
    setImages((cur) => { const next = [...cur]; const [m] = next.splice(from, 1); next.splice(to, 0, m!); return next; });
    setPrimary((p) => (p === from ? to : from < p && to >= p ? p - 1 : from > p && to <= p ? p + 1 : p));
  }

  const onSubmit = handleSubmit(async (v) => {
    const payload = { ...v, id: initial.id, tags: tags.split(',').map((t) => t.trim()).filter(Boolean), images: images.map((i) => ({ src: i.src, alt: i.alt })), primaryIndex: primary };
    const res = await saveProductAction(payload);
    if (!res.ok) {
      for (const [k, m] of Object.entries(res.fieldErrors ?? {})) setError(k.split('.')[0] as keyof ProductInput, { message: m });
      toast.error(res.error ?? 'Could not save');
      return;
    }
    toast.success('Product saved');
    router.push('/admin/products');
    router.refresh();
  });

  const num = (n: 'price' | 'salePrice' | 'stock') => register(n, { setValueAs: (v) => (v === '' || v == null ? (n === 'salePrice' ? null : 0) : Number(v)) });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        <section className="clay-card space-y-5 p-6" aria-label="Basics">
          <Field label="Product name" htmlFor="p-name" error={err('name')}><Input id="p-name" aria-invalid={!!errors.name} {...register('name')} /></Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="URL slug" htmlFor="p-slug" error={err('slug')} hint="Created from the name. Edit to customise."><Input id="p-slug" {...register('slug', { onChange: () => setSlugTouched(true) })} /></Field>
            <Field label="SKU" htmlFor="p-sku" error={err('sku')}><Input id="p-sku" {...register('sku')} /></Field>
          </div>
          <Field label="Category" htmlFor="p-cat" error={err('categoryId')}>
            <Controller control={control} name="categoryId" render={({ field }) => (
              <Select id="p-cat" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}><option value="">Uncategorised</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
            )} />
          </Field>
          <Field label="Tags" htmlFor="p-tags" hint="Separate with commas, for example Installation, Repair"><Input id="p-tags" value={tags} onChange={(e) => setTags(e.target.value)} /></Field>
          <Field label="Description" htmlFor="p-desc" error={err('description')}><Textarea id="p-desc" rows={7} {...register('description')} /></Field>
        </section>

        <section className="clay-card space-y-4 p-6" aria-label="Specifications">
          <div className="flex items-center justify-between"><h2 className="font-heading text-xl font-extrabold">Specifications</h2><Button type="button" size="sm" variant="ghost" onClick={() => append({ key: '', value: '' })}><Plus className="size-4" aria-hidden /> Add row</Button></div>
          {fields.length === 0 ? <p className="text-muted">No specifications yet.</p> : null}
          {fields.map((f, i) => (
            <div key={f.id} className="grid grid-cols-[1fr_1fr_auto] items-center gap-3">
              <Input aria-label={`Specification ${i + 1} name`} placeholder="Name" {...register(`specs.${i}.key` as const)} />
              <Input aria-label={`Specification ${i + 1} value`} placeholder="Value" {...register(`specs.${i}.value` as const)} />
              <button type="button" onClick={() => remove(i)} aria-label={`Remove specification ${i + 1}`} className="clay-chip !min-h-11 w-11 justify-center !px-0 text-cta-600"><Trash2 className="size-4" aria-hidden /></button>
            </div>
          ))}
        </section>

        <section className="clay-card space-y-4 p-6" aria-label="Images">
          <h2 className="font-heading text-xl font-extrabold">Images</h2>
          <p className="text-sm text-muted">Drag to reorder. The star marks the primary image. JPG, PNG or WebP up to 6 MB. Images are converted to WebP and stripped of metadata.</p>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((im, i) => (
              <li key={im.src} draggable onDragStart={() => setDragIndex(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (dragIndex !== null) move(dragIndex, i); setDragIndex(null); }} className={cn('clay-card relative !rounded-3xl p-2', dragIndex === i && 'opacity-50')}>
                <div className="relative aspect-square overflow-hidden rounded-2xl"><Image src={im.url} alt={im.alt || `Product image ${i + 1}`} fill sizes="160px" className="object-cover" /></div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="cursor-grab p-2 text-muted" aria-hidden><GripVertical className="size-4" /></span>
                  <button type="button" aria-pressed={primary === i} aria-label={primary === i ? 'Primary image' : 'Make primary image'} onClick={() => setPrimary(i)} className={cn('clay-chip !min-h-11 w-11 justify-center !px-0', primary === i && 'text-cta-500')}><Star className={cn('size-4', primary === i && 'fill-current')} aria-hidden /></button>
                  <button type="button" aria-label="Remove image" onClick={() => { setImages((c) => c.filter((_, k) => k !== i)); setPrimary((p) => (p > i ? p - 1 : p === i ? 0 : p)); }} className="clay-chip !min-h-11 w-11 justify-center !px-0 text-cta-600"><Trash2 className="size-4" aria-hidden /></button>
                </div>
                <div className="mt-1 flex gap-1 sm:hidden"><Button type="button" size="sm" variant="ghost" className="flex-1" onClick={() => move(i, Math.max(0, i - 1))}>Left</Button><Button type="button" size="sm" variant="ghost" className="flex-1" onClick={() => move(i, Math.min(images.length - 1, i + 1))}>Right</Button></div>
              </li>
            ))}
          </ul>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" id="p-files" onChange={(e) => onFiles(e.target.files)} />
          <label htmlFor="p-files" className="clay-button clay-button-ghost w-fit cursor-pointer">{uploading ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Upload className="size-5" aria-hidden />} {uploading ? 'Uploading...' : 'Upload images'}</label>
        </section>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <section className="clay-card space-y-5 p-6" aria-label="Pricing and stock">
          <h2 className="font-heading text-xl font-extrabold">Pricing and stock</h2>
          <Field label="Price (KES)" htmlFor="p-price" error={err('price')}><Input id="p-price" type="number" min={0} step={50} inputMode="numeric" {...num('price')} /></Field>
          <Field label="Sale price (KES, optional)" htmlFor="p-sale" error={err('salePrice')}><Input id="p-sale" type="number" min={0} step={50} inputMode="numeric" {...num('salePrice')} /></Field>
          <Field label="Stock" htmlFor="p-stock" error={err('stock')}><Input id="p-stock" type="number" min={0} inputMode="numeric" {...num('stock')} /></Field>
        </section>
        <section className="clay-card space-y-4 p-6" aria-label="Visibility">
          <h2 className="font-heading text-xl font-extrabold">Visibility</h2>
          {([['published', 'Published in the shop'], ['featured', 'Featured on the home page'], ['isNew', 'Show a New badge']] as const).map(([k, label]) => (
            <Controller key={k} control={control} name={k} render={({ field }) => (
              <div className="flex items-center justify-between gap-4"><label htmlFor={`sw-${k}`} className="font-bold text-ink">{label}</label><Switch id={`sw-${k}`} checked={!!field.value} onCheckedChange={field.onChange} /></div>
            )} />
          ))}
          <Controller control={control} name="isPlaceholderPrice" render={({ field }) => (
            <div className="flex items-start gap-3"><Checkbox id="ph" checked={!!field.value} onCheckedChange={(v) => field.onChange(v === true)} /><label htmlFor="ph" className="text-sm font-semibold text-ink">This is still a placeholder price<span className="block font-normal text-muted">Untick once you have confirmed the real price.</span></label></div>
          )} />
        </section>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || uploading}>{isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null} Save product</Button>
      </aside>
    </form>
  );
}
