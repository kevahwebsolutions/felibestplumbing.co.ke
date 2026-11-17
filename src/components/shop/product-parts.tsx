'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Cog, CookingPot, Drill, Droplets, Eye, Filter, Flame, Pipette, ShoppingBag, ShowerHead, Toilet, Waves, Wind, Wrench } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Pill } from '@/components/ui/misc';
import { flyToCart, useCart } from '@/store/cart';
import { track } from '@/lib/track';
import { cn, formatKES } from '@/lib/utils';
import type { ProductView } from '@/lib/server/products';

const ART: Record<string, { Icon: React.ComponentType<{ className?: string }>; from: string; to: string }> = {
  sinks: { Icon: CookingPot, from: '#e3f1ff', to: '#a9d6fd' },
  faucets: { Icon: Droplets, from: '#e3f1ff', to: '#7cc0fc' },
  pumps: { Icon: Drill, from: '#fff4ef', to: '#ffb89d' },
  drains: { Icon: Waves, from: '#e3f1ff', to: '#a9d6fd' },
  showers: { Icon: ShowerHead, from: '#f2f9ff', to: '#7cc0fc' },
  'pipe-fittings': { Icon: Pipette, from: '#fff4ef', to: '#ffcdb8' },
  'steam-showers': { Icon: Wind, from: '#f2f9ff', to: '#cde7fe' },
  valves: { Icon: Cog, from: '#fff4ef', to: '#ffb89d' },
  'water-filtration': { Icon: Filter, from: '#e3f1ff', to: '#7cc0fc' },
  'water-heaters': { Icon: Flame, from: '#fff4ef', to: '#ff9d7a' },
  'toilet-parts': { Icon: Toilet, from: '#f2f9ff', to: '#a9d6fd' },
  accessories: { Icon: Wrench, from: '#e3f1ff', to: '#cde7fe' },
};

/** Clay-style category illustration used when a product has no photo. */
export function ProductArt({ category, className }: { category: string; className?: string }) {
  const a = ART[category] ?? ART.accessories!;
  const warm = a.to.startsWith('#ff');
  return (
    <div className={cn('relative grid size-full place-items-center overflow-hidden', className)} style={{ background: `linear-gradient(145deg, ${a.from}, ${a.to})` }} aria-hidden>
      <span className="bubble !left-[10%] !top-[12%] size-10 opacity-80" />
      <span className="bubble !bottom-[14%] !right-[12%] size-7 opacity-80" />
      <span
        className="grid size-[46%] max-h-36 max-w-36 place-items-center rounded-[32%] text-white"
        style={{
          background: warm ? 'radial-gradient(circle at 30% 25%, #ff8a63, #bf3208 75%)' : 'radial-gradient(circle at 30% 25%, #7cc0fc, #0c4c93 75%)',
          boxShadow: '0 18px 26px -10px rgb(8 47 92 / 0.55), inset 6px 7px 12px rgb(255 255 255 / 0.55), inset -7px -9px 14px rgb(6 31 61 / 0.4)',
        }}
      >
        <a.Icon className="size-1/2 drop-shadow-[0_3px_3px_rgb(6_31_61/0.45)]" />
      </span>
    </div>
  );
}

export function ProductImage({ p, sizes, priority = false, className }: { p: ProductView; sizes: string; priority?: boolean; className?: string }) {
  const first = p.images[0];
  if (!first) return <ProductArt category={p.categorySlug} className={className} />;
  return <Image src={first.url} alt={first.alt || p.name} fill sizes={sizes} priority={priority} className={cn('object-cover', className)} />;
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Pill className="!text-cta-600">Out of stock</Pill>;
  if (stock <= 5) return <Pill tone="orange">Only {stock} left</Pill>;
  return <Pill tone="green"><Check className="size-3.5" aria-hidden /> In stock</Pill>;
}

export function AddToCartButton({ product, qty = 1, size = 'md', className, label = 'Add to cart' }: { product: ProductView; qty?: number; size?: 'sm' | 'md' | 'lg'; className?: string; label?: string }) {
  const add = useCart((s) => s.add);
  const ref = React.useRef<HTMLButtonElement>(null);
  const [done, setDone] = React.useState(false);
  const out = product.stock <= 0;
  return (
    <Button
      ref={ref}
      size={size}
      className={className}
      disabled={out}
      aria-label={out ? `${product.name} is out of stock` : `${label}: ${product.name}`}
      onClick={() => {
        add({ productId: product.id, slug: product.slug, name: product.name, price: product.finalPrice, stock: product.stock, image: product.images[0]?.url ?? null, category: product.categoryName }, qty);
        flyToCart(ref.current, product.images[0]?.url ?? null);
        track('add_to_cart', { productId: product.id, path: `/shop/${product.slug}` });
        toast.success(`${product.name} added to your cart`);
        setDone(true);
        window.setTimeout(() => setDone(false), 1600);
      }}
    >
      {done ? <Check className="size-5" aria-hidden /> : <ShoppingBag className="size-5" aria-hidden />}
      {out ? 'Out of stock' : done ? 'Added' : label}
    </Button>
  );
}

export function PriceTag({ p, size = 'md' }: { p: ProductView; size?: 'md' | 'lg' }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn('font-heading font-extrabold text-navy-700', size === 'lg' ? 'text-3xl' : 'text-xl')}>{formatKES(p.finalPrice)}</span>
      {p.onSale ? <del className="text-sm text-muted" aria-label={`Was ${formatKES(p.price)}`}>{formatKES(p.price)}</del> : null}
    </p>
  );
}

export function ProductCard({ p, view = 'grid', onQuickView, priority = false }: { p: ProductView; view?: 'grid' | 'list'; onQuickView?: (p: ProductView) => void; priority?: boolean }) {
  const reduce = useReducedMotion();
  const list = view === 'list';
  return (
    <motion.article
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 170, damping: 22 }}
      className={cn('clay-card clay-card-hover group flex overflow-hidden', list ? 'flex-col sm:flex-row' : 'flex-col')}
    >
      <div className={cn('relative shrink-0 overflow-hidden', list ? 'aspect-[4/3] sm:aspect-auto sm:w-56 md:w-64' : 'aspect-[4/3]')}>
        <Link href={`/shop/${p.slug}`} tabIndex={-1} aria-hidden className="relative block size-full transition-transform duration-500 group-hover:scale-105">
          <ProductImage p={p} sizes={list ? '256px' : '(min-width:1280px) 22vw, (min-width:768px) 33vw, 50vw'} priority={priority} />
        </Link>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {p.isNew ? <Pill tone="blue">New</Pill> : null}
          {p.onSale ? <Pill tone="orange">Sale</Pill> : null}
        </div>
        {onQuickView ? (
          <button type="button" onClick={() => onQuickView(p)} aria-label={`Quick view ${p.name}`} className="clay-chip absolute bottom-3 right-3 !min-h-11 w-11 justify-center !px-0 opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:focus-visible:opacity-100">
            <Eye className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs font-extrabold uppercase tracking-wider text-muted">{p.categoryName}</p>
        <h3 className="font-heading text-lg font-extrabold leading-snug">
          <Link href={`/shop/${p.slug}`} className="text-ink hover:text-navy-600">{p.name}</Link>
        </h3>
        {list ? <p className="line-clamp-2 text-sm text-muted">{p.description}</p> : null}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
          <PriceTag p={p} />
          <StockBadge stock={p.stock} />
        </div>
        <AddToCartButton product={p} size="sm" className="w-full" />
      </div>
    </motion.article>
  );
}

export function ProductSkeleton({ view = 'grid' }: { view?: 'grid' | 'list' }) {
  return (
    <div className={cn('clay-card flex overflow-hidden', view === 'list' ? 'flex-col sm:flex-row' : 'flex-col')} aria-hidden>
      <div className={cn('skeleton !rounded-none', view === 'list' ? 'aspect-[4/3] sm:w-64' : 'aspect-[4/3]')} />
      <div className="flex-1 space-y-3 p-5">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-5 w-4/5" />
        <div className="skeleton h-5 w-1/2" />
        <div className="skeleton h-11 w-full !rounded-full" />
      </div>
    </div>
  );
}
