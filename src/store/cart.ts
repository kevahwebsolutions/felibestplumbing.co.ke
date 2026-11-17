'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { addLine, cartCount, cartSubtotal, setQty as setLineQty } from '@/lib/cart-math';

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  qty: number;
  stock: number;
  image: string | null;
  category: string;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  setQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      add: (item, qty = 1) => {
        const lines = addLine(get().items, { productId: item.productId, price: item.price, qty }, item.stock);
        const next = lines.map((l) => {
          const existing = get().items.find((i) => i.productId === l.productId);
          return { ...(existing ?? item), price: l.price, qty: l.qty, stock: item.stock } as CartItem;
        });
        set({ items: next });
      },
      setQty: (productId, qty) => {
        const stock = get().items.find((i) => i.productId === productId)?.stock;
        const lines = setLineQty(get().items, productId, qty, stock);
        set({ items: lines as CartItem[] });
      },
      remove: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: 'felibest-cart-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
      version: 1,
    },
  ),
);

export const selectCount = (s: CartState) => cartCount(s.items);
export const selectSubtotal = (s: CartState) => cartSubtotal(s.items);

/** Animate a small clone of the product image from a source element to the cart icon. */
export function flyToCart(from: HTMLElement | null, image: string | null) {
  if (typeof window === 'undefined' || !from) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-cart-icon]')).filter((t) => t.offsetParent !== null);
  const target = targets[0];
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  Object.assign(el.style, {
    position: 'fixed', left: `${a.left + a.width / 2 - 28}px`, top: `${a.top + a.height / 2 - 28}px`, width: '56px', height: '56px',
    borderRadius: '50%', zIndex: '200', pointerEvents: 'none', backgroundSize: 'cover', backgroundPosition: 'center',
    background: image ? `center / cover url(${image})` : 'radial-gradient(circle at 30% 28%, #fff, #51acfb)',
    boxShadow: '0 12px 20px -6px rgba(12,76,147,.55), inset 4px 4px 8px rgba(255,255,255,.8), inset -5px -6px 10px rgba(12,76,147,.35)',
  });
  document.body.appendChild(el);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = el.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 70}px) scale(0.85)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0.25 },
    ],
    { duration: 760, easing: 'cubic-bezier(0.45, 0, 0.2, 1)' },
  );
  anim.onfinish = () => {
    el.remove();
    target.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'ease-out' });
  };
}
