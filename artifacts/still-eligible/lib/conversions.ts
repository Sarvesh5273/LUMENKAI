/**
 * CGPA and percentage conversion helpers for the onboarding form.
 *
 * There is no single official formula in India. CBSE uses 9.5, many
 * universities use 10, and some use their own curve. The app therefore never
 * converts silently. It offers a named formula, shows the result, and lets
 * the student pick or type the number their university gives them.
 */

export type ConversionFormula = 'cbse_9_5' | 'direct_10';

export const CONVERSION_FORMULAS: Record<
  ConversionFormula,
  { label: string; description: string; factor: number }
> = {
  cbse_9_5: {
    label: 'CGPA x 9.5',
    description: 'The CBSE convention. Many universities and recruiters use it when nothing else is specified.',
    factor: 9.5,
  },
  direct_10: {
    label: 'CGPA x 10',
    description: 'Used by universities that treat CGPA as percentage divided by ten.',
    factor: 10,
  },
};

function roundTo(value: number, decimals: number): number {
  const p = 10 ** decimals;
  return Math.round(value * p) / p;
}

export function isValidPercentage(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

export function isValidCgpa(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 10;
}

/** 8.2 CGPA -> 77.9% with the CBSE formula. Clamped to 100. */
export function cgpaToPercentage(cgpa: number, formula: ConversionFormula = 'cbse_9_5'): number {
  if (!isValidCgpa(cgpa)) {
    throw new RangeError(`CGPA must be between 0 and 10, got ${cgpa}`);
  }
  return roundTo(Math.min(100, cgpa * CONVERSION_FORMULAS[formula].factor), 2);
}

/** 77.9% -> 8.2 CGPA with the CBSE formula. Clamped to 10. */
export function percentageToCgpa(pct: number, formula: ConversionFormula = 'cbse_9_5'): number {
  if (!isValidPercentage(pct)) {
    throw new RangeError(`Percentage must be between 0 and 100, got ${pct}`);
  }
  return roundTo(Math.min(10, pct / CONVERSION_FORMULAS[formula].factor), 2);
}

/**
 * Students often type "82" into a CGPA field when they meant 82%, or "8.2"
 * into a percentage field. This flags the obvious cases so the form can ask
 * before saving a wrong number.
 */
export function looksLikePercentage(value: number): boolean {
  return Number.isFinite(value) && value > 10 && value <= 100;
}

export function looksLikeCgpa(value: number): boolean {
  return Number.isFinite(value) && value > 0 && value <= 10;
}
