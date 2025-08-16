export type Viewing = 'UNREAD' | 'VIEWED' | null;

export function normalizeViewingStatus(s: unknown): Viewing {
  if (!s) {
    return null;
  }
  const v = String(s).toUpperCase();
  if (v === 'VIEWED' || v === 'READ' || v === 'SEEN') {
    return 'VIEWED';
  }
  if (v === 'UNREAD') {
    return 'UNREAD';
  }
  return null;
}

export function buildName(
  username?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  fallback?: string | number
): { name: string; initial: string } {
  const fullName = firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : '';
  const fb = fallback != null ? String(fallback) : '';
  const raw = username || fullName || fb;
  const name = raw || 'Unknown';
  const initial = raw ? raw.charAt(0).toUpperCase() : '?';
  return { name, initial };
}

export function toTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
