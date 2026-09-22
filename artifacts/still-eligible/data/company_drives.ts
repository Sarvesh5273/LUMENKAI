import { Opportunity } from '../lib/types';

/**
 * Off-campus company drives: only companies whose official page prints the
 * eligibility text a student can read (batch, degree, cutoffs or the absence
 * of cutoffs) and that hire students directly.
 *
 * Most Indian mass recruiters do not publish criteria anywhere a student can
 * read them; their cutoffs reach colleges through placement cells. Those
 * companies were reviewed and left out on purpose. See
 * docs/verification/recruiters.md for the list and the reasons. Product
 * companies with no official eligibility page (Google, Amazon, Microsoft,
 * Atlassian, Zoho, Juspay) were dropped on 2026-09-22; see the "Reviewed and
 * dropped" section of docs/verification/company_drives.md.
 */
export const COMPANY_DRIVES: Opportunity[] = [
  {
    id: 'hackwithinfy',
    title: 'HackWithInfy',
    org: 'Infosys',
    category: 'company_drives',
    summary:
      'A coding competition for engineering students that can lead to Infosys internships and employment opportunities. Participants compete in coding rounds and selected finalists attend the grand finale.',
    benefit: {
      kind: 'paid_role',
      what_you_get:
        'Finalists can get Infosys internship and job offers, decided by the coding rounds.',
      amount_text: null,
      amount_status: 'not_stated',
      amount_source: null,
    },
    location: { mode: 'hybrid', place: 'Online rounds, grand finale in India' },
    apply: {
      what_you_need: 'Registration through your college placement officer',
      how_they_select: 'Online coding rounds, then a grand finale for the shortlisted',
      beginner_friendly: null,
      application_fee: null,
      fee_status: 'free',
    },
    official_url: 'https://www.infosys.com/careers/hackwithinfy.html',
    source_url:
      'https://www.infosys.com/careers/hackwithinfy/2026/hwi-terms-conditions.pdf',
    last_verified: '2026-09-22',
    deadline: 'tbd',
    typical_window: 'College-led registration usually runs from February into March',
    rules: {
      min_tenth_pct: null,
      min_twelfth_pct: null,
      min_cgpa: null,
      max_active_backlogs: null,
      max_gap_years: null,
      grad_years: [2027],
      citizenship: 'any',
      gender: 'any',
      requires_student: true,
      branches: 'any',
      min_work_years: null,
    },
    verification_status: 'verified',
    tags: ['coding', 'hiring', 'internship'],
    notes: 'The 2026 terms and conditions require participants to be 18 or older, resident in India, and BE, BTech, ME, MTech, dual degree, MS (Research), MCA or five-year integrated MSc students graduating in 2027; for the 2027 edition expect the batch to move forward. They print no marks, backlog or gap rule, say participation is free, and say registration opened on 6 February 2026 through the college placement officer, without a closing date.',
    alternative_ids: ['tcs-nqt', 'qualcomm-campus-hiring-india'],
  },
  {
    id: 'tcs-nqt',
    title: 'TCS All India NQT Hiring',
    org: 'Tata Consultancy Services',
    category: 'company_drives',
    summary: 'TCS uses the NQT selection process to place eligible graduates into Ninja, Digital or Prime interviews based on test performance.',
    benefit: {
      kind: 'paid_role',
      what_you_get:
        'A TCS Ninja, Digital or Prime job offer, decided by your NQT score and interviews.',
      amount_text: 'Prime tier: 9.09 LPA - 9.30 LPA (the page prints no Ninja or Digital figure)',
      amount_status: 'stated',
      amount_source: 'https://www.tcs.com/careers/india/tcs-all-india-nqt-hiring',
    },
    location: { mode: 'on_site', place: 'India' },
    apply: {
      what_you_need: 'Registration on the TCS NextStep portal',
      how_they_select: 'The National Qualifier Test, then interviews for the Ninja, Digital or Prime tier',
      beginner_friendly: null,
      application_fee: null,
      fee_status: 'free',
    },
    official_url: 'https://www.tcs.com/careers/india/tcs-all-india-nqt-hiring',
    source_url: 'https://www.tcs.com/careers/india/tcs-all-india-nqt-hiring',
    last_verified: '2026-09-22',
    deadline: '2026-03-20',
    typical_window: 'Registration for the 2026 drive opened in mid February and closed on 20 March. The next drive is not announced.',
    rules: {
      min_tenth_pct: 60, min_twelfth_pct: 60, min_cgpa: null,
      max_active_backlogs: 0, max_gap_years: 2, grad_years: [2024, 2025, 2026],
      citizenship: 'any', gender: 'any', requires_student: false, branches: 'any',
      min_work_years: null,
    },
    verification_status: 'needs_check',
    tags: ['fresher hiring', 'NQT', 'engineering'],
    notes: 'The official page requires 60% or equivalent CGPA in class 10, class 12, diploma and graduation. It gives no 10-point CGPA cutoff, so min_cgpa is left empty; treat 60% aggregate in your degree as the bar. Because the app cannot compare that degree percentage with your 10-point CGPA, the record stays unconfirmed and a pass on the school marks alone is not a full pass. The closed 2026 drive was open to the 2024, 2025 and 2026 batches only and capped work experience at two years. The salary figure shown is the Prime offer range for a UG candidate with zero to one year of experience.',
    alternative_ids: ['hackwithinfy', 'qualcomm-campus-hiring-india'],
  },
  {
    id: 'qualcomm-campus-hiring-india',
    title: 'Qualcomm Campus Hiring India',
    org: 'Qualcomm India',
    category: 'company_drives',
    summary:
      'Qualcomm hires campus graduates for software engineering roles in India. The role covers embedded software, platforms, connectivity and application development.',
    benefit: {
      kind: 'paid_role',
      what_you_get: 'A full-time associate software engineering role at Qualcomm India.',
      amount_text: null,
      amount_status: 'not_stated',
      amount_source: null,
    },
    location: { mode: 'on_site', place: 'Hyderabad, Bengaluru, Chennai or Noida' },
    apply: {
      what_you_need: 'A resume showing your engineering degree and relevant software skills.',
      how_they_select: null,
      beginner_friendly: null,
      application_fee: null,
      fee_status: 'unchecked',
    },
    official_url:
      'https://careers.qualcomm.com/careers/apply?pid=446719784235&domain=qualcomm.com',
    source_url:
      'https://careers.qualcomm.com/careers/job/446719784235?domain=qualcomm.com',
    last_verified: '2026-09-22',
    deadline: 'tbd',
    typical_window:
      'The 2027 campus listing was open in September 2026 and gave no closing date.',
    rules: {
      min_tenth_pct: null,
      min_twelfth_pct: null,
      min_cgpa: null,
      max_active_backlogs: null,
      max_gap_years: null,
      grad_years: null,
      citizenship: 'any',
      gender: 'any',
      requires_student: false,
      branches: ['CSE', 'ECE'],
      min_work_years: null,
    },
    verification_status: 'verified',
    tags: ['campus hiring', 'software', 'engineering'],
    notes:
      'The official page lists no marks, backlog or gap cutoff. Its education line names Computer Science Engineering, Communication Engineering and ECE, and the minimum qualification also allows a related engineering, information systems or computer science field.',
    alternative_ids: ['tcs-nqt', 'qualcomm-hardware-internship-india'],
  },
  {
    id: 'qualcomm-hardware-internship-india',
    title: 'Qualcomm Hardware Engineering Internship India',
    org: 'Qualcomm India',
    category: 'company_drives',
    summary:
      'A Qualcomm hardware engineering internship in India covering chip design, verification, validation and related engineering work.',
    benefit: {
      kind: 'paid_role',
      what_you_get: 'A hardware engineering internship with Qualcomm India.',
      amount_text: null,
      amount_status: 'not_stated',
      amount_source: null,
    },
    location: { mode: 'on_site', place: 'Bengaluru and one other India location' },
    apply: {
      what_you_need: 'A resume showing an electrical, VLSI, embedded systems or ECE background.',
      how_they_select: null,
      beginner_friendly: false,
      application_fee: null,
      fee_status: 'unchecked',
    },
    official_url:
      'https://careers.qualcomm.com/careers/apply?pid=446719784824&domain=qualcomm.com',
    source_url:
      'https://careers.qualcomm.com/careers/job/446719784824?domain=qualcomm.com',
    last_verified: '2026-09-22',
    deadline: 'tbd',
    typical_window:
      'The 2027 internship listing was open in September 2026 and gave no closing date.',
    rules: {
      min_tenth_pct: null,
      min_twelfth_pct: null,
      min_cgpa: null,
      max_active_backlogs: null,
      max_gap_years: null,
      grad_years: null,
      citizenship: 'any',
      gender: 'any',
      requires_student: false,
      branches: ['ECE', 'EE'],
      min_work_years: null,
    },
    verification_status: 'verified',
    tags: ['internship', 'hardware', 'VLSI'],
    notes:
      'The official page lists no marks, backlog or gap cutoff and does not state that current enrolment is required. It names bachelor or master backgrounds in Electrical Engineering, VLSI, Embedded and VLSI, or ECE.',
    alternative_ids: ['qualcomm-campus-hiring-india', 'tcs-nqt'],
  },
];
