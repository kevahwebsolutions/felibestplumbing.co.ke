import Image from 'next/image';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/auth-forms';
import { currentAdmin } from '@/lib/server/auth';

export const metadata = { title: 'Sign in' };

export default async function LoginPage() {
  if (await currentAdmin()) redirect('/admin');
  return (
    <main className="bp-grid relative grid min-h-dvh place-items-center overflow-hidden bg-navy-900 px-4 py-10">
      <div className="fp-card relative w-full max-w-md p-8 sm:p-10">
        <span className="mx-auto mb-5 grid size-20 place-items-center rounded-xl bg-navy-900"><Image src="/images/logo-white.webp" alt="Felibest Plumbing" width={60} height={60} /></span>
        <h1 className="text-center text-4xl font-bold">Admin sign in</h1>
        <p className="mb-7 mt-2 text-center text-muted">Felibest Plumbing back office</p>
        <LoginForm />
      </div>
    </main>
  );
}
