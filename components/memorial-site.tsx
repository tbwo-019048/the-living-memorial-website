'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Flower2,
  Heart,
  Leaf,
  MapPin,
  Menu,
  Moon,
  ShoppingBag,
  Share2,
  Sun,
  X,
} from 'lucide-react';
import { addMonths, endOfMonth, format, getDay, isBefore, isSameDay, parseISO, startOfMonth } from 'date-fns';
import { useMemo, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { albums, events, features, gallery, owners, products, type EventRecord } from '@/lib/content';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const supabaseConfigured = isSupabaseConfigured();

export type PublicPage = 'home' | 'about' | 'events' | 'gallery' | 'shop' | 'contact';

const navigation: Array<{ label: string; href: string; page: PublicPage }> = [
  { label: 'Home', href: '/', page: 'home' },
  { label: 'About', href: '/about', page: 'about' },
  { label: 'Events', href: '/events', page: 'events' },
  { label: 'Gallery', href: '/gallery', page: 'gallery' },
  { label: 'Shop', href: '/shop', page: 'shop' },
  { label: 'Contact', href: '/contact', page: 'contact' },
];

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="The Living Memorial home">
      <span
        className={`grid size-10 place-items-center rounded-full border ${
          inverse ? 'border-white/30 bg-white/10' : 'border-primary/20 bg-secondary'
        }`}
      >
        <Flower2 className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span className="block font-heading text-lg font-medium tracking-wide">The Living Memorial</span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">
          Operation Sweetpea
        </span>
      </span>
    </Link>
  );
}

function ThemeButton({ inverse = false }: { inverse?: boolean }) {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  );

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('memorial-theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      className={`grid size-10 place-items-center rounded-full border transition ${
        inverse
          ? 'border-white/25 bg-white/10 hover:bg-white/20'
          : 'border-border bg-card hover:bg-secondary'
      }`}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

function Header({ current, overlay = false }: { current: PublicPage; overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const inverse = overlay;

  return (
    <header
      className={`${overlay ? 'absolute inset-x-0 top-0 z-30 text-[#fffaf0]' : 'relative z-30 border-b bg-background/95'}`}
    >
      <div className="mx-auto flex h-[86px] max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-16">
        <Brand inverse={inverse} />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current === item.page ? 'page' : undefined}
              className={`relative py-2 text-sm font-medium transition ${
                inverse ? 'text-white/78 hover:text-white' : 'text-foreground/70 hover:text-foreground'
              } ${current === item.page ? 'after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-current' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeButton inverse={inverse} />
          <button
            onClick={() => setOpen((value) => !value)}
            className={`grid size-10 place-items-center rounded-full border lg:hidden ${
              inverse ? 'border-white/25 bg-white/10' : 'border-border bg-card'
            }`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className={`absolute inset-x-4 top-[78px] rounded-2xl border p-3 shadow-2xl backdrop-blur lg:hidden ${
            inverse ? 'border-white/20 bg-[#17372e]/96 text-white' : 'border-border bg-card'
          }`}
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 text-base ${
                current === item.page ? 'bg-secondary/25' : 'hover:bg-secondary/15'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#132921] px-5 pb-8 pt-16 text-[#f7f1e5] md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 border-b border-white/15 pb-14 lg:grid-cols-[1.4fr_.7fr_.7fr]">
          <div>
            <Brand inverse />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65">
              A living place of remembrance, created with care and continuing to grow through every
              season.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-5 text-white/45">Explore</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="text-white/72 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-5 text-white/45">Keep in touch</p>
            <a href="https://www.facebook.com/" className="flex items-center gap-3 text-sm text-white/72 hover:text-white">
              <Share2 className="size-4" /> Follow us on Facebook
            </a>
            <p className="mt-4 text-sm text-white/55">Location details available before your visit.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} The Living Memorial. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/contact#privacy" className="hover:text-white">Privacy</Link>
            <Link href="/admin" className="hover:text-white">Admin login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="paper-grain px-5 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <p className="eyebrow text-[var(--ink-soft)]">{eyebrow}</p>
        <h1 className="mt-5 max-w-5xl text-[clamp(3.6rem,8vw,7.4rem)] font-medium leading-[0.88] tracking-[-0.04em]">
          {title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-[var(--ink-soft)] md:ml-auto md:text-xl">{intro}</p>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
      <div>
        <p className="eyebrow text-[var(--ink-soft)]">{eyebrow}</p>
        <h2 className="mt-3 text-4xl leading-tight md:text-5xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function EventCard({ event, onSelect }: { event: EventRecord; onSelect: () => void }) {
  const start = parseISO(event.startDate);
  return (
    <article className="group min-w-[82vw] snap-start overflow-hidden rounded-[1.6rem] border bg-card sm:min-w-[390px]">
      <button onClick={onSelect} className="block w-full text-left">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={event.image}
            alt=""
            fill
            sizes="(max-width: 640px) 82vw, 390px"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <time className="absolute left-5 top-5 rounded-xl bg-[#fffaf0] px-3 py-2 text-center text-[#17362e] shadow-lg">
            <span className="block text-[10px] font-bold uppercase tracking-widest">{format(start, 'MMM')}</span>
            <span className="block font-heading text-2xl font-semibold leading-none">{format(start, 'd')}</span>
          </time>
        </div>
        <div className="p-6">
          <p className="eyebrow text-[var(--ink-soft)]">{event.subtitle}</p>
          <h3 className="mt-2 text-3xl">{event.name}</h3>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--ink-soft)]">
            {event.time && <span className="flex items-center gap-2"><Clock3 className="size-4" />{event.time}</span>}
            <span className="flex items-center gap-2"><MapPin className="size-4" />{event.location}</span>
          </div>
        </div>
      </button>
    </article>
  );
}

function EventDialog({
  event,
  onClose,
}: {
  event: EventRecord | null;
  onClose: () => void;
}) {
  if (!event) return null;
  const dateLabel = event.endDate
    ? `${format(parseISO(event.startDate), 'd MMM')}–${format(parseISO(event.endDate), 'd MMM yyyy')}`
    : format(parseISO(event.startDate), 'd MMMM yyyy');
  return (
    <Dialog open={Boolean(event)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border bg-card p-0 sm:max-w-2xl">
        <div className="relative aspect-[16/8]">
          <Image src={event.image} alt="" fill sizes="640px" className="rounded-t-lg object-cover" />
        </div>
        <DialogHeader className="px-6 pb-2 text-left sm:px-8">
          <p className="eyebrow text-[var(--ink-soft)]">{dateLabel}</p>
          <DialogTitle className="font-heading text-4xl font-medium">{event.name}</DialogTitle>
          <DialogDescription className="text-base text-[var(--ink-soft)]">{event.subtitle}</DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-8 sm:px-8">
          <p>{event.description}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {event.time && <span className="rounded-full bg-secondary px-4 py-2">{event.time}</span>}
            <span className="rounded-full bg-secondary px-4 py-2">{event.location}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HomePage() {
  const rail = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<EventRecord | null>(null);
  const upcoming = events.filter((event) => !isBefore(parseISO(event.endDate ?? event.startDate), new Date()));

  function nudge(direction: number) {
    rail.current?.scrollBy({ left: direction * 420, behavior: 'smooth' });
  }

  return (
    <>
      <section className="relative isolate min-h-[92svh] overflow-hidden bg-[#17372e] text-[#fffaf0]">
        <Image
          src="/images/memorial-garden-hero.webp"
          alt="A peaceful memorial garden in warm morning light"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c261f]/95 via-[#15372b]/60 to-transparent" />
        <Header current="home" overlay />
        <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-[1440px] items-end px-5 pb-14 pt-32 md:px-10 md:pb-20 lg:px-16">
          <div className="max-w-4xl">
            <p className="eyebrow mb-5 text-[#e2cbd8]">A place to remember. A place that grows.</p>
            <h1 className="max-w-3xl text-[clamp(3.6rem,8vw,7.5rem)] font-medium leading-[0.86] tracking-[-0.04em]">
              Remembrance, rooted in life.
            </h1>
            <div className="mt-8 grid max-w-3xl gap-8 border-t border-white/25 pt-7 md:grid-cols-[1fr_auto] md:items-end">
              <blockquote className="max-w-xl font-heading text-2xl leading-snug text-white/90">
                “Those we love do not leave us. They take root in the lives we continue to grow.”
              </blockquote>
              <Link href="/about" className="inline-flex w-fit items-center gap-3 rounded-full bg-[#fffaf0] px-6 py-3 text-sm font-semibold text-[#17372e] transition hover:-translate-y-0.5">
                Discover our story <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="paper-grain px-5 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[.65fr_1.35fr]">
          <p className="eyebrow text-[var(--ink-soft)]">The story continues</p>
          <div>
            <h2 className="max-w-3xl text-4xl leading-tight md:text-6xl">
              A peaceful corner shaped by remembrance, community and the quiet rhythm of the seasons.
            </h2>
            <p className="mt-8 max-w-2xl text-lg text-[var(--ink-soft)]">
              The Living Memorial is the heart of Operation Sweetpea: a living place where memory is
              held in flowers, trees, gathering and care. Created together, it continues to grow for
              everyone who visits.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#e6ddd8] px-5 py-24 text-[#17362d] dark:bg-[#263630] dark:text-[#f4efe3] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <SectionHeading
            eyebrow="What’s ahead"
            title="Upcoming events"
            action={
              <div className="hidden items-center gap-2 sm:flex">
                <button onClick={() => nudge(-1)} className="grid size-11 place-items-center rounded-full border border-current/25" aria-label="Previous events"><ArrowLeft className="size-4" /></button>
                <button onClick={() => nudge(1)} className="grid size-11 place-items-center rounded-full border border-current/25" aria-label="Next events"><ArrowRight className="size-4" /></button>
              </div>
            }
          />
          {upcoming.length ? (
            <div ref={rail} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {upcoming.map((event) => <EventCard key={event.id} event={event} onSelect={() => setSelected(event)} />)}
            </div>
          ) : (
            <p className="rounded-2xl border border-current/15 p-8">There are no upcoming events just now. Please check back soon.</p>
          )}
          <Link href="/events" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
            All events <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="px-5 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1320px]">
          <SectionHeading eyebrow="Explore" title="Discover the memorial" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { href: '/about', icon: Leaf, title: 'How it began', copy: 'The story of Operation Sweetpea and the care that brought the memorial to life.' },
              { href: '/about#features', icon: Heart, title: 'What grows here', copy: 'Walk through the places, plantings and features that make up the memorial.' },
              { href: '/gallery', icon: Flower2, title: 'A living archive', copy: 'Photographs of ceremonies, changing seasons and the people who keep it growing.' },
            ].map((item, index) => (
              <Link key={item.href + item.title} href={item.href} className="group rounded-[1.7rem] border bg-card p-7 transition hover:-translate-y-1 hover:shadow-xl">
                <span className={`grid size-12 place-items-center rounded-full ${index === 1 ? 'bg-[#e8d9e1]' : 'bg-secondary'} text-[#244f42]`}>
                  <item.icon className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-10 text-3xl">{item.title}</h3>
                <p className="mt-3 text-sm text-[var(--ink-soft)]">{item.copy}</p>
                <ArrowRight className="mt-7 size-4 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid min-h-[620px] bg-[#203e34] text-[#fffaf0] lg:grid-cols-2">
        <div className="relative min-h-[420px] lg:min-h-full">
          <Image src="/images/planting-sweetpeas.webp" alt="Hands planting sweet pea seedlings" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="flex items-center px-7 py-20 md:px-14 lg:px-20">
          <div className="max-w-xl">
            <p className="eyebrow text-[#dcbaca]">Supporting the memorial</p>
            <h2 className="mt-5 text-5xl leading-[1.02] md:text-6xl">Help something beautiful keep growing.</h2>
            <p className="mt-7 text-white/70">
              Every purchase and every shared hour helps us tend the garden, welcome visitors and preserve
              its story for the future.
            </p>
            <Link href="/shop" className="mt-9 inline-flex items-center gap-3 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              Visit the shop <ShoppingBag className="size-4" />
            </Link>
          </div>
        </div>
      </section>
      <EventDialog event={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our story" title="A memorial made to live." intro="Operation Sweetpea began with a simple belief: remembrance can be a living act. A garden can hold grief and gratitude, quiet and conversation, all at once." />
      <section className="px-5 pb-24 md:px-10 lg:px-16 lg:pb-32">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image src="/images/planting-sweetpeas.webp" alt="Sweet peas being planted in the memorial garden" fill sizes="(max-width:1024px) 100vw, 55vw" className="object-cover" />
          </div>
          <div className="lg:pl-10">
            <p className="eyebrow text-[var(--ink-soft)]">How it began</p>
            <h2 className="mt-4 text-4xl md:text-5xl">One small act of care became a place for everyone.</h2>
            <p className="mt-6 text-[var(--ink-soft)]">
              The first sweet peas were planted as a personal gesture of remembrance. Friends,
              neighbours and volunteers gathered around that idea, each bringing time, stories and
              practical help. Slowly, the ground changed.
            </p>
            <p className="mt-5 text-[var(--ink-soft)]">
              Paths were laid, trees found their place and areas for pause and gathering were shaped.
              What emerged was not a finished monument, but a memorial with seasons — one that asks to
              be tended and gives something back in return.
            </p>
            <blockquote className="mt-8 border-l-2 border-accent pl-6 font-heading text-2xl">
              “It was never meant to stand still. The growing is part of the remembering.”
            </blockquote>
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#e4e9df] px-5 py-24 text-[#17362d] dark:bg-[#1b2c26] dark:text-[#f4efe3] md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow="Within the garden" title="Made with meaning" />
          <div className="space-y-16 lg:space-y-24">
            {features.filter((f) => f.published).sort((a, b) => a.order - b.order).map((feature, index) => (
              <article key={feature.id} className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
                <div className={`relative aspect-[4/3] overflow-hidden rounded-[2rem] ${index % 2 ? 'lg:order-2' : ''}`}>
                  <Image src={feature.image} alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className={index % 2 ? 'lg:order-1' : ''}>
                  <p className="eyebrow opacity-60">{feature.installed}</p>
                  <h3 className="mt-3 text-4xl md:text-5xl">{feature.name}</h3>
                  <p className="mt-2 font-heading text-2xl opacity-75">{feature.subtitle}</p>
                  <p className="mt-6 max-w-xl opacity-70">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow="Care & continuity" title="Our custodians" />
          <div className="grid gap-5 md:grid-cols-3">
            {owners.filter((owner) => owner.published).map((owner, index) => (
              <article key={owner.id} className="rounded-[1.7rem] border bg-card p-7">
                <div className={`grid size-20 place-items-center rounded-full font-heading text-2xl ${index === 1 ? 'bg-[#e7d7df] text-[#5c3b4a]' : 'bg-secondary text-primary'}`}>
                  {owner.initials}
                </div>
                <h3 className="mt-8 text-3xl">{owner.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]">{owner.role}</p>
                <p className="mt-5 text-sm text-[var(--ink-soft)]">{owner.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function MonthCalendar({ onSelect }: { onSelect: (event: EventRecord) => void }) {
  const firstUpcoming = events.find((event) => !isBefore(parseISO(event.startDate), new Date())) ?? events[0];
  const [month, setMonth] = useState(startOfMonth(parseISO(firstUpcoming.startDate)));
  const monthStart = startOfMonth(month);
  const days = endOfMonth(month).getDate();
  const leading = (getDay(monthStart) + 6) % 7;

  return (
    <div className="rounded-[1.8rem] border bg-card p-4 sm:p-7">
      <div className="mb-7 flex items-center justify-between">
        <h3 className="text-3xl">{format(month, 'MMMM yyyy')}</h3>
        <div className="flex gap-2">
          <button onClick={() => setMonth((value) => addMonths(value, -1))} className="grid size-10 place-items-center rounded-full border" aria-label="Previous month"><ChevronLeft className="size-4" /></button>
          <button onClick={() => setMonth((value) => addMonths(value, 1))} className="grid size-10 place-items-center rounded-full border" aria-label="Next month"><ChevronRight className="size-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => <div key={day} className="py-2">{day}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: leading }).map((_, index) => <div key={`blank-${index}`} className="aspect-square border-t border-border/60" />)}
        {Array.from({ length: days }).map((_, index) => {
          const date = new Date(month.getFullYear(), month.getMonth(), index + 1);
          const event = events.find((item) => {
            const start = parseISO(item.startDate);
            const end = parseISO(item.endDate ?? item.startDate);
            return date >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
              date <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
          });
          return (
            <div key={date.toISOString()} className="relative aspect-square border-t border-border/60 p-1">
              {event ? (
                <button onClick={() => onSelect(event)} className="flex size-full flex-col items-center justify-center rounded-xl bg-secondary text-primary transition hover:bg-primary hover:text-primary-foreground" aria-label={`${format(date, 'd MMMM')}: ${event.name}`}>
                  <span className="font-semibold">{index + 1}</span>
                  <span className="mt-1 hidden max-w-full truncate px-1 text-[10px] sm:block">{event.name}</span>
                </button>
              ) : (
                <span className={`grid size-full place-items-center text-sm ${isSameDay(date, new Date()) ? 'font-bold text-accent' : 'text-[var(--ink-soft)]'}`}>{index + 1}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventsPage() {
  const [selected, setSelected] = useState<EventRecord | null>(null);
  const now = new Date();
  const upcoming = events.filter((event) => !isBefore(parseISO(event.endDate ?? event.startDate), now));
  const past = events.filter((event) => isBefore(parseISO(event.endDate ?? event.startDate), now));
  return (
    <>
      <PageHero eyebrow="Gather with us" title="Dates to share and remember." intro="Ceremonies, garden days and quiet gatherings are part of the memorial’s life. Browse what is coming, or revisit moments from its history." />
      <section className="px-5 pb-24 md:px-10 lg:px-16 lg:pb-32">
        <div className="mx-auto max-w-[1200px]">
          <Tabs defaultValue="calendar">
            <TabsList className="mb-8 bg-secondary p-1">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="list">Event list</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar"><MonthCalendar onSelect={setSelected} /></TabsContent>
            <TabsContent value="list">
              <div className="grid gap-5 md:grid-cols-2">
                {upcoming.map((event) => <EventCard key={event.id} event={event} onSelect={() => setSelected(event)} />)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <section className="bg-secondary/55 px-5 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow="Part of our history" title="Past events" />
          <div className="divide-y divide-border">
            {past.length ? past.map((event) => (
              <button key={event.id} onClick={() => setSelected(event)} className="grid w-full gap-2 py-6 text-left md:grid-cols-[180px_1fr_auto] md:items-center">
                <time className="text-sm text-[var(--ink-soft)]">{format(parseISO(event.startDate), 'd MMMM yyyy')}</time>
                <span>
                  <span className="block font-heading text-2xl">{event.name}</span>
                  <span className="text-sm text-[var(--ink-soft)]">{event.subtitle}</span>
                </span>
                <ArrowRight className="hidden size-4 md:block" />
              </button>
            )) : <p>No past events have been published yet.</p>}
          </div>
        </div>
      </section>
      <EventDialog event={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function GalleryPage() {
  const [album, setAlbum] = useState<(typeof albums)[number]>(albums[0]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visible = gallery.filter((item) => item.published && (album === albums[0] || item.album === album));
  const active = activeIndex === null ? null : visible[activeIndex];

  function move(direction: number) {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + direction + visible.length) % visible.length);
  }

  return (
    <>
      <PageHero eyebrow="Photographic archive" title="The life of the memorial, held in images." intro="Each photograph adds to a growing record — ceremonies and quiet mornings, new planting and familiar faces, change and continuity." />
      <section className="px-5 pb-24 md:px-10 lg:px-16 lg:pb-32">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-10 flex gap-2 overflow-x-auto pb-2" aria-label="Filter gallery by album">
            {albums.map((item) => (
              <button key={item} onClick={() => setAlbum(item)} className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold ${album === item ? 'bg-primary text-primary-foreground' : 'border bg-card'}`}>{item}</button>
            ))}
          </div>
          {visible.length ? (
            <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((item, index) => (
                <button key={item.id} onClick={() => setActiveIndex(index)} className={`group relative overflow-hidden rounded-[1.4rem] text-left ${index % 5 === 0 ? 'sm:row-span-2' : ''}`}>
                  <Image src={item.image} alt={item.alt} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="block font-heading text-2xl">{item.title}</span>
                    <span className="text-xs text-white/70">{item.album}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border p-10 text-center text-[var(--ink-soft)]">This album does not contain any published photographs yet.</div>
          )}
        </div>
      </section>
      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-h-[94vh] max-w-[min(94vw,1100px)] border-0 bg-[#0c1714] p-3 text-white sm:max-w-5xl">
          {active && (
            <>
              <div className="relative aspect-[16/10] min-h-0">
                <Image src={active.image} alt={active.alt} fill sizes="94vw" className="rounded-md object-contain" />
              </div>
              <DialogHeader className="px-3 pb-2 text-left">
                <DialogTitle className="font-heading text-3xl font-medium">{active.title}</DialogTitle>
                <DialogDescription className="text-white/65">{active.caption}</DialogDescription>
              </DialogHeader>
              <div className="absolute inset-y-0 left-3 flex items-center">
                <button onClick={() => move(-1)} className="grid size-11 place-items-center rounded-full bg-black/50" aria-label="Previous photograph"><ChevronLeft /></button>
              </div>
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button onClick={() => move(1)} className="grid size-11 place-items-center rounded-full bg-black/50" aria-label="Next photograph"><ChevronRight /></button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ShopPage() {
  return (
    <>
      <PageHero eyebrow="Support the memorial" title="Thoughtful things, made to help it grow." intro="Every order contributes to the care of the garden, future gatherings and the ongoing work of preserving its story." />
      <section className="px-5 pb-24 md:px-10 lg:px-16 lg:pb-32">
        <div className="mx-auto max-w-[1200px]">
          {products.filter((p) => p.published).length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.filter((p) => p.published).map((product) => (
                <article key={product.id} className="group overflow-hidden rounded-[1.7rem] border bg-card">
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={product.image} alt="" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                    <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold backdrop-blur">{product.availability}</span>
                  </div>
                  <div className="p-6">
                    <p className="eyebrow text-[var(--ink-soft)]">{product.subtitle}</p>
                    <div className="mt-2 flex items-start justify-between gap-4">
                      <h2 className="text-3xl">{product.name}</h2>
                      <span className="pt-1 text-base font-semibold">{product.price}</span>
                    </div>
                    <p className="mt-4 text-sm text-[var(--ink-soft)]">{product.description}</p>
                    <Link href={`/contact?product=${product.id}`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                      Enquire to order <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : <div className="rounded-2xl border p-10 text-center">The shop is resting for now. Please check back soon.</div>}
        </div>
      </section>
    </>
  );
}

function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function sendMessage(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus('sending');
    const data = new FormData(event.currentTarget);
    const getText = (key: string) => {
      const value = data.get(key);
      return typeof value === 'string' ? value : '';
    };
    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.from('contact_messages').insert({
          name: getText('name'),
          email: getText('email'),
          subject: getText('subject'),
          message: getText('message'),
        });
        if (error) throw new Error(error.message);
      } else {
        // Preview mode — no project connected. Simulate the round-trip.
        await new Promise((resolve) => setTimeout(resolve, 450));
      }
      setFormStatus('sent');
      event.currentTarget.reset();
    } catch {
      setFormStatus('error');
    }
  }

  return (
    <>
      <PageHero eyebrow="Visit & contact" title="You are welcome here." intro="Whether you are planning a visit, asking about an event or simply want to learn more, we would be glad to hear from you." />
      <section className="px-5 pb-24 md:px-10 lg:px-16 lg:pb-32">
        <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-[1.8rem] bg-[#203f34] p-7 text-[#fffaf0] md:p-10">
            <p className="eyebrow text-white/55">Contact details</p>
            <h2 className="mt-4 text-4xl">Plan your visit</h2>
            <div className="mt-8 space-y-6 text-sm">
              <div className="flex gap-4"><MapPin className="mt-1 size-5 shrink-0 text-[#ddb7c8]" /><div><strong className="block text-base">The Living Memorial</strong><span className="text-white/65">Full address available on request while visitor details are finalised.</span></div></div>
              <div className="flex gap-4"><Share2 className="mt-1 size-5 shrink-0 text-[#ddb7c8]" /><div><strong className="block text-base">Facebook</strong><a href="https://www.facebook.com/" className="text-white/65 hover:text-white">Follow Operation Sweetpea</a></div></div>
              <div className="flex gap-4"><Clock3 className="mt-1 size-5 shrink-0 text-[#ddb7c8]" /><div><strong className="block text-base">Visiting</strong><span className="text-white/65">Please contact us before making a special journey.</span></div></div>
            </div>
            <a href="https://www.google.com/maps/search/?api=1&query=The+Living+Memorial+Operation+Sweetpea" target="_blank" rel="noreferrer" className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold">
              Open directions <ExternalLink className="size-4" />
            </a>
          </div>
          <form className="rounded-[1.8rem] border bg-card p-7 md:p-10" onSubmit={sendMessage}>
            <p className="eyebrow text-[var(--ink-soft)]">Send a message</p>
            <h2 className="mt-4 text-4xl">How can we help?</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold">Your name<input name="name" required className="mt-2 w-full rounded-xl border bg-background px-4 py-3 font-normal" /></label>
              <label className="text-sm font-semibold">Email address<input name="email" type="email" required className="mt-2 w-full rounded-xl border bg-background px-4 py-3 font-normal" /></label>
              <label className="text-sm font-semibold sm:col-span-2">Subject<input name="subject" className="mt-2 w-full rounded-xl border bg-background px-4 py-3 font-normal" /></label>
              <label className="text-sm font-semibold sm:col-span-2">Message<textarea name="message" required rows={5} className="mt-2 w-full resize-y rounded-xl border bg-background px-4 py-3 font-normal" /></label>
            </div>
            <button type="submit" disabled={formStatus === 'sending'} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{formStatus === 'sending' ? 'Sending…' : 'Send message'} <ArrowRight className="size-4" /></button>
            <p aria-live="polite" className="mt-4 text-xs text-[var(--ink-soft)]">
              {formStatus === 'sent' && (supabaseConfigured ? 'Thank you — your message has been sent.' : 'Thank you — the form flow is ready and will deliver once Supabase is connected.')}
              {formStatus === 'error' && 'Your message could not be sent. Please try again.'}
              {formStatus === 'idle' && !supabaseConfigured && 'This form will deliver once the site’s Supabase project is connected.'}
            </p>
          </form>
        </div>
      </section>
      <section id="privacy" className="border-t px-5 py-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-3xl">Privacy</h2>
          <p className="mt-3 max-w-3xl text-sm text-[var(--ink-soft)]">We only use the information you share to respond to your enquiry. Connected form submissions are protected by the site’s access controls and are not published.</p>
        </div>
      </section>
    </>
  );
}

export function MemorialSite({ page }: { page: PublicPage }) {
  const content = useMemo(() => {
    switch (page) {
      case 'home': return <HomePage />;
      case 'about': return <AboutPage />;
      case 'events': return <EventsPage />;
      case 'gallery': return <GalleryPage />;
      case 'shop': return <ShopPage />;
      case 'contact': return <ContactPage />;
    }
  }, [page]);
  return (
    <main>
      {page !== 'home' && <Header current={page} />}
      {content}
      <Footer />
    </main>
  );
}
