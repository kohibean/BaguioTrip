import { describe, it, expect } from 'vitest';
import { describeCode } from '../weather.js';

describe('describeCode', () => {
  it('maps a known WMO code to a label', () => {
    const { label } = describeCode(0);
    expect(label).toBe('Clear');
  });

  it('maps rain codes sensibly', () => {
    expect(describeCode(63).label).toBe('Rain');
  });

  it('falls back gracefully for unknown codes', () => {
    const { label } = describeCode(9999);
    expect(label).toBeTruthy();
  });
});
