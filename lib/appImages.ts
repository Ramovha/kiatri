import fs from 'fs';
import path from 'path';

// Build-time lookup for the optimised app screenshots written by
// scripts/optimize-app-images.py. Anything missing from the manifest is simply
// absent here, and the page shows an original illustration in its place.
export interface AppImage {
  src1x: string;
  src2x: string;
  width: number; // 1x pixel size — reserves layout space so nothing shifts
  height: number;
}

export type AppImages = Partial<Record<'desktop-app' | 'mobile-dialer' | 'mobile-call-history' | 'mobile-incoming-call', AppImage>>;

export function getAppImages(): AppImages {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/images/app/manifest.json'), 'utf8'));
    const result: AppImages = {};
    for (const [name, entry] of Object.entries<any>(manifest)) {
      result[name as keyof AppImages] = {
        src1x: `/images/app/${name}-1x.webp`,
        src2x: `/images/app/${name}-2x.webp`,
        width: entry['1x'].width,
        height: entry['1x'].height,
      };
    }
    return result;
  } catch {
    return {};
  }
}
