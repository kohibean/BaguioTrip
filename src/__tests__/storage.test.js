import { describe, it, expect } from 'vitest';
import { defaultTrip, crpId } from '../storage.js';

describe('trip model', () => {
  it('default trip has two days', () => {
    const t = defaultTrip();
    expect(t.days).toHaveLength(2);
    expect(t.days[0].stops).toEqual([]);
  });

  it('crpId produces unique-ish ids', () => {
    const a = crpId(); const b = crpId();
    expect(a).not.toBe(b);
    expect(a.startsWith('id-')).toBe(true);
  });
});
