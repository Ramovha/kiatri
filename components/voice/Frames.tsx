import { ReactNode } from 'react';
import type { AppImage } from '@/lib/appImages';

// Device frames drawn in CSS — no images, so they cost nothing to load.

export function LaptopFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-t-xl border-[6px] border-b-0 border-navy-900 bg-navy-900 shadow-2xl">
        <div className="relative aspect-[16/10] w-full bg-white">{children}</div>
      </div>
      <div className="relative mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-2xl bg-gradient-to-b from-navy-200 to-navy-300 shadow-lg">
        <div className="mx-auto h-1.5 w-16 rounded-b-md bg-navy-400/70" />
      </div>
    </div>
  );
}

export function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[1.75rem] border-[5px] border-navy-900 bg-navy-900 shadow-2xl ${className}`}>
      <div className="relative aspect-[9/19] w-full bg-white">
        {children}
        <span className="absolute left-1/2 top-1.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-navy-900" aria-hidden />
      </div>
    </div>
  );
}

// A supplied screenshot: WebP at 1x and 2x, lazy-loaded, with its pixel size
// declared so the browser reserves the space before it arrives.
export function AppShot({ image, alt, className = '' }: { image: AppImage; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src1x}
      srcSet={`${image.src1x} 1x, ${image.src2x} 2x`}
      width={image.width}
      height={image.height}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover object-top ${className}`}
    />
  );
}
