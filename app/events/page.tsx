import type { Metadata } from 'next';
import { MemorialSite } from '@/components/memorial-site';
import { events } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming ceremonies, gatherings, garden days and past events at The Living Memorial.',
};

export default function Events() {
  const structuredData = events.filter((event) => event.published).map((event) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate ?? event.startDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.location,
    },
    image: [`https://the-living-memorial.toby-crome.chatgpt.site${event.image}`],
  }));
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MemorialSite page="events" />
    </>
  );
}
