import { Opportunity, OpportunityRule, UserProfile, EligibilityResult, RuleEvaluation } from './types';

export function evaluateEligibility(opportunity: Opportunity, profile: UserProfile): EligibilityResult {
  const ruleResults: RuleEvaluation[] = opportunity.rules.map(rule => evaluateRule(rule, profile));

  const hasFail = ruleResults.some(r => r.status === 'fail');
  const hasUnknown = ruleResults.some(r => r.status === 'unknown');

  let overallStatus: 'eligible' | 'not_eligible' | 'unknown' = 'eligible';
  if (hasFail) {
    overallStatus = 'not_eligible';
  } else if (hasUnknown) {
    overallStatus = 'unknown';
  }

  return {
    status: overallStatus,
    ruleResults
  };
}

function evaluateRule(rule: OpportunityRule, profile: UserProfile): RuleEvaluation {
  switch (rule.type) {
    case 'min_cgpa': {
      if (profile.cgpa === null) return { rule, status: 'unknown', reason: `Requires CGPA data (min ${rule.value}).` };
      const pass = profile.cgpa >= rule.value;
      return {
        rule,
        status: pass ? 'pass' : 'fail',
        reason: pass ? `CGPA ${profile.cgpa} meets minimum ${rule.value}.` : `CGPA ${profile.cgpa} is below minimum ${rule.value}.`
      };
    }
    case 'min_10th': {
      if (profile.percent_10th === null) return { rule, status: 'unknown', reason: `Requires 10th percentage (min ${rule.value}%).` };
      const pass = profile.percent_10th >= rule.value;
      return {
        rule,
        status: pass ? 'pass' : 'fail',
        reason: pass ? `10th % ${profile.percent_10th} meets minimum ${rule.value}%.` : `10th % ${profile.percent_10th} is below minimum ${rule.value}%.`
      };
    }
    case 'min_12th': {
      if (profile.percent_12th === null) return { rule, status: 'unknown', reason: `Requires 12th/Diploma percentage (min ${rule.value}%).` };
      const pass = profile.percent_12th >= rule.value;
      return {
        rule,
        status: pass ? 'pass' : 'fail',
        reason: pass ? `12th % ${profile.percent_12th} meets minimum ${rule.value}%.` : `12th % ${profile.percent_12th} is below minimum ${rule.value}%.`
      };
    }
    case 'max_backlogs': {
      if (profile.active_backlogs === null) return { rule, status: 'unknown', reason: `Requires active backlogs count (max ${rule.value}).` };
      const pass = profile.active_backlogs <= rule.value;
      return {
        rule,
        status: pass ? 'pass' : 'fail',
        reason: pass ? `Active backlogs (${profile.active_backlogs}) is within allowed maximum (${rule.value}).` : `Active backlogs (${profile.active_backlogs}) exceeds maximum allowed (${rule.value}).`
      };
    }
    case 'max_gap_years': {
      if (profile.gap_years === null) return { rule, status: 'unknown', reason: `Requires gap years count (max ${rule.value}).` };
      const pass = profile.gap_years <= rule.value;
      return {
        rule,
        status: pass ? 'pass' : 'fail',
        reason: pass ? `Gap years (${profile.gap_years}) is within allowed maximum (${rule.value}).` : `Gap years (${profile.gap_years}) exceeds maximum allowed (${rule.value}).`
      };
    }
    case 'allowed_branches': {
      if (!profile.branch) return { rule, status: 'unknown', reason: `Requires branch selection. Allowed: ${rule.value.join(', ')}.` };
      const pass = rule.value.includes(profile.branch);
      return {
        rule,
        status: pass ? 'pass' : 'fail',
        reason: pass ? `Branch ${profile.branch} is eligible.` : `Branch ${profile.branch} is not eligible. Allowed: ${rule.value.join(', ')}.`
      };
    }
    case 'allowed_grad_years': {
      if (profile.grad_year === null) return { rule, status: 'unknown', reason: `Requires graduation year. Allowed: ${rule.value.join(', ')}.` };
      const pass = rule.value.includes(profile.grad_year);
      return {
        rule,
        status: pass ? 'pass' : 'fail',
        reason: pass ? `Graduation year ${profile.grad_year} is eligible.` : `Graduation year ${profile.grad_year} is not eligible. Allowed: ${rule.value.join(', ')}.`
      };
    }
    case 'citizenship': {
      if (!profile.citizenship) return { rule, status: 'unknown', reason: `Requires citizenship status. Allowed: ${rule.value.join(', ')}.` };
      const pass = rule.value.includes(profile.citizenship);
      return {
        rule,
        status: pass ? 'pass' : 'fail',
        reason: pass ? `Citizenship ${profile.citizenship} is eligible.` : `Citizenship ${profile.citizenship} is not eligible. Allowed: ${rule.value.join(', ')}.`
      };
    }
    case 'gender': {
      if (!profile.gender) return { rule, status: 'unknown', reason: `Requires gender for diversity drive. Allowed: ${rule.value.join(', ')}.` };
      const pass = rule.value.includes(profile.gender);
      return {
        rule,
        status: pass ? 'pass' : 'fail',
        reason: pass ? `Eligible for this diversity drive.` : `This opportunity is restricted to: ${rule.value.join(', ')}.`
      };
    }
    default:
      return { rule, status: 'unknown', reason: `Unknown rule type.` };
  }
}
