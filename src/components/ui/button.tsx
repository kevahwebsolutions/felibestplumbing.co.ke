'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'blue' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'clay-button',
    variant === 'blue' && 'clay-button-blue',
    variant === 'ghost' && 'clay-button-ghost',
    size === 'sm' && 'clay-button-sm',
    size === 'lg' && 'clay-button-lg',
    className,
  );
}

function useTactile() {
  const reduce = useReducedMotion();
  return reduce
    ? {}
    : ({
        whileHover: { y: -3, scaleX: 1.03, scaleY: 0.98 },
        whileTap: { y: 1, scale: 0.97 },
        transition: { type: 'spring', stiffness: 520, damping: 18 },
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
