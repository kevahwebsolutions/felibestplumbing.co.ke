'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { BarChart3, ClipboardList, ExternalLink, FolderTree, LogOut, Menu, MessageSquareText, Package, Search, Settings, ShoppingBag, Plus, KeyRound } from 'lucide-react';
import { logoutAction } from '@/app/admin/actions';
import { SheetContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', Icon: BarChart3 },
  { href: '/admin/products', label: 'Products', Icon: Package },
  { href: '/admin/categories', label: 'Categories', Icon: FolderTree },
  { href: '/admin/orders', label: 'Orders', Icon: ShoppingBag },
  { href: '/admin/enquiries', label: 'Enquiries', Icon: MessageSquareText },
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

const ACTIONS = [
  { href: '/admin/products/new', label: 'Create product', Icon: Plus },
  { href: '/admin/orders', label: 'View new orders', Icon: ClipboardList },
  { href: '/admin/enquiries', label: 'View new enquiries', Icon: MessageSquareText },
  { href: '/admin/change-password', label: 'Change password', Icon: KeyRound },
  { href: '/', label: 'Open public site', Icon: ExternalLink },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="grid gap-1">
      {NAV.map(({ href, label, Icon }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={onNavigate} aria-current={active ? 'page' : undefined}
            className={cn('flex min-h-11 items-center gap-3 rounded-md border-l-4 px-3 font-heading text-lg font-semibold uppercase tracking-wider transition-colors', active ? 'border-accent-bright bg-tint text-brand-strong' : 'border-transparent text-body hover:bg-surface-alt hover:text-ink')}>
            <Icon className="size-5" aria-hidden /> {label}
          </Link>
        );
      })}
    </nav>
  );
}

function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (b: boolean) => void }) {
  const router = useRouter();
  const [products, setProducts] = React.useState<{ id: number; name: string }[]>([]);
  React.useEffect(() => {
    if (!open || products.length) return;
    fetch('/api/admin/online?products=1').then((r) => r.json()).then((d) => setProducts(d.products ?? [])).catch(() => undefined);
  }, [open, products.length]);
  const go = (href: string) => { setOpen(false); router.push(href); };
  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Quick search" className="fixed left-1/2 top-[18%] z-[95] w-[calc(100vw-24px)] max-w-xl -translate-x-1/2 overflow-hidden rounded-lg border border-line bg-surface shadow-float" overlayClassName="fp-overlay fixed inset-0 z-[90] bg-overlay">
      <div className="flex items-center gap-3 border-b border-line px-5"><Search className="size-5 text-brand-soft" aria-hidden />
        <Command.Input placeholder="Search pages, actions and products..." className="h-14 w-full bg-transparent text-base outline-none placeholder:text-ink-muted" /></div>
      <Command.List className="max-h-80 overflow-y-auto p-2">
        <Command.Empty className="p-6 text-center text-ink-muted">No results found.</Command.Empty>
        <Command.Group heading="Go to" className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-ink-muted">
          {NAV.map(({ href, label, Icon }) => <Command.Item key={href} value={label} onSelect={() => go(href)} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-base normal-case tracking-normal text-ink aria-selected:bg-tint"><Icon className="size-4" aria-hidden /> {label}</Command.Item>)}
        </Command.Group>
        <Command.Group heading="Actions" className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-ink-muted">
          {ACTIONS.map(({ href, label, Icon }) => <Command.Item key={href + label} value={label} onSelect={() => go(href)} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-base normal-case tracking-normal text-ink aria-selected:bg-tint"><Icon className="size-4" aria-hidden /> {label}</Command.Item>)}
        </Command.Group>
        {products.length ? (
          <Command.Group heading="Products" className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-ink-muted">
            {products.map((p) => <Command.Item key={p.id} value={`product ${p.name}`} onSelect={() => go(`/admin/products/${p.id}`)} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-base normal-case tracking-normal text-ink aria-selected:bg-tint"><Package className="size-4" aria-hidden /> {p.name}</Command.Item>)}
          </Command.Group>
        ) : null}
      </Command.List>
    </Command.Dialog>
  );
}

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const [menu, setMenu] = React.useState(false);
  const [palette, setPalette] = React.useState(false);
  const pathname = usePathname();
  React.useEffect(() => setMenu(false), [pathname]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((o) => !o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const brand = (
    <Link href="/admin" className="flex items-center gap-3">
      <span className="grid size-12 place-items-center"><Image src="/images/logo-light.webp" alt="" width={44} height={44} /></span>
      <span className="font-heading text-2xl font-bold uppercase leading-none text-ink">Felibest<br /><span className="text-sm tracking-[0.3em] text-brand">Admin</span></span>
    </Link>
  );
  return (
    <div className="admin-root flex min-h-dvh bg-surface-alt">
      <aside className="no-print sticky top-0 hidden h-dvh w-64 shrink-0 lg:block">
        <div className="flex h-full flex-col gap-6 border-r border-line bg-surface p-5">
          {brand}
          <NavLinks />
          <div className="mt-auto grid gap-3">
            <p className="truncate pl-2 text-sm text-body" title={email}>{email}</p>
            <form action={logoutAction}><button type="submit" className="fp-button fp-button-ghost fp-button-sm w-full"><LogOut className="size-4" aria-hidden /> Sign out</button></form>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="no-print sticky top-0 z-40 flex items-center gap-3 border-b border-line bg-surface px-4 py-3 lg:px-8">
          <DialogPrimitive.Root open={menu} onOpenChange={setMenu}>
            <DialogPrimitive.Trigger className="fp-chip !min-h-11 w-11 justify-center !px-0 lg:hidden" aria-label="Open menu"><Menu className="size-5" aria-hidden /></DialogPrimitive.Trigger>
            <SheetContent title="Admin menu" side="left" className="!bg-surface">
              <div className="mb-4">{brand}</div>
              <NavLinks onNavigate={() => setMenu(false)} />
              <form action={logoutAction} className="mt-auto"><button type="submit" className="fp-button fp-button-ghost w-full"><LogOut className="size-4" aria-hidden /> Sign out</button></form>
            </SheetContent>
          </DialogPrimitive.Root>
          <button type="button" onClick={() => setPalette(true)} className="fp-input flex !min-h-12 flex-1 items-center gap-3 text-left text-ink-muted sm:max-w-md">
            <Search className="size-5 text-brand-soft" aria-hidden /> <span className="flex-1 truncate">Quick search</span><kbd className="hidden rounded border border-line-strong bg-surface-alt px-2 py-0.5 text-xs font-bold text-brand sm:block">Ctrl K</kbd>
          </button>
          <Link href="/" target="_blank" className="fp-chip ml-auto hidden sm:inline-flex"><ExternalLink className="size-4" aria-hidden /> View site</Link>
        </header>
        <main id="main" className="px-4 pb-16 pt-4 lg:px-8">{children}</main>
      </div>
      <CommandPalette open={palette} setOpen={setPalette} />
    </div>
  );
}
