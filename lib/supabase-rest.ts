const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

type Session = {
  access_token: string;
  user: { id: string; email?: string };
};

function headers(token?: string) {
  return {
    apikey: anonKey ?? '',
    Authorization: `Bearer ${token ?? anonKey ?? ''}`,
    'Content-Type': 'application/json',
  };
}

export async function signInAdmin(email: string, password: string): Promise<Session> {
  if (!url || !anonKey) throw new Error('Supabase is not connected.');
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { error_description?: string; msg?: string };
    throw new Error(error.error_description ?? error.msg ?? 'Sign in failed.');
  }
  return response.json();
}

export async function listRecords<T>(table: string, token?: string): Promise<T[]> {
  if (!url || !anonKey) return [];
  const response = await fetch(`${url}/rest/v1/${table}?select=*&order=display_order.asc`, {
    headers: headers(token),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Could not load content.');
  return response.json();
}

export async function saveRecord(
  table: string,
  record: Record<string, unknown>,
  token: string,
) {
  if (!url || !anonKey) return;
  const response = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers(token), Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(record),
  });
  if (!response.ok) throw new Error('Could not save this item.');
  return response.json();
}

export async function deleteRecord(table: string, id: string, token: string) {
  if (!url || !anonKey) return;
  const response = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  if (!response.ok) throw new Error('Could not remove this item.');
}

export async function uploadMedia(file: File, token: string) {
  if (!url || !anonKey) throw new Error('Supabase is not connected.');
  const safeName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
  const response = await fetch(`${url}/storage/v1/object/memorial-media/${safeName}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: file,
  });
  if (!response.ok) throw new Error('Upload failed.');
  return `${url}/storage/v1/object/public/memorial-media/${safeName}`;
}

export async function submitContactMessage(message: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!url || !anonKey) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return { preview: true };
  }
  const response = await fetch(`${url}/rest/v1/contact_messages`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'return=minimal' },
    body: JSON.stringify(message),
  });
  if (!response.ok) throw new Error('Your message could not be sent. Please try again.');
  return { preview: false };
}
