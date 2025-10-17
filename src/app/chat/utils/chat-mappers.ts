export type Viewing = 'UNREAD' | 'VIEWED' | null;

export function normalizeViewingStatus(s: unknown): Viewing {
  if (s == null) {
    return null;
  }

  let v: string;
  if (typeof s === 'string') {
    v = s.trim().toUpperCase();
  } else if (typeof s === 'number') {
    v = String(s).toUpperCase();
  } else if (typeof s === 'boolean') {
    v = String(s).toUpperCase();
  } else {
    return null;
  }
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
): { fullName: string; nickname: string; initial: string } {
  const fullName = firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : '';
  const fb = fallback != null ? String(fallback) : '';
  const raw = username || fullName || fb;
  const nickname = raw || 'Unknown';
  const initial = raw ? raw.charAt(0).toUpperCase() : '?';
  return { fullName, nickname, initial };
}

export function toTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatTimeOrDate(iso?: string | null, isEdit?: boolean): string {
  if (!iso) {
    return '';
  }
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    return '';
  }

  const now = new Date();
  const sameDay = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();

  if (sameDay && !isEdit) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const date = d.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${date} ${time}`;
}
