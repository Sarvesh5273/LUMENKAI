export type OpportunityCategory = 'mass_recruiter' | 'product' | 'startup' | 'government' | 'higher_ed';

export type RuleType = 
  | 'min_cgpa' 
  | 'min_10th' 
  | 'min_12th' 
  | 'max_backlogs' 
  | 'max_gap_years' 
  | 'allowed_branches' 
  | 'allowed_grad_years' 
  | 'citizenship' 
  | 'gender';

export type OpportunityRule = 
  | { type: 'min_cgpa' | 'min_10th' | 'min_12th' | 'max_backlogs' | 'max_gap_years'; value: number }
  | { type: 'allowed_branches' | 'allowed_grad_years' | 'citizenship' | 'gender'; value: (string | number)[] };

export type Opportunity = {
  id: string;
  title: string;
  company: string;
  category: OpportunityCategory;
  deadline: string | null; // ISO format or null if rolling
  expected_next_cycle: boolean;
  rules: OpportunityRule[];
  official_url: string;
  source_url: string;
  last_verified: string; // ISO format
  tags: string[];
  notes: string;
};

export type UserProfile = {
  percent_10th: number | null;
  percent_12th: number | null;
  cgpa: number | null;
  active_backlogs: number | null;
  gap_years: number | null;
  branch: string | null;
  grad_year: number | null;
  citizenship: string | null;
  gender: string | null;
  student_status: string | null; // e.g. 'Enrolled', 'Graduated'
};

export type RuleEvaluation = {
  rule: OpportunityRule;
  status: 'pass' | 'fail' | 'unknown';
  reason: string;
};

export type EligibilityResult = {
  status: 'eligible' | 'not_eligible' | 'unknown';
  ruleResults: RuleEvaluation[];
};
