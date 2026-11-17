'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
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

function useTactile() {
  const reduce = useReducedMotion();
  return reduce
    ? {}
    : ({
        whileTap: { scale: 0.98 },
        transition: { duration: 0.1 },
      } as const);
}

type ButtonProps = Omit<React.ComponentPropsWithoutRef<typeof motion.button>, 'children'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', children, ...props },
  ref,
) {
  const tactile = useTactile();
  return (
    <motion.button ref={ref} type={type} className={buttonClass(variant, size, className)} {...tactile} {...props}>
      {children}
    </motion.button>
  );
});

const MotionLink = motion.create(Link);

type ButtonLinkProps = Omit<React.ComponentPropsWithoutRef<typeof Link>, 'children'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
};

export function ButtonLink({ variant = 'primary', size = 'md', className, children, ...props }: ButtonLinkProps) {
  const tactile = useTactile();
  return (
    <MotionLink className={buttonClass(variant, size, className)} {...tactile} {...(props as object)} href={props.href}>
      {children}
    </MotionLink>
  );
}

/** Plain anchor for tel:, wa.me and external links that should not use next/link. */
export function ButtonAnchor({
  variant = 'primary', size = 'md', className, children, ...props
}: React.ComponentPropsWithoutRef<'a'> & { variant?: ButtonVariant; size?: ButtonSize }) {
  const tactile = useTactile();
  return (
    <motion.a className={buttonClass(variant, size, className)} {...tactile} {...(props as object)}>
      {children}
    </motion.a>
  );
}
