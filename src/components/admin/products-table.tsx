'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from '@tanstack/react-table';
import { ArrowUpDown, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { bulkProductsAction, confirmPricesAction } from '@/app/admin/actions';
import { Button, ButtonLink } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/misc';
import { cn, formatKES } from '@/lib/utils';

export type AdminProductRow = { id: number; name: string; image: string | null; category: string; price: number; salePrice: number | null; stock: number; published: boolean; featured: boolean; placeholder: boolean; sku: string };

export function ProductsTable({ rows, categories, initialFilter }: { rows: AdminProductRow[]; categories: string[]; initialFilter?: string }) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('');
  const [status, setStatus] = React.useState(initialFilter === 'placeholder' ? 'placeholder' : '');
  const [selected, setSelected] = React.useState<Record<number, boolean>>({});
  const [busy, setBusy] = React.useState(false);

  const data = React.useMemo(() => rows.filter((r) => (!cat || r.category === cat) && (!status || (status === 'published' ? r.published : status === 'draft' ? !r.published : status === 'placeholder' ? r.placeholder : status === 'low' ? r.stock < 6 : true))), [rows, cat, status]);

  const columns = React.useMemo<ColumnDef<AdminProductRow>[]>(() => [
    { id: 'select', enableSorting: false, header: () => null, cell: ({ row }) => <Checkbox aria-label={`Select ${row.original.name}`} checked={!!selected[row.original.id]} onCheckedChange={(v) => setSelected((s) => ({ ...s, [row.original.id]: v === true }))} /> },
    { accessorKey: 'name', header: 'Product', cell: ({ row }) => (
      <Link href={`/admin/products/${row.original.id}`} className="flex min-w-56 items-center gap-3 font-bold text-ink hover:text-navy-600">
        <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-sky-100">{row.original.image ? <Image src={row.original.image} alt="" fill sizes="48px" className="object-cover" /> : null}</span>
        <span>{row.original.name}<span className="block text-xs font-semibold text-muted">{row.original.sku}</span></span>
      </Link>) },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'price', header: 'Price', cell: ({ row }) => <span className={cn('whitespace-nowrap font-bold', row.original.placeholder && 'text-cta-600')}>{formatKES(row.original.salePrice ?? row.original.price)}{row.original.salePrice ? <del className="ml-1 text-xs font-normal text-muted">{formatKES(row.original.price)}</del> : null}{row.original.placeholder ? <span className="ml-1 text-xs">(placeholder)</span> : null}</span> },
    { accessorKey: 'stock', header: 'Stock', cell: ({ row }) => <span className={cn('font-bold', row.original.stock < 6 && 'text-cta-600')}>{row.original.stock}</span> },
    { accessorKey: 'published', header: 'Status', cell: ({ row }) => <span className={cn('fp-pill', row.original.published ? 'fp-pill-green' : '')}>{row.original.published ? 'Published' : 'Draft'}</span> },
  ], [selected]);

  const table = useReactTable({ data, columns, state: { sorting, globalFilter: q }, onSortingChange: setSorting, onGlobalFilterChange: setQ, getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), globalFilterFn: (row, _id, v) => `${row.original.name} ${row.original.sku} ${row.original.category}`.toLowerCase().includes(String(v).toLowerCase()) });
  const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => Number(k));
  const visibleIds = table.getRowModel().rows.map((r) => r.original.id);

  async function run(action: 'publish' | 'unpublish' | 'delete' | 'confirm') {
    if (action === 'delete' && !window.confirm(`Delete ${ids.length} product(s)? This cannot be undone.`)) return;
    setBusy(true);
    const res = action === 'confirm' ? await confirmPricesAction(ids) : await bulkProductsAction(action, ids);
    setBusy(false);
    if (res.ok) { toast.success('Done'); setSelected({}); router.refresh(); } else toast.error(res.error ?? 'Failed');
  }

  return (
    <div className="space-y-4">
      <div className="fp-card grid gap-3 p-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
        <div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-navy-600" aria-hidden /><Input type="search" placeholder="Search products" aria-label="Search products" value={q} onChange={(e) => setQ(e.target.value)} className="pl-12" /></div>
        <Select aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</Select>
        <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option><option value="placeholder">Placeholder price</option><option value="low">Low stock</option></Select>
        <ButtonLink href="/admin/products/new"><Plus className="size-5" aria-hidden /> New product</ButtonLink>
      </div>

      {ids.length ? (
        <div className="fp-card-sky flex flex-wrap items-center gap-3 p-4" role="region" aria-label="Bulk actions">
          <p className="font-bold">{ids.length} selected</p>
          <Button size="sm" variant="blue" disabled={busy} onClick={() => run('publish')}>Publish</Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => run('unpublish')}>Unpublish</Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => run('confirm')}>Confirm prices</Button>
          <Button size="sm" disabled={busy} onClick={() => run('delete')}>Delete</Button>
        </div>
      ) : null}

      <div className="fp-card overflow-x-auto p-2">
        <table className="w-full min-w-[720px] text-left">
          <caption className="sr-only">Products</caption>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} scope="col" aria-sort={h.column.getIsSorted() === 'asc' ? 'ascending' : h.column.getIsSorted() === 'desc' ? 'descending' : undefined} className="px-4 py-3 text-xs uppercase tracking-wider text-muted">
                    {h.id === 'select' ? <Checkbox aria-label="Select all visible products" checked={visibleIds.length > 0 && visibleIds.every((id) => selected[id])} onCheckedChange={(v) => setSelected((s) => { const n = { ...s }; visibleIds.forEach((id) => { n[id] = v === true; }); return n; })} /> : h.column.getCanSort() ? (
                      <button type="button" onClick={h.column.getToggleSortingHandler()} className="inline-flex items-center gap-1 font-bold uppercase">{flexRender(h.column.columnDef.header, h.getContext())}<ArrowUpDown className="size-3.5" aria-hidden /></button>
                    ) : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr key={r.id} className="border-t border-sky-200 hover:bg-sky-50">
                {r.getVisibleCells().map((c) => <td key={c.id} className="px-4 py-3 align-middle">{flexRender(c.column.columnDef.cell, c.getContext())}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {table.getRowModel().rows.length === 0 ? <p className="p-10 text-center text-muted">No products match.</p> : null}
      </div>
      <p className="pl-2 text-sm text-muted">{table.getRowModel().rows.length} of {rows.length} products</p>
    </div>
  );
}
