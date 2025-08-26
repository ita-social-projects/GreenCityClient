import { normalizeViewingStatus, buildName, toTime, formatTimeOrDate } from './chat-mappers';

describe('chat-mappers', () => {
  describe('normalizeViewingStatus', () => {
    it('returns null for falsy or unknown values', () => {
      expect(normalizeViewingStatus(null)).toBeNull();
      expect(normalizeViewingStatus(undefined)).toBeNull();
      expect(normalizeViewingStatus('')).toBeNull();
      expect(normalizeViewingStatus('whatever')).toBeNull();
    });

    it('normalizes VIEWED-like values', () => {
      expect(normalizeViewingStatus('VIEWED')).toBe('VIEWED');
      expect(normalizeViewingStatus('read')).toBe('VIEWED');
      expect(normalizeViewingStatus('Seen')).toBe('VIEWED');
    });

    it('normalizes UNREAD (case-insensitive)', () => {
      expect(normalizeViewingStatus('UNREAD')).toBe('UNREAD');
      expect(normalizeViewingStatus('unRead')).toBe('UNREAD');
    });
  });

  describe('buildName', () => {
    it('prefers username; falls back to full name; then to fallback; finally to Unknown/?', () => {
      expect(buildName('johnny', 'John', 'Doe', '123')).toEqual({ fullName: 'John Doe', nickname: 'johnny', initial: 'J' });

      expect(buildName(undefined, 'Jane', 'Doe', '123')).toEqual({ fullName: 'Jane Doe', nickname: 'Jane Doe', initial: 'J' });

      expect(buildName(null, null, null, 456)).toEqual({ fullName: '', nickname: '456', initial: '4' });

      expect(buildName(null, null, null, undefined)).toEqual({ fullName: '', nickname: 'Unknown', initial: '?' });
    });

    it('handles partial full names gracefully', () => {
      expect(buildName(undefined, 'Solo', null, 'x')).toEqual({ fullName: 'Solo', nickname: 'Solo', initial: 'S' });
      expect(buildName(undefined, null, 'Lastname', 'x')).toEqual({ fullName: 'Lastname', nickname: 'Lastname', initial: 'L' });
    });
  });

  describe('toTime', () => {
    let timeSpy: jasmine.Spy;

    afterEach(() => {
      timeSpy?.and.callThrough();
      timeSpy = undefined as any;
    });

    it('formats using toLocaleTimeString (stubbed for determinism)', () => {
      timeSpy = spyOn(Date.prototype, 'toLocaleTimeString').and.returnValue('09:30');
      expect(toTime('2024-01-01T09:30:00.000Z')).toBe('09:30');

      expect(timeSpy).toHaveBeenCalled();
    });
  });

  describe('formatTimeOrDate', () => {
    let timeSpy: jasmine.Spy;
    let dateSpy: jasmine.Spy;

    afterEach(() => {
      timeSpy?.and.callThrough();
      dateSpy?.and.callThrough();
      jasmine.clock().uninstall();
    });

    it('returns empty string for falsy or invalid inputs', () => {
      expect(formatTimeOrDate(undefined)).toBe('');
      expect(formatTimeOrDate(null)).toBe('');
      expect(formatTimeOrDate('not-a-date')).toBe('');
    });

    it('returns time only when same day (uses mocked Date "now")', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2024-01-02T12:00:00.000Z'));

      timeSpy = spyOn(Date.prototype, 'toLocaleTimeString').and.returnValue('10:15');

      const result = formatTimeOrDate('2024-01-02T10:15:00.000Z');
      expect(result).toBe('10:15');
      expect(timeSpy).toHaveBeenCalled();
    });

    it('returns "date time" for other days (stubs locale-dependent methods)', () => {
      timeSpy = spyOn(Date.prototype, 'toLocaleTimeString').and.returnValue('07:45');
      dateSpy = spyOn(Date.prototype, 'toLocaleDateString').and.returnValue('02/01/2024');

      const result = formatTimeOrDate('2024-01-02T07:45:00.000Z');
      expect(result).toBe('02/01/2024 07:45');
      expect(dateSpy).toHaveBeenCalled();
      expect(timeSpy).toHaveBeenCalled();
    });
  });
});
