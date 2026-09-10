'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarDays,
  ChevronsUpDown,
  CircleUserRound,
  FileImage,
  Flower2,
  GalleryHorizontalEnd,
  Home,
  LayoutDashboard,
  Leaf,
  LogOut,
  MapPin,
  Package,
  PanelTop,
  Plus,
  Settings,
  Share2,
  ShoppingBag,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { useMemo, useState, type SyntheticEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { events, features, gallery, owners, products } from '@/lib/content';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const supabaseConfigured = isSupabaseConfigured();

type AdminSection =
  | 'Dashboard'
  | 'Homepage'
  | 'About'
  | 'Memorial Features'
  | 'Owners'
  | 'Events'
  | 'Gallery'
  | 'Shop'
  | 'Contact'
  | 'Social Links'
  | 'Site Settings'
  | 'Media';

type AdminItem = {
  id: string;
  title: string;
  subtitle: string;
  published: boolean;
  order: number;
};

const menu: Array<{ label: AdminSection; icon: typeof Home }> = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Homepage', icon: Home },
  { label: 'About', icon: PanelTop },
  { label: 'Memorial Features', icon: Leaf },
  { label: 'Owners', icon: Users },
  { label: 'Events', icon: CalendarDays },
  { label: 'Gallery', icon: GalleryHorizontalEnd },
  { label: 'Shop', icon: ShoppingBag },
  { label: 'Contact', icon: MapPin },
  { label: 'Social Links', icon: Share2 },
  { label: 'Site Settings', icon: Settings },
  { label: 'Media', icon: FileImage },
];

const initialCollections: Partial<Record<AdminSection, AdminItem[]>> = {
  'Memorial Features': features.map((item) => ({
    id: item.id,
    title: item.name,
    subtitle: item.subtitle,
    published: item.published,
    order: item.order,
  })),
  Owners: owners.map((item) => ({
    id: item.id,
    title: item.name,
    subtitle: item.role,
    published: item.published,
    order: item.order,
  })),
  Events: events.map((item, index) => ({
    id: item.id,
    title: item.name,
    subtitle: item.startDate,
    published: item.published,
    order: index + 1,
  })),
  Gallery: gallery.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.album,
    published: item.published,
    order: item.order,
  })),
  Shop: products.map((item) => ({
    id: item.id,
    title: item.name,
    subtitle: item.price,
    published: item.published,
    order: item.order,
  })),
  'Social Links': [
    { id: 'facebook', title: 'Facebook', subtitle: 'Add your Facebook page URL', published: false, order: 1 },
  ],
};

const editablePages: Partial<Record<AdminSection, Array<{ label: string; value: string }>>> = {
  Homepage: [
    { label: 'Hero heading', value: 'Remembrance, rooted in life.' },
    { label: 'Hero introduction', value: 'A place to remember. A place that grows.' },
    { label: 'Hero quotation', value: 'Those we love do not leave us. They take root in the lives we continue to grow.' },
    { label: 'CTA label', value: 'Discover our story' },
  ],
  About: [
    { label: 'Page heading', value: 'A memorial made to live.' },
    { label: 'Story heading', value: 'One small act of care became a place for everyone.' },
    { label: 'Story quotation', value: 'It was never meant to stand still. The growing is part of the remembering.' },
  ],
  Contact: [
    { label: 'Contact email', value: 'hello@thelivingmemorial.org' },
    { label: 'Visitor note', value: 'Please contact us before making a special journey.' },
    { label: 'Address', value: '' },
    { label: 'Latitude / longitude', value: '' },
  ],
  'Site Settings': [
    { label: 'Site title', value: 'The Living Memorial' },
    { label: 'Site description', value: 'A living place of remembrance.' },
    { label: 'Main logo URL', value: '' },
    { label: 'Default sharing image URL', value: '' },
  ],
};

function Login({ onEnter }: { onEnter: (token: string | null) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabaseConfigured) {
      onEnter(null);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      if (!supabase) {
        onEnter(null);
        return;
      }
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw new Error(signInError.message);
      onEnter(data.session?.access_token ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="paper-grain grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] border bg-card p-7 shadow-2xl shadow-primary/5 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full bg-secondary"><Flower2 className="size-5" /></span>
          <div>
            <p className="font-heading text-2xl leading-none">The Living Memorial</p>
            <p className="mt-1 text-xs uppercase tracking-[.18em] text-[var(--ink-soft)]">Administration</p>
          </div>
        </div>
        <h1 className="mt-10 text-4xl">Welcome back.</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          {supabaseConfigured
            ? 'Sign in with your authorised administrator account.'
            : 'Preview the complete content-management dashboard. Connect Supabase to enable secure live editing.'}
        </p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          {supabaseConfigured && (
            <>
              <label className="block text-sm font-semibold">Email address<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-2 w-full rounded-xl border bg-background px-4 py-3 font-normal" /></label>
              <label className="block text-sm font-semibold">Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-2 w-full rounded-xl border bg-background px-4 py-3 font-normal" /></label>
            </>
          )}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button disabled={loading} className="w-full rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-60">
            {loading ? 'Signing in…' : supabaseConfigured ? 'Sign in' : 'Preview dashboard'}
          </button>
        </form>
        <Link href="/" className="mt-6 block text-center text-sm text-[var(--ink-soft)] hover:text-foreground">← Return to the public website</Link>
      </div>
    </main>
  );
}

function Dashboard({ setSection }: { setSection: (section: AdminSection) => void }) {
  const stats = [
    { label: 'Upcoming events', value: '3', icon: CalendarDays },
    { label: 'Gallery images', value: String(gallery.length), icon: FileImage },
    { label: 'Products', value: String(products.length), icon: Package },
    { label: 'Draft content', value: '1', icon: PanelTop },
  ];
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between text-[var(--ink-soft)]"><span className="text-sm">{stat.label}</span><stat.icon className="size-4" /></div>
            <p className="mt-6 font-heading text-4xl">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
        <section className="rounded-2xl border bg-card p-6">
          <p className="eyebrow text-[var(--ink-soft)]">Coming up</p>
          <h2 className="mt-2 text-3xl">Upcoming events</h2>
          <div className="mt-6 divide-y">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center justify-between gap-4 py-4">
                <div><p className="font-semibold">{event.name}</p><p className="text-sm text-[var(--ink-soft)]">{event.startDate} · {event.location}</p></div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs">Published</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl bg-[#203f34] p-6 text-[#fffaf0]">
          <p className="eyebrow text-white/55">Quick actions</p>
          <div className="mt-5 space-y-2">
            {[
              ['Events', 'Add event'],
              ['Gallery', 'Upload photos'],
              ['Shop', 'Add product'],
              ['Memorial Features', 'Add feature'],
            ].map(([section, label]) => (
              <button key={label} onClick={() => setSection(section as AdminSection)} className="flex w-full items-center justify-between rounded-xl bg-white/8 px-4 py-3 text-sm hover:bg-white/14">
                {label}<Plus className="size-4" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function CollectionEditor({
  section,
  items,
  setItems,
}: {
  section: AdminSection;
  items: AdminItem[];
  setItems: (items: AdminItem[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  function addItem(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setItems([...items, { id: crypto.randomUUID(), title, subtitle, published: false, order: items.length + 1 }]);
    setTitle('');
    setSubtitle('');
    setOpen(false);
  }

  function move(index: number, direction: number) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next.map((item, itemIndex) => ({ ...item, order: itemIndex + 1 })));
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card">
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--ink-soft)]">{items.length} items · drag-style ordering controls are persisted when Supabase is connected.</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<button aria-label={`Add an item to ${section}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground" />}>
            <Plus className="size-4" /> Add {section === 'Gallery' ? 'photo' : 'item'}
          </DialogTrigger>
          <DialogContent className="bg-card sm:max-w-lg">
            <DialogHeader><DialogTitle className="font-heading text-3xl">Add to {section}</DialogTitle><DialogDescription>Create this as a draft, then complete its details and publish when ready.</DialogDescription></DialogHeader>
            <form onSubmit={addItem} className="space-y-5">
              <label className="block text-sm font-semibold">Name or title<input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-2 w-full rounded-xl border bg-background px-4 py-3 font-normal" /></label>
              <label className="block text-sm font-semibold">Subtitle or note<input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="mt-2 w-full rounded-xl border bg-background px-4 py-3 font-normal" /></label>
              <DialogFooter><button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Save draft</button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead className="w-16">Order</TableHead><TableHead>Content</TableHead><TableHead>Status</TableHead><TableHead className="w-28 text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell><div className="flex items-center gap-1"><button onClick={() => move(index, -1)} className="rounded p-1 hover:bg-secondary" aria-label={`Move ${item.title} up`}><ChevronsUpDown className="size-4" /></button><span className="text-xs text-[var(--ink-soft)]">{item.order}</span></div></TableCell>
              <TableCell><button className="text-left"><span className="block font-semibold">{item.title}</span><span className="text-xs text-[var(--ink-soft)]">{item.subtitle || 'No subtitle'}</span></button></TableCell>
              <TableCell><div className="flex items-center gap-2"><Switch checked={item.published} onCheckedChange={(checked) => setItems(items.map((row) => row.id === item.id ? { ...row, published: checked } : row))} aria-label={`Publish ${item.title}`} /><span className="hidden text-xs sm:inline">{item.published ? 'Published' : 'Draft'}</span></div></TableCell>
              <TableCell className="text-right"><button onClick={() => setItems(items.filter((row) => row.id !== item.id))} className="rounded-full p-2 text-[var(--ink-soft)] hover:bg-destructive/10 hover:text-destructive" aria-label={`Delete ${item.title}`}><Trash2 className="size-4" /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

function PageEditor({ fields }: { fields: Array<{ label: string; value: string }> }) {
  return (
    <form className="max-w-3xl rounded-2xl border bg-card p-6" onSubmit={(event) => event.preventDefault()}>
      <div className="space-y-6">
        {fields.map((field) => (
          <label key={field.label} className="block text-sm font-semibold">{field.label}
            {field.value.length > 80 ? <textarea defaultValue={field.value} rows={4} className="mt-2 w-full rounded-xl border bg-background px-4 py-3 font-normal" /> : <input defaultValue={field.value} className="mt-2 w-full rounded-xl border bg-background px-4 py-3 font-normal" />}
          </label>
        ))}
      </div>
      <div className="mt-7 flex items-center gap-3"><button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Save changes</button><span className="text-xs text-[var(--ink-soft)]">{supabaseConfigured ? 'Changes save to Supabase.' : 'Preview mode — connect Supabase to persist.'}</span></div>
    </form>
  );
}

function MediaManager() {
  return (
    <section className="rounded-2xl border bg-card p-6">
      <div className="rounded-2xl border-2 border-dashed p-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary"><Upload className="size-5" /></span>
        <h2 className="mt-5 text-3xl">Upload photographs</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--ink-soft)]">Add accessible alt text, preview the image, and reuse it throughout the site without uploading duplicates.</p>
        <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Choose images<input type="file" accept="image/*" multiple className="sr-only" />
        </label>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {['memorial-garden-hero.webp','planting-sweetpeas.webp','memorial-gathering.webp'].map((file) => (
          <div key={file} className="overflow-hidden rounded-xl border"><div className="relative aspect-square"><Image src={`/images/${file}`} alt="" fill sizes="25vw" className="object-cover" /></div><p className="truncate p-3 text-xs">{file}</p></div>
        ))}
      </div>
    </section>
  );
}

export function AdminConsole() {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [section, setSection] = useState<AdminSection>('Dashboard');
  const [collections, setCollections] = useState(initialCollections);
  const items = collections[section] ?? [];
  const title = section === 'Dashboard' ? 'Good afternoon' : section;

  const subtitle = useMemo(() => {
    if (section === 'Dashboard') return 'Here is what is happening across the memorial website.';
    if (section === 'Media') return 'Upload once, add alt text and reuse photographs across the site.';
    return 'Edit, order and publish the content visitors see.';
  }, [section]);

  if (token === undefined) return <Login onEnter={setToken} />;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b p-4"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-secondary"><Flower2 className="size-4" /></span><div><p className="font-heading text-lg leading-none">Living Memorial</p><p className="mt-1 text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/55">Administration</p></div></div></SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Manage</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton isActive={section === item.label} onClick={() => setSection(item.label)} tooltip={item.label}>
                      <item.icon /><span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-3">
          <SidebarMenu>
            <SidebarMenuItem><SidebarMenuButton render={<Link href="/" />}><LogOut /><span>View public site</span></SidebarMenuButton></SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3"><SidebarTrigger /><span className="text-sm text-[var(--ink-soft)]">{supabaseConfigured ? 'Connected to Supabase' : 'Preview content'}</span></div>
          <div className="flex items-center gap-3"><span className="hidden text-sm sm:block">Authorised administrator</span><CircleUserRound className="size-7 text-[var(--ink-soft)]" /></div>
        </header>
        <div className="p-5 sm:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><h1 className="text-4xl md:text-5xl">{title}</h1><p className="mt-2 text-sm text-[var(--ink-soft)]">{subtitle}</p></div>
          </div>
          {section === 'Dashboard' && <Dashboard setSection={setSection} />}
          {items.length > 0 && <CollectionEditor section={section} items={items} setItems={(next) => setCollections({ ...collections, [section]: next })} />}
          {editablePages[section] && <PageEditor fields={editablePages[section]!} />}
          {section === 'Media' && <MediaManager />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
