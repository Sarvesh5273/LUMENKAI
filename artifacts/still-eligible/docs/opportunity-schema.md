# Opportunity Schema

The `Opportunity` object is strictly typed to ensure the Eligibility Engine is fully deterministic.

## Types

```typescript
type OpportunityCategory = 'mass_recruiter' | 'product' | 'startup' | 'government' | 'higher_ed';

type OpportunityRule = 
  | { type: 'min_cgpa' | 'min_10th' | 'min_12th' | 'max_backlogs' | 'max_gap_years'; value: number }
  | { type: 'allowed_branches' | 'allowed_grad_years' | 'citizenship' | 'gender'; value: (string | number)[] };

type Opportunity = {
  id: string; // Unique string
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
```

## Rules Engine
The engine processes each rule sequentially against the user's profile:
- If a user fails *any* rule, they are marked `not_eligible`.
- If a rule requires data the user has not provided, it is marked `unknown`. If no rules fail but some are unknown, overall status is `unknown`.
- If all rules pass, overall status is `eligible`.

Unknown numeric criteria MUST NOT be guessed. If an opportunity does not state a CGPA requirement, do not invent one.
