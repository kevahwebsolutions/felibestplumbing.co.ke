'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Eye, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PlumbGlyph, type GlyphName } from '@/components/plumb/icons';
import { Pill } from '@/components/ui/misc';
import { flyToCart, useCart } from '@/store/cart';
import { track } from '@/lib/track';
import { cn, formatKES } from '@/lib/utils';
import type { ProductView } from '@/lib/server/products';

export const CATEGORY_GLYPH: Record<string, GlyphName | 'pump' | 'sink' | 'toilet' | 'droplet'> = {
  sinks: 'sink', faucets: 'tap', pumps: 'pump', drains: 'drain', showers: 'shower', 'pipe-fittings': 'elbow', 'steam-showers': 'shower',
  valves: 'valve', 'water-filtration': 'droplet', 'water-heaters': 'geyser', 'toilet-parts': 'toilet', accessories: 'wrench',
};

/** Category illustration used when a product has no photo: fitting glyph on a brand plate over a light blueprint tint. */
export function ProductArt({ category, className }: { category: string; className?: string }) {
  const glyph = CATEGORY_GLYPH[category] ?? 'wrench';
  return (
    <div className={cn('bp-grid relative grid size-full place-items-center overflow-hidden bg-tint', className)} aria-hidden>
      <span className="fp-icon !size-28 !rounded-xl"><PlumbGlyph name={glyph} size={72} /></span>
    </div>
  );
}

const SIZE_KEY = /size|length|bore|capacity|thread|pipe|diameter/i;
export function productBrand(p: ProductView): string | null {
  return p.specs.find((x) => x.key.toLowerCase() === 'brand')?.value ?? null;
}
/** Up to three short spec chips (size, material, key spec), skipping the brand. */
export function specChips(p: ProductView): string[] {
  const rest = p.specs.filter((x) => x.key.toLowerCase() !== 'brand' && x.value.length <= 24);
  const size = rest.find((x) => SIZE_KEY.test(x.key));
  const material = rest.find((x) => /material|finish/i.test(x.key));
  const picks = [size, material, ...rest].filter((x, i, a): x is { key: string; value: string } => !!x && a.indexOf(x) === i).slice(0, 3);
  return picks.map((x) => x.value);
}

export function ProductImage({ p, sizes, priority = false, className }: { p: ProductView; sizes: string; priority?: boolean; className?: string }) {
  const first = p.images[0];
  if (!first) return <ProductArt category={p.categorySlug} className={className} />;
  return <Image src={first.url} alt={first.alt || p.name} fill sizes={sizes} priority={priority} className={cn('object-cover', className)} />;
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Pill className="!text-accent-strong">Out of stock</Pill>;
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
      {done ? <Check className="size-5" aria-hidden /> : <ShoppingCart className="size-5" aria-hidden />}
      {out ? 'Out of stock' : done ? 'Added' : label}
    </Button>
  );
}

export function PriceTag({ p, size = 'md' }: { p: ProductView; size?: 'md' | 'lg' }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn('font-heading font-bold text-brand', size === 'lg' ? 'text-5xl' : 'text-3xl')}>{formatKES(p.finalPrice)}</span>
      {p.onSale ? <del className="text-sm text-ink-muted" aria-label={`Was ${formatKES(p.price)}`}>{formatKES(p.price)}</del> : null}
    </p>
  );
}

export function ProductCard({ p, view = 'grid', onQuickView, priority = false }: { p: ProductView; view?: 'grid' | 'list'; onQuickView?: (p: ProductView) => void; priority?: boolean }) {
  const list = view === 'list';
  return (
    <article className={cn('fp-card fp-card-hover group flex overflow-hidden', list ? 'flex-col sm:flex-row' : 'flex-col')}
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
          <button type="button" onClick={() => onQuickView(p)} aria-label={`Quick view ${p.name}`} className="fp-chip absolute bottom-3 right-3 !min-h-11 w-11 justify-center !px-0 opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:focus-visible:opacity-100">
            <Eye className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
        <p className="flex flex-wrap items-center gap-x-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          <span>{p.categoryName}</span>
          {productBrand(p) ? <span className="text-brand">&middot; {productBrand(p)}</span> : null}
        </p>
        <h3 className="font-heading text-2xl font-semibold leading-tight">
          <Link href={`/shop/${p.slug}`} className="text-ink hover:text-brand">{p.name}</Link>
        </h3>
        {specChips(p).length ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Key specifications">
            {specChips(p).map((c) => <li key={c} className="rounded border border-line-strong bg-surface-alt px-2 py-0.5 text-xs font-semibold text-brand-strong">{c}</li>)}
          </ul>
        ) : null}
        {list ? <p className="line-clamp-2 text-sm text-ink-muted">{p.description}</p> : null}
        <p className="text-xs text-ink-muted">SKU: <span className="font-mono">{p.sku || 'n/a'}</span></p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <PriceTag p={p} />
          <StockBadge stock={p.stock} />
        </div>
        <AddToCartButton product={p} size="sm" className="w-full" />
      </div>
    </article>
  );
}

export function ProductSkeleton({ view = 'grid' }: { view?: 'grid' | 'list' }) {
  return (
    <div className={cn('fp-card flex overflow-hidden', view === 'list' ? 'flex-col sm:flex-row' : 'flex-col')} aria-hidden>
      <div className={cn('skeleton !rounded-none', view === 'list' ? 'aspect-[4/3] sm:w-64' : 'aspect-[4/3]')} />
      <div className="flex-1 space-y-3 p-5">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-5 w-4/5" />
        <div className="skeleton h-5 w-1/2" />
        <div className="skeleton h-11 w-full" />
      </div>
    </div>
  );
}
