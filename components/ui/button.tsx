'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-brand-700 text-white shadow-soft hover:bg-brand-800 hover:shadow-card',
        accent:
          'bg-brand-600 text-white shadow-soft hover:bg-brand-700 hover:shadow-card',
        outline:
          'border border-brand-700/20 bg-white text-brand-700 hover:bg-brand-50 hover:border-brand-700/40',
        ghost: 'text-brand-700 hover:bg-brand-50',
        whatsapp:
          'bg-[#25D366] text-white shadow-soft hover:bg-[#1ebe57] hover:shadow-card',
        secondary:
          'bg-white text-brand-700 border border-brand-100 hover:bg-brand-50',
      },
      size: {
        default: 'h-12 px-6 py-3',
        sm: 'h-10 px-4',
        lg: 'h-14 px-8 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
