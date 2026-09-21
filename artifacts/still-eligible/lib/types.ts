/**
 * Core data model for StillEligible.
 *
 * Everything the app knows lives in two shapes: the student's profile
 * (entered once, stored on the device) and opportunity records (shipped
 * inside the app as structured data). The eligibility engine in
 * `lib/engine.ts` compares one against the other.
 *
 * Read this file before touching `data/` or `lib/engine.ts`.
 */

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

/**
 * The six groups shown on the "Doors open" home screen, in display order.
 * The order runs from the lowest barrier (a hackathon this weekend) to the
 * highest (a company drive with published cutoffs), which is also the order
 * the "Path from zero" screen walks through.
 */
export const CATEGORIES = [
  'hackathons_fellowships',
  'open_source',
  'funded_internships',
  'scholarships',
  'startup_programs',
  'company_drives',
] as const;

export type OpportunityCategory = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  hackathons_fellowships: 'Hackathons and fellowships',
  open_source: 'Open source programs',
  funded_internships: 'Funded internships and research',
  scholarships: 'Masters and MTech scholarships',
  startup_programs: 'Startup programs',
  company_drives: 'Off-campus company drives',
};

/**
 * Two plain sentences per category for a student who has never heard of it:
 * what this kind of opportunity is and how it pays. Shown under each section
 * header on the home screen.
 */
export const CATEGORY_INTROS: Record<OpportunityCategory, string> = {
  hackathons_fellowships:
    'Hackathons are short contests where a team builds a working demo for a problem statement, and fellowships are short paid programs for students. Winners get cash prizes, and sponsors often shortlist finalists for internships.',
  open_source:
    'Open source programs pay you to build and fix real software under a mentor, from home. Most pay a fixed stipend over 8 to 12 weeks and never ask for your marks.',
  funded_internships:
    'Research internships place you in a lab or a company team for a summer, in India or abroad. The funded ones cover travel and stay and pay a monthly stipend.',
  scholarships:
    'These pay for a masters or MTech degree, in India or abroad. Fully funded ones cover tuition and living costs, and most are decided on your degree marks, a test and an interview, not your 10th or 12th.',
  startup_programs:
    'Startup programs give student founders money, mentoring and sometimes a place to work while they build a company. Only programs that pay a grant or a fellowship are listed, not credit-only offers.',
  company_drives:
    'Off-campus drives are how companies hire students who did not get them through college placements. Mass recruiters publish marks cutoffs, while product companies mostly select through a coding test instead.',
};

// ---------------------------------------------------------------------------
// What the student gets, where it happens, what applying takes
// ---------------------------------------------------------------------------

/**
 * The kind of money on offer. Drives the chip on the card when no amount is
 * known. `unpaid` is allowed so a stepping stone (a first pull request) can
 * be listed without pretending it pays.
 */
export const BENEFIT_KINDS = [
  'stipend',
  'prize_money',
  'funded_study',
  'grant',
  'paid_role',
  'costs_covered',
  'unpaid',
] as const;

export type BenefitKind = (typeof BENEFIT_KINDS)[number];

export const BENEFIT_KIND_LABELS: Record<BenefitKind, string> = {
  stipend: 'Stipend',
  prize_money: 'Prize money',
  funded_study: 'Tuition and living covered',
  grant: 'Grant',
  paid_role: 'Paid job or internship',
  costs_covered: 'Costs covered, no pay',
  unpaid: 'Unpaid',
};

/**
 * - stated:     the official page prints an amount and `amount_text` quotes it
 * - not_stated: someone read the official page and it gives no amount
 * - unchecked:  nobody has read the page for the amount yet
 *
 * The app words each state differently, so a gap in our reading is never
 * shown as a fact about the program.
 */
export type AmountStatus = 'stated' | 'not_stated' | 'unchecked';

export type Benefit = {
  kind: BenefitKind;
  /** One plain sentence: what the student gets, e.g. "A stipend paid over 12 weeks, sized by project length and country." */
  what_you_get: string;
  /** The amount as the official page prints it, e.g. "USD 7,000 for the internship". Required when `amount_status` is `stated`, null otherwise. */
  amount_text: string | null;
  amount_status: AmountStatus;
  /**
   * Where the amount was read: the URL of the page that prints it. Required
   * when `amount_status` is `stated`, so every figure the app shows can be
   * traced to an official page. null otherwise.
   */
  amount_source: string | null;
};

export const LOCATION_MODES = ['remote', 'on_site', 'hybrid'] as const;
export type LocationMode = (typeof LOCATION_MODES)[number];

export const LOCATION_MODE_LABELS: Record<LocationMode, string> = {
  remote: 'Remote',
  on_site: 'On-site',
  hybrid: 'Hybrid',
};

export type Location = {
  mode: LocationMode;
  /**
   * Where, in a few words. Required for `on_site` and `hybrid` ("Bengaluru",
   * "Germany", "Online rounds, finale in India"). Optional for `remote`, where
   * it carries a note like "Open worldwide" or "India only".
   */
  place: string | null;
};

/**
 * - free:      the official page says there is no fee, or a human read the
 *              application flow end to end and found none
 * - paid:      the page names a fee and `application_fee` quotes it
 * - unchecked: nobody has looked yet
 *
 * Only `free` makes the app print "Free to apply". An unchecked fee is
 * described as unchecked, never as free.
 */
export type FeeStatus = 'free' | 'paid' | 'unchecked';

/**
 * What applying actually takes. Every text field is nullable: null means
 * nobody has recorded it yet, and the app says so instead of guessing.
 */
export type ApplyReady = {
  /** Documents, accounts, nominations and lead time, e.g. "A project proposal and a GitHub account". */
  what_you_need: string | null;
  /** How they pick people, e.g. "Online coding test, then two interviews". */
  how_they_select: string | null;
  /** True only when the official page says beginners or people with no prior experience are welcome. null when the page does not say. */
  beginner_friendly: boolean | null;
  /**
   * The application fee as the official page prints it, e.g. "INR 500
   * registration fee". Required when `fee_status` is `paid`, null otherwise.
   */
  application_fee: string | null;
  fee_status: FeeStatus;
};

// ---------------------------------------------------------------------------
// Profile vocabularies
// ---------------------------------------------------------------------------

/** Canonical branch codes. Rules refer to these codes, never to free text. */
export const BRANCHES = [
  'CSE',
  'IT',
  'AI_DS',
  'ECE',
  'EE',
  'ME',
  'CE',
  'CHEM',
  'OTHER',
] as const;

export type Branch = (typeof BRANCHES)[number];

export const BRANCH_LABELS: Record<Branch, string> = {
  CSE: 'Computer Science',
  IT: 'Information Technology',
  AI_DS: 'AI / Data Science / ML',
  ECE: 'Electronics and Communication',
  EE: 'Electrical',
  ME: 'Mechanical',
  CE: 'Civil',
  CHEM: 'Chemical',
  OTHER: 'Other engineering',
};

export const CITIZENSHIPS = ['IN', 'OTHER'] as const;
export type Citizenship = (typeof CITIZENSHIPS)[number];

export const CITIZENSHIP_LABELS: Record<Citizenship, string> = {
  IN: 'Indian citizen',
  OTHER: 'Other nationality',
};

/**
 * Gender is optional. It exists only so women-only programs can be matched.
 * `prefer_not_to_say` is treated as unknown, never as a failure.
 */
export const GENDERS = ['woman', 'man', 'non_binary', 'prefer_not_to_say'] as const;
export type Gender = (typeof GENDERS)[number];

export const GENDER_LABELS: Record<Gender, string> = {
  woman: 'Woman',
  man: 'Man',
  non_binary: 'Non-binary',
  prefer_not_to_say: 'Prefer not to say',
};

// ---------------------------------------------------------------------------
// The student's profile
// ---------------------------------------------------------------------------

/**
 * Every field is nullable on purpose. A missing field never fails a rule; it
 * makes that rule "unknown", and the app asks the student to fill it in.
 */
export type UserProfile = {
  /** Class 10 percentage, 0 to 100. */
  tenth_pct: number | null;
  /** Class 12 (or diploma) percentage, 0 to 100. */
  twelfth_pct: number | null;
  /** Current CGPA on a 10-point scale. */
  cgpa: number | null;
  /** Number of currently active (uncleared) backlogs. */
  active_backlogs: number | null;
  /** Total gap years in education so far. */
  gap_years: number | null;
  branch: Branch | null;
  /** Expected year of graduation, e.g. 2028. */
  grad_year: number | null;
  citizenship: Citizenship | null;
  gender: Gender | null;
  /** True while currently enrolled in a degree program. */
  is_student: boolean | null;
  /** Full-time work experience in years. Students almost always enter 0. */
  work_years: number | null;
};

export const EMPTY_PROFILE: UserProfile = {
  tenth_pct: null,
  twelfth_pct: null,
  cgpa: null,
  active_backlogs: null,
  gap_years: null,
  branch: null,
  grad_year: null,
  citizenship: null,
  gender: null,
  is_student: null,
  work_years: null,
};

// ---------------------------------------------------------------------------
// Opportunity records
// ---------------------------------------------------------------------------

/**
 * The rules block of an opportunity.
 *
 * `null` means "this program does not apply this cutoff". If a cutoff
 * could not be confirmed from an official page, the record must set
 * `verification_status: 'needs_check'` and explain in `notes`. Never invent
 * a number to fill a gap.
 */
export type EligibilityRules = {
  min_tenth_pct: number | null;
  min_twelfth_pct: number | null;
  min_cgpa: number | null;
  max_active_backlogs: number | null;
  max_gap_years: number | null;
  /** Allowed graduation years, or null when the program does not care. */
  grad_years: number[] | null;
  citizenship: Citizenship[] | 'any';
  gender: 'any' | 'women';
  /** True when the applicant must currently be enrolled. */
  requires_student: boolean;
  branches: Branch[] | 'any';
  /**
   * Minimum full-time work experience in years, or null. Not part of the
   * original five cutoffs, but several flagship scholarships (Chevening,
   * Fulbright-Nehru) gate on it, and without this rule the app would tell a
   * third-year student "you qualify" when they do not.
   */
  min_work_years: number | null;
};

export type VerificationStatus = 'verified' | 'needs_check';

export type Opportunity = {
  /** Stable kebab-case id, e.g. "gsoc-2027". Never reuse or rename. */
  id: string;
  title: string;
  /** The organisation behind the program. */
  org: string;
  category: OpportunityCategory;
  /** One or two plain sentences: what it is and what you get. */
  summary: string;
  /** What the student gets: the kind of money, a plain sentence, and the amount if the page states one. */
  benefit: Benefit;
  /** Where it happens: remote, on-site somewhere, or hybrid. */
  location: Location;
  /** What applying takes. Nullable fields mean "not recorded yet". */
  apply: ApplyReady;
  /** The page where the student actually applies. */
  official_url: string;
  /** The page where the eligibility criteria were read. Often the same URL. */
  source_url: string;
  /** Date (YYYY-MM-DD) someone last read the official page. */
  last_verified: string;
  /**
   * Application deadline as YYYY-MM-DD. Use "rolling" when applications are
   * accepted at any time, and "tbd" when the next cycle's date has not been
   * announced yet. Never guess a date.
   */
  deadline: string | 'rolling' | 'tbd';
  /**
   * Plain text describing the usual annual window, e.g. "Applications open
   * late January and close mid February". Shown when the stored deadline has
   * already passed or is "tbd", so the card can say "expected next cycle".
   */
  typical_window: string | null;
  rules: EligibilityRules;
  verification_status: VerificationStatus;
  tags: string[];
  /** Free text for caveats, unconfirmed criteria, and context. */
  notes: string;
  /** Ids of the nearest alternatives. Used by the "Closed doors" tab. */
  alternative_ids: string[];
};

// ---------------------------------------------------------------------------
// Engine output
// ---------------------------------------------------------------------------

export type RuleKey = keyof EligibilityRules;

/**
 * - pass:    the student meets this rule
 * - fail:    the student does not meet this rule
 * - unknown: the rule exists but the profile is missing the field it needs
 * - no_rule: the program does not apply this cutoff at all
 */
export type RuleStatus = 'pass' | 'fail' | 'unknown' | 'no_rule';

export type RuleEvaluation = {
  key: RuleKey;
  /** Short human label, e.g. "12th percentage". */
  label: string;
  status: RuleStatus;
  /** One plain sentence a student can read out loud. */
  reason: string;
};

export type EligibilityStatus = 'eligible' | 'not_eligible' | 'unknown';

export type EligibilityResult = {
  status: EligibilityStatus;
  /** Every rule, in a fixed display order. */
  rules: RuleEvaluation[];
  /** Convenience views over `rules`. */
  failed: RuleEvaluation[];
  unknown: RuleEvaluation[];
  passed: RuleEvaluation[];
  noRule: RuleEvaluation[];
  /** Profile fields the student must fill to resolve every unknown rule. */
  missingFields: (keyof UserProfile)[];
};
