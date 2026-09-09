import type { Metadata } from 'next';
import { MemorialSite } from '@/components/memorial-site';

export const metadata: Metadata = {
  title: 'About',
  description: 'The story of The Living Memorial, Operation Sweetpea, its features and custodians.',
};

export default function About() {
  return <MemorialSite page="about" />;
}
