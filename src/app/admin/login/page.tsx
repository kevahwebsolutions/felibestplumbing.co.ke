import Image from 'next/image';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/auth-forms';
import { Bubbles, HERO_BUBBLES } from '@/components/clay/decor';
import { currentAdmin } from '@/lib/server/auth';

export const metadata = { title: 'Sign in' };

export default async function LoginPage() {
  if (await currentAdmin()) redirect('/admin');
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10">
      <Bubbles items={HERO_BUBBLES} />
      <div className="clay-card relative w-full max-w-md p-8 sm:p-10">
        <span className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_25%,var(--color-navy-600),var(--color-navy-900))] shadow-[0_12px_20px_-8px_rgb(8_47_92/0.6),inset_4px_5px_9px_rgb(255_255_255/0.35)]"><Image src="/images/logo-white.webp" alt="Felibest Plumbing" width={60} height={60} /></span>
        <h1 className="text-center font-heading text-3xl font-extrabold">Admin sign in</h1>
        <p className="mb-7 mt-2 text-center text-muted">Felibest Plumbing back office</p>
        <LoginForm />
      </div>
    </main>
  );
}
