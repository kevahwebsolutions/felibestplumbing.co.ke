
import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'blue' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'fp-button',
    variant === 'blue' && 'fp-button-blue',
    variant === 'ghost' && 'fp-button-ghost',
    variant === 'outline' && 'fp-button-outline',
    size === 'sm' && 'fp-button-sm',
    size === 'lg' && 'fp-button-lg',
    className,
  );
}

type ButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', children, ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
});

type ButtonLinkProps = Omit<React.ComponentPropsWithoutRef<typeof Link>, 'children'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
};

export function ButtonLink({ variant = 'primary', size = 'md', className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

/** Plain anchor for tel:, wa.me and external links that should not use next/link. */
export function ButtonAnchor({
  variant = 'primary', size = 'md', className, children, ...props
}: React.ComponentPropsWithoutRef<'a'> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <a className={buttonClass(variant, size, className)} {...props}>
      {children}
    </a>
  );
}
