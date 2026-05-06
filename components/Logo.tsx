import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({
  className = '',
  height = 40,
  mobileHeight = 32,
  alt = 'Elim Medical Consultancy Logo',
  showText = true,
}: {
  className?: string;
  height?: number;
  mobileHeight?: number;
  alt?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn('flex items-center gap-0', className)}>
      <span
        className="relative"
        style={{
          display: 'inline-block',
          height,
          width: height,
        }}
      >
        <Image
          src="/logo.png"
          alt={alt}
          fill
          style={{ objectFit: 'contain' }}
          sizes={`(max-width: 640px) ${mobileHeight}px, ${height}px`}
          className="transition-transform duration-200 will-change-transform select-none"
          priority
        />
      </span>
      {showText ? (
        <span className="flex flex-col leading-tight">
          <span className="text-base font-bold text-brand-700 tracking-tight">
            Elim Medical
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-600">
            Consultancy
          </span>
        </span>
      ) : null}
    </span>
  );
}
