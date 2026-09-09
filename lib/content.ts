export type EventRecord = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  startDate: string;
  endDate?: string;
  time?: string;
  location: string;
  image: string;
  published: boolean;
};

export type FeatureRecord = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  installed: string;
  image: string;
  published: boolean;
  order: number;
};

export type GalleryRecord = {
  id: string;
  title: string;
  caption: string;
  album: string;
  date: string;
  image: string;
  alt: string;
  published: boolean;
  order: number;
};

export type ProductRecord = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  availability: string;
  image: string;
  published: boolean;
  order: number;
};

export const events: EventRecord[] = [
  {
    id: 'remembrance-gathering-2026',
    name: 'Remembrance Gathering',
    subtitle: 'A quiet afternoon together',
    description:
      'Join us in the garden for reflection, music and a shared moment of remembrance. Everyone is welcome; seating and warm drinks will be available.',
    startDate: '2026-11-08',
    time: '14:00–15:30',
    location: 'The Living Memorial',
    image: '/images/memorial-gathering.webp',
    published: true,
  },
  {
    id: 'spring-planting-2027',
    name: 'Sweetpea Planting Day',
    subtitle: 'Help the next season take root',
    description:
      'A gentle working morning in the garden, planting sweet peas and tending the beds together. Tools are provided and no experience is needed.',
    startDate: '2027-03-20',
    time: '10:00–13:00',
    location: 'Memorial Garden',
    image: '/images/planting-sweetpeas.webp',
    published: true,
  },
  {
    id: 'anniversary-weekend-2027',
    name: 'Anniversary Weekend',
    subtitle: 'Three days of stories, care and community',
    description:
      'A weekend of guided garden walks, shared stories and quiet reflection marking another year in the life of the memorial.',
    startDate: '2027-05-08',
    endDate: '2027-05-10',
    location: 'The Living Memorial',
    image: '/images/memorial-garden-hero.webp',
    published: true,
  },
  {
    id: 'summer-open-garden-2026',
    name: 'Summer Open Garden',
    subtitle: 'A day among the flowers',
    description:
      'Visitors joined the custodians for a peaceful day of garden walks, conversation and tea.',
    startDate: '2026-06-06',
    time: '11:00–16:00',
    location: 'The Living Memorial',
    image: '/images/memorial-garden-hero.webp',
    published: true,
  },
];

export const features: FeatureRecord[] = [
  {
    id: 'remembrance-stone',
    name: 'The Remembrance Stone',
    subtitle: 'A still point at the heart of the garden',
    description:
      'Weathered local stone forms a quiet place to pause. Its simple form was chosen to belong naturally to the landscape, becoming softer and more settled with every passing season.',
    installed: 'Spring 2022',
    image: '/images/memorial-garden-hero.webp',
    published: true,
    order: 1,
  },
  {
    id: 'sweetpea-border',
    name: 'The Sweetpea Border',
    subtitle: 'Colour, scent and continuation',
    description:
      'Each spring, sweet peas are raised and planted by volunteers. Their return is a small annual promise: memory is tended, shared and allowed to grow into something new.',
    installed: 'Renewed each spring',
    image: '/images/planting-sweetpeas.webp',
    published: true,
    order: 2,
  },
  {
    id: 'gathering-place',
    name: 'The Gathering Place',
    subtitle: 'Space for ceremony and companionship',
    description:
      'A sheltered clearing allows people to meet, remember and simply be together. It hosts ceremonies, open days and the ordinary conversations that keep a place alive.',
    installed: 'Autumn 2023',
    image: '/images/memorial-gathering.webp',
    published: true,
    order: 3,
  },
];

export const owners = [
  {
    id: 'founding-custodians',
    name: 'The Founding Custodians',
    role: 'Founders & owners',
    bio: 'The family at the heart of Operation Sweetpea continue to guide the memorial with the same care and personal purpose with which it began.',
    initials: 'FC',
    published: true,
    order: 1,
  },
  {
    id: 'garden-custodian',
    name: 'Garden Custodian',
    role: 'Planting & seasonal care',
    bio: 'Responsible for the living landscape: choosing plants, tending the beds and helping every new addition settle into the garden.',
    initials: 'GC',
    published: true,
    order: 2,
  },
  {
    id: 'community-custodian',
    name: 'Community Custodian',
    role: 'Events & visitors',
    bio: 'Welcoming visitors and volunteers, coordinating gatherings and making sure the memorial remains an open, thoughtful place for everyone.',
    initials: 'CC',
    published: true,
    order: 3,
  },
];

export const gallery: GalleryRecord[] = [
  {
    id: 'morning-light',
    title: 'Morning light',
    caption: 'The garden at the beginning of a summer day.',
    album: 'The Memorial',
    date: '2026-07-18',
    image: '/images/memorial-garden-hero.webp',
    alt: 'Morning light across the planted memorial garden',
    published: true,
    order: 1,
  },
  {
    id: 'planting-together',
    title: 'Planting together',
    caption: 'Sweet pea seedlings being settled into the spring border.',
    album: 'Operation Sweetpea',
    date: '2026-03-21',
    image: '/images/planting-sweetpeas.webp',
    alt: 'Hands planting sweet pea seedlings in dark earth',
    published: true,
    order: 2,
  },
  {
    id: 'gathered-in-remembrance',
    title: 'Gathered in remembrance',
    caption: 'A quiet moment together in the memorial garden.',
    album: 'Ceremonies',
    date: '2025-11-09',
    image: '/images/memorial-gathering.webp',
    alt: 'Flowers in the foreground of a quiet garden gathering',
    published: true,
    order: 3,
  },
  {
    id: 'sweetpeas-at-dawn',
    title: 'Sweet peas at dawn',
    caption: 'Soft colour returning to the garden.',
    album: 'The Memorial',
    date: '2026-06-12',
    image: '/images/memorial-garden-hero.webp',
    alt: 'Pink and lavender flowers in a sunlit garden',
    published: true,
    order: 4,
  },
  {
    id: 'spring-care',
    title: 'Spring care',
    caption: 'Preparing the beds for another season.',
    album: 'Operation Sweetpea',
    date: '2026-03-18',
    image: '/images/planting-sweetpeas.webp',
    alt: 'A gardener tending a sweet pea seedling',
    published: true,
    order: 5,
  },
  {
    id: 'anniversary-flowers',
    title: 'Anniversary flowers',
    caption: 'Flowers laid with care at the annual gathering.',
    album: 'Ceremonies',
    date: '2026-05-08',
    image: '/images/memorial-gathering.webp',
    alt: 'A natural floral wreath in a memorial garden',
    published: true,
    order: 6,
  },
];

export const albums = [
  'All photographs',
  'The Memorial',
  'Operation Sweetpea',
  'Ceremonies',
] as const;

export const products: ProductRecord[] = [
  {
    id: 'sweetpea-seeds',
    name: 'Sweetpea Seed Packet',
    subtitle: 'Grow a little remembrance at home',
    description:
      'A carefully chosen mix of soft pink and lavender sweet peas, with a planting note from the memorial.',
    price: '£4.50',
    availability: 'In stock',
    image: '/images/planting-sweetpeas.webp',
    published: true,
    order: 1,
  },
  {
    id: 'garden-postcards',
    name: 'Memorial Garden Postcards',
    subtitle: 'Set of six',
    description:
      'A set of six quiet seasonal views from the memorial, printed on responsibly sourced card.',
    price: '£8.00',
    availability: 'In stock',
    image: '/images/memorial-garden-hero.webp',
    published: true,
    order: 2,
  },
  {
    id: 'supporter-pin',
    name: 'Sweetpea Supporter Pin',
    subtitle: 'A small sign of support',
    description:
      'An enamel sweet pea pin in muted lavender and green. Proceeds help with the ongoing care of the garden.',
    price: '£7.50',
    availability: 'Pre-order',
    image: '/images/memorial-gathering.webp',
    published: true,
    order: 3,
  },
];
