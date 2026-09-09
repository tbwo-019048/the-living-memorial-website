import type { Metadata } from 'next';
import { MemorialSite } from '@/components/memorial-site';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Explore a growing photographic archive of The Living Memorial and Operation Sweetpea.',
};

export default function Gallery() {
  return <MemorialSite page="gallery" />;
}
