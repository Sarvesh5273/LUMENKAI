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

/** The five groups shown on the "Doors still open" home screen. */
export const CATEGORIES = [
  'criteria_free_drives',
  'open_source',
  'funded_internships',
  'abroad_scholarships',
  'hackathons_fellowships',
] as const;

export type OpportunityCategory = (typeof CATEGORIES)[number];

/**
 * Mass recruiter criteria (TCS NQT, Infosys, Wipro, ...) are stored with the
 * same record shape but a separate category. They never appear on the home
 * screen. They exist so the "Closed doors" tab can tell a student exactly
 * which cutoff shut them out and by how much.
 */
export const RECRUITER_CATEGORY = 'mass_recruiter' as const;

export type RecordCategory = OpportunityCategory | typeof RECRUITER_CATEGORY;

export const CATEGORY_LABELS: Record<RecordCategory, string> = {
  criteria_free_drives: 'Criteria-free drives',
  open_source: 'Open source programs',
  funded_internships: 'Funded internships and research',
  abroad_scholarships: 'Abroad scholarships',
  hackathons_fellowships: 'Hackathons and fellowships',
  mass_recruiter: 'Mass recruiter criteria',
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
  category: RecordCategory;
  /** One or two plain sentences: what it is and what you get. */
  summary: string;
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
