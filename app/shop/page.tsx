import type { Metadata } from 'next';
import { MemorialSite } from '@/components/memorial-site';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Thoughtful items that help support the care and future of The Living Memorial.',
};

export default function Shop() {
  return <MemorialSite page="shop" />;
}
