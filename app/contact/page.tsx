import type { Metadata } from 'next';
import { MemorialSite } from '@/components/memorial-site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Plan a visit or contact the custodians of The Living Memorial.',
};

export default function Contact() {
  return <MemorialSite page="contact" />;
}
