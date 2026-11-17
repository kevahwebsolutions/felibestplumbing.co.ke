'use client';

import * as React from 'react';
import Image from 'next/image';
import { Search, Star, Truck } from 'lucide-react';
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
        className="clay-card relative aspect-square cursor-zoom-in overflow-hidden !rounded-[36px] p-2"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <div className="relative size-full overflow-hidden rounded-[30px]">
          {img ? (
            <Image src={img.url} alt={img.alt || p.name} fill priority sizes="(min-width:1024px) 560px, 100vw" className="object-cover transition-transform duration-200" style={zoom ? { transform: 'scale(2)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
          ) : (
            <ProductArt category={p.categorySlug} />
          )}
        </div>
        {img ? <span className="clay-pill absolute bottom-5 left-5"><Search className="size-3.5" aria-hidden /> Hover to zoom</span> : null}
        <div className="absolute left-5 top-5 flex gap-2">{p.isNew ? <Pill>New</Pill> : null}{p.onSale ? <Pill tone="orange">Sale</Pill> : null}</div>
      </div>
      {p.images.length > 1 ? (
        <ul className="mt-4 grid grid-cols-4 gap-3" aria-label="Product photos">
          {p.images.map((im, i) => (
            <li key={im.id}>
              <button type="button" onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} aria-pressed={i === active} className={cn('clay-card relative block aspect-square w-full overflow-hidden !rounded-2xl p-1', i === active && 'ring-4 ring-navy-600/70')}>
                <Image src={im.url} alt="" fill sizes="120px" className="rounded-xl object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ProductBuyBox({ p, freeThreshold, fee }: { p: ProductView; freeThreshold: number; fee: number }) {
  const [qty, setQty] = React.useState(1);
  React.useEffect(() => { track('product_view', { productId: p.id, path: `/shop/${p.slug}` }); }, [p.id, p.slug]);
  return (
    <div className="space-y-5">
      <PriceTag p={p} size="lg" />
      <div className="flex flex-wrap items-center gap-3"><StockBadge stock={p.stock} /><span className="text-sm text-muted">SKU: {p.sku || 'n/a'}</span></div>
      <div className="flex flex-wrap items-center gap-4">
        <QtyStepper value={qty} max={p.stock} onChange={(n) => setQty(Math.max(1, n))} label={p.name} />
        <AddToCartButton product={p} qty={qty} size="lg" className="flex-1 sm:flex-none" />
      </div>
      <p className="clay-card-sky flex items-start gap-3 !rounded-3xl p-4 text-sm font-semibold text-navy-800"><Truck className="mt-0.5 size-5 shrink-0" aria-hidden />
        Delivery from {fee === 0 ? 'free' : `KES ${fee.toLocaleString('en-KE')}`}{freeThreshold > 0 ? `, free on orders over KES ${freeThreshold.toLocaleString('en-KE')}` : ''}. Pay on delivery or order via WhatsApp.</p>
    </div>
  );
}

export function ProductTabs({ p }: { p: ProductView }) {
  return (
    <Tabs defaultValue="desc">
      <TabsList aria-label="Product information">
        <TabsTrigger value="desc">Description</TabsTrigger>
        <TabsTrigger value="info">Additional information</TabsTrigger>
        <TabsTrigger value="reviews">Reviews (0)</TabsTrigger>
      </TabsList>
      <TabsContent value="desc"><div className="prose-clay"><p>{p.description || 'No description yet.'}</p></div></TabsContent>
      <TabsContent value="info">
        {p.specs.length ? (
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[220px_1fr]">
            {p.specs.map((s) => (<React.Fragment key={s.key}><dt className="font-bold text-ink">{s.key}</dt><dd className="text-body">{s.value}</dd></React.Fragment>))}
          </dl>
        ) : <p className="text-muted">No additional information for this product.</p>}
      </TabsContent>
      <TabsContent value="reviews">
        <p className="flex items-center gap-2 text-body"><Star className="size-5 text-cta-500" aria-hidden /> There are no reviews yet. Bought this product? Tell us about it through our contact page.</p>
      </TabsContent>
    </Tabs>
  );
}
