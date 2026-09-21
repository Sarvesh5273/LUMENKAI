import { evaluateEligibility } from '../lib/engine';
import { Opportunity, UserProfile } from '../lib/types';

function assertStrictEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}. Expected '${expected}', got '${actual}'.`);
  }
}

console.log('Running engine tests...');

const profilePass: UserProfile = {
  percent_10th: 85,
  percent_12th: 80,
  cgpa: 7.5,
  active_backlogs: 0,
  gap_years: 1,
  branch: 'Computer Science',
  grad_year: 2025,
  citizenship: 'Indian',
  gender: 'Female',
  student_status: 'Enrolled'
};

const profileFail: UserProfile = {
  ...profilePass,
  cgpa: 6.0,
  active_backlogs: 2,
};

const profileUnknown: UserProfile = {
  ...profilePass,
  cgpa: null,
};

const opp: Opportunity = {
  id: 'test-opp',
  title: 'Test Opportunity',
  company: 'Test Corp',
  category: 'mass_recruiter',
  deadline: null,
  expected_next_cycle: false,
  rules: [
    { type: 'min_cgpa', value: 7.0 },
    { type: 'max_backlogs', value: 1 },
    { type: 'gender', value: ['Female'] },
    { type: 'citizenship', value: ['Indian'] }
  ],
  official_url: 'https://example.com',
  source_url: 'https://example.com',
  last_verified: '2024-01-01',
  tags: [],
  notes: ''
};

try {
  // Test 1: Pass
  const res1 = evaluateEligibility(opp, profilePass);
  assertStrictEqual(res1.status, 'eligible', 'Should be eligible');
  assertStrictEqual(res1.ruleResults.length, 4, 'Should have 4 rule results');
  assertStrictEqual(res1.ruleResults[0].status, 'pass', 'CGPA should pass');

  // Test 2: Fail
  const res2 = evaluateEligibility(opp, profileFail);
  assertStrictEqual(res2.status, 'not_eligible', 'Should be not eligible');
  assertStrictEqual(res2.ruleResults[0].status, 'fail', 'CGPA should fail');
  assertStrictEqual(res2.ruleResults[1].status, 'fail', 'Backlogs should fail');

  // Test 3: Unknown
  const res3 = evaluateEligibility(opp, profileUnknown);
  assertStrictEqual(res3.status, 'unknown', 'Should be unknown');
  assertStrictEqual(res3.ruleResults[0].status, 'unknown', 'CGPA should be unknown');

  // Test 4: Fail overrides Unknown
  const oppWithFail = {
    ...opp,
    rules: [
      { type: 'min_cgpa', value: 7.0 }, // Unknown
      { type: 'max_backlogs', value: 0 } // Fail for profileFail (backlogs: 2)
    ] as any
  };
  const profileMixed = { ...profilePass, cgpa: null, active_backlogs: 2 };
  const res4 = evaluateEligibility(oppWithFail, profileMixed);
  assertStrictEqual(res4.status, 'not_eligible', 'Should be not_eligible if any rule fails, even if some are unknown');

  console.log('All tests passed! [SUCCESS]');
} catch (error) {
  console.error('Test failed:', error);
  process.exit(1);
}
