import {
  cgpaToPercentage,
  isValidCgpa,
  isValidPercentage,
  looksLikeCgpa,
  looksLikePercentage,
  percentageToCgpa,
} from '../lib/conversions';

describe('conversions', () => {
  test('CBSE formula both ways', () => {
    expect(cgpaToPercentage(8.2)).toBe(77.9);
    expect(percentageToCgpa(77.9)).toBe(8.2);
    expect(cgpaToPercentage(10)).toBe(95);
  });

  test('direct formula both ways', () => {
    expect(cgpaToPercentage(8.2, 'direct_10')).toBe(82);
    expect(percentageToCgpa(82, 'direct_10')).toBe(8.2);
  });

  test('results are clamped to the scale', () => {
    expect(percentageToCgpa(100)).toBe(10);
    expect(cgpaToPercentage(10, 'direct_10')).toBe(100);
  });

  test('out-of-range input throws instead of returning nonsense', () => {
    expect(() => cgpaToPercentage(11)).toThrow(RangeError);
    expect(() => percentageToCgpa(-1)).toThrow(RangeError);
    expect(() => cgpaToPercentage(Number.NaN)).toThrow(RangeError);
  });

  test('validators', () => {
    expect(isValidCgpa(0)).toBe(true);
    expect(isValidCgpa(10)).toBe(true);
    expect(isValidCgpa(10.1)).toBe(false);
    expect(isValidPercentage(100)).toBe(true);
    expect(isValidPercentage(100.5)).toBe(false);
  });

  test('typo detectors', () => {
    expect(looksLikePercentage(82)).toBe(true);
    expect(looksLikePercentage(8.2)).toBe(false);
    expect(looksLikeCgpa(8.2)).toBe(true);
    expect(looksLikeCgpa(82)).toBe(false);
  });
});
