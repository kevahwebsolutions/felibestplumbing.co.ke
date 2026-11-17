'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { changePasswordAction, loginAction, type ActionState } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';

const initial: ActionState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <Field label="Email" htmlFor="email" error={state.fieldErrors?.email}><Input id="email" name="email" type="email" autoComplete="username" required /></Field>
      <Field label="Password" htmlFor="password" error={state.fieldErrors?.password}><Input id="password" name="password" type="password" autoComplete="current-password" required /></Field>
      {state.error ? <p role="alert" className="rounded-2xl bg-peach-100 px-4 py-3 font-semibold text-cta-600">{state.error}</p> : null}
      <Button type="submit" size="lg" disabled={pending}>{pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Lock className="size-5" aria-hidden />} Sign in</Button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initial);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <Field label="Current password" htmlFor="current" error={state.fieldErrors?.current}><Input id="current" name="current" type="password" autoComplete="current-password" required /></Field>
      <Field label="New password" htmlFor="next" error={state.fieldErrors?.next} hint="At least 10 characters with upper case, lower case and a number."><Input id="next" name="next" type="password" autoComplete="new-password" required /></Field>
      <Field label="Confirm new password" htmlFor="confirm" error={state.fieldErrors?.confirm}><Input id="confirm" name="confirm" type="password" autoComplete="new-password" required /></Field>
      {state.error ? <p role="alert" className="rounded-2xl bg-peach-100 px-4 py-3 font-semibold text-cta-600">{state.error}</p> : null}
      <Button type="submit" size="lg" disabled={pending}>{pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null} Update password</Button>
    </form>
  );
}
