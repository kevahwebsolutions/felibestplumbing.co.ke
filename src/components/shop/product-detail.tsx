'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Search, Star, Truck, Wrench } from 'lucide-react';
import { AddToCartButton, PriceTag, ProductArt, StockBadge } from './product-parts';
import { QtyStepper } from './cart-parts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pill } from '@/components/ui/misc';
import { track } from '@/lib/track';
import { cn } from '@/lib/utils';
import type { ProductView } from '@/lib/server/products';

export function ProductGallery({ p }: { p: ProductView }) {
  const [active, setActive] = React.useState(0);
  const [zoom, setZoom] = React.useState<{ x: number; y: number } | null>(null);
  const img = p.images[active];
  return (
    <div>
      <div
        className="fp-card relative aspect-square cursor-zoom-in overflow-hidden rounded-lg p-2"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <div className="relative size-full overflow-hidden rounded-md">
          {img ? (
            <Image src={img.url} alt={img.alt || p.name} fill priority sizes="(min-width:1024px) 560px, 100vw" className="object-cover transition-transform duration-200" style={zoom ? { transform: 'scale(2)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
          ) : (
            <ProductArt category={p.categorySlug} />
          )}
        </div>
        {img ? <span className="fp-pill absolute bottom-5 left-5"><Search className="size-3.5" aria-hidden /> Hover to zoom</span> : null}
        <div className="absolute left-5 top-5 flex gap-2">{p.isNew ? <Pill>New</Pill> : null}{p.onSale ? <Pill tone="orange">Sale</Pill> : null}</div>
      </div>
      {p.images.length > 1 ? (
        <ul className="mt-4 grid grid-cols-4 gap-3" aria-label="Product photos">
          {p.images.map((im, i) => (
            <li key={im.id}>
              <button type="button" onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} aria-pressed={i === active} className={cn('fp-card relative block aspect-square w-full overflow-hidden p-1', i === active && '!border-brand ring-2 ring-brand')}>
                <Image src={im.url} alt="" fill sizes="120px" className="rounded object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ProductBuyBox({ p, freeThreshold, fee, phone = '' }: { p: ProductView; freeThreshold: number; fee: number; phone?: string }) {
  const [qty, setQty] = React.useState(1);
  React.useEffect(() => { track('product_view', { productId: p.id, path: `/shop/${p.slug}` }); }, [p.id, p.slug]);
  return (
    <div className="space-y-5">
      <PriceTag p={p} size="lg" />
      <div className="flex flex-wrap items-center gap-3"><StockBadge stock={p.stock} /><span className="text-sm text-ink-muted">SKU: {p.sku || 'n/a'}</span></div>
      <div className="flex flex-wrap items-center gap-4">
        <QtyStepper value={qty} max={p.stock} onChange={(n) => setQty(Math.max(1, n))} label={p.name} />
        <AddToCartButton product={p} qty={qty} size="lg" className="flex-1 sm:flex-none" />
      </div>
      <p className="fp-card-sky flex items-start gap-3 p-4 text-sm font-semibold text-brand-strong"><Truck className="mt-0.5 size-5 shrink-0" aria-hidden />
        Delivery from {fee === 0 ? 'free' : `KES ${fee.toLocaleString('en-KE')}`}{freeThreshold > 0 ? `, free on orders over KES ${freeThreshold.toLocaleString('en-KE')}` : ''}. Pay on delivery or order via WhatsApp.</p>
      <div className="fp-card-blue flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-start gap-3">
          <Wrench className="mt-1 size-6 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="font-heading text-2xl font-semibold uppercase text-ink">Need it installed?</p>
            <p className="text-sm text-body">Book a licensed Felibest plumber to fit it. You approve the price first.</p>
          </div>
        </div>
        <Link href="/contact#book" className="fp-button fp-button-sm">Book a plumber</Link>
        {phone ? <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="inline-flex min-h-11 items-center gap-2 font-heading text-xl font-bold tracking-wide text-white underline-offset-4 hover:underline"><Phone className="size-4" aria-hidden /> {phone}</a> : null}
      </div>
    </div>
  );
}

export function ProductTabs({ p }: { p: ProductView }) {
  return (
    <Tabs defaultValue="desc">
      <TabsList aria-label="Product information">
        <TabsTrigger value="desc">Description</TabsTrigger>
        <TabsTrigger value="info">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews (0)</TabsTrigger>
      </TabsList>
      <TabsContent value="desc"><div className="prose-fp"><p>{p.description || 'No description yet.'}</p></div></TabsContent>
      <TabsContent value="info">
        {p.specs.length ? (
          <table className="w-full text-left">
            <caption className="sr-only">Specifications for {p.name}</caption>
            <tbody>
              {p.specs.map((sp) => (
                <tr key={sp.key} className="border-b border-line last:border-0 odd:bg-surface-alt">
                  <th scope="row" className="w-2/5 px-4 py-3 font-semibold text-ink">{sp.key}</th>
                  <td className="px-4 py-3 text-body">{sp.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-ink-muted">No additional information for this product.</p>}
      </TabsContent>
      <TabsContent value="reviews">
        <p className="flex items-center gap-2 text-body"><Star className="size-5 text-accent" aria-hidden /> There are no reviews yet. Bought this product? Tell us about it through our contact page.</p>
      </TabsContent>
    </Tabs>
  );
}
