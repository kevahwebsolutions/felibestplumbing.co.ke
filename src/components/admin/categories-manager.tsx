'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteCategoryAction, saveCategoryAction } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';

type Cat = { id: number; name: string; slug: string; description: string; sortOrder: number; count: number };

export function CategoriesManager({ cats }: { cats: Cat[] }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<Cat | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const res = await saveCategoryAction({ id: editing?.id, name: fd.get('name'), slug: fd.get('slug') ?? '', description: fd.get('description') ?? '', sortOrder: Number(fd.get('sortOrder') ?? 0) });
    setBusy(false);
    if (!res.ok) { setErrors(res.fieldErrors ?? {}); toast.error(res.error ?? 'Could not save'); return; }
    setErrors({});
    toast.success('Category saved');
    setEditing(null);
    formRef.current?.reset();
    router.refresh();
  }

  async function del(c: Cat) {
    if (!window.confirm(`Delete "${c.name}"? Its ${c.count} product(s) will become uncategorised.`)) return;
    const res = await deleteCategoryAction(c.id);
    if (res.ok) { toast.success('Category deleted'); router.refresh(); } else toast.error(res.error ?? 'Failed');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="fp-card overflow-x-auto p-2">
        <table className="w-full min-w-[480px] text-left">
          <caption className="sr-only">Categories</caption>
          <thead><tr className="text-xs uppercase tracking-wider text-ink-muted"><th scope="col" className="px-4 py-3">Name</th><th scope="col" className="px-4 py-3">Products</th><th scope="col" className="px-4 py-3">Order</th><th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <th scope="row" className="px-4 py-3 font-bold">{c.name}<span className="block text-xs font-normal text-ink-muted">/{c.slug}</span></th>
                <td className="px-4 py-3">{c.count}</td><td className="px-4 py-3">{c.sortOrder}</td>
                <td className="px-4 py-3"><div className="flex justify-end gap-2">
                  <button type="button" aria-label={`Edit ${c.name}`} onClick={() => setEditing(c)} className="fp-chip !min-h-11 w-11 justify-center !px-0"><Pencil className="size-4" aria-hidden /></button>
                  <button type="button" aria-label={`Delete ${c.name}`} onClick={() => del(c)} className="fp-chip !min-h-11 w-11 justify-center !px-0 text-accent-strong"><Trash2 className="size-4" aria-hidden /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form ref={formRef} key={editing?.id ?? 'new'} onSubmit={submit} className="fp-card h-fit space-y-5 p-6" noValidate>
        <h2 className="font-heading text-2xl font-bold">{editing ? 'Edit category' : 'New category'}</h2>
        <Field label="Name" htmlFor="c-name" error={errors.name}><Input id="c-name" name="name" defaultValue={editing?.name} required /></Field>
        <Field label="Slug (optional)" htmlFor="c-slug" error={errors.slug}><Input id="c-slug" name="slug" defaultValue={editing?.slug} /></Field>
        <Field label="Description" htmlFor="c-desc" error={errors.description}><Input id="c-desc" name="description" defaultValue={editing?.description} /></Field>
        <Field label="Sort order" htmlFor="c-order" error={errors.sortOrder}><Input id="c-order" name="sortOrder" type="number" min={0} defaultValue={editing?.sortOrder ?? cats.length} /></Field>
        <div className="flex gap-3"><Button type="submit" disabled={busy}>Save</Button>{editing ? <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button> : null}</div>
      </form>
    </div>
  );
}
