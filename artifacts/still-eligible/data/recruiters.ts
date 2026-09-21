import { Opportunity } from '../lib/types';

/**
 * Mass recruiter cutoffs. These records feed the Closed doors tab only.
 *
 * Only recruiters that publish their criteria on an official public page are
 * kept. Most Indian mass recruiters do not: their cutoffs reach students
 * through campus placement cells, not through a URL anyone can read. Those
 * companies were reviewed and left out on purpose. See
 * docs/verification/recruiters.md for the list and the reasons.
 */
export const RECRUITERS: Opportunity[] = [
  {
    id: 'tcs-nqt',
    title: 'TCS All India NQT Hiring',
    org: 'Tata Consultancy Services',
    category: 'mass_recruiter',
    summary: 'TCS uses the NQT selection process to place eligible graduates into Ninja, Digital or Prime interviews based on test performance.',
    official_url: 'https://www.tcs.com/careers/india/tcs-all-india-nqt-hiring',
    source_url: 'https://www.tcs.com/careers/india/tcs-all-india-nqt-hiring',
    last_verified: '2026-09-21',
    deadline: '2026-03-20',
    typical_window: 'Registration for the 2026 drive opened in mid February and closed on 20 March. The next drive is not announced.',
    rules: {
      min_tenth_pct: 60, min_twelfth_pct: 60, min_cgpa: null,
      max_active_backlogs: 0, max_gap_years: 2, grad_years: null,
      citizenship: 'any', gender: 'any', requires_student: false, branches: 'any',
      min_work_years: null,
    },
    verification_status: 'needs_check',
    tags: ['fresher hiring', 'NQT', 'engineering'],
    notes: 'The official page requires 60% or equivalent CGPA in class 10, class 12, diploma and graduation. It gives no 10-point CGPA cutoff, so min_cgpa is left empty; treat 60% aggregate in your degree as the bar. The 2026 drive was open to the 2024, 2025 and 2026 batches only and capped work experience at two years. The batch list for the next drive is not announced, so no graduation year rule is applied here. Re-check before relying on this.',
    alternative_ids: ['zoho-off-campus-hiring', 'hackwithinfy', 'juspay-developer-hiring'],
  },
];
