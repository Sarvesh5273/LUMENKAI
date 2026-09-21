import { Opportunity } from '../lib/types';

/**
 * Startup programs open to students: grants, fellowships and incubators that
 * put money behind a student founder. Credit-only offers (cloud credits,
 * tool discounts) do not belong here.
 *
 * Empty until the dataset expansion adds verified records. The category
 * still exists in the app so the home screen and the "Path from zero" screen
 * can link to it. See docs/verification/startup_programs.md.
 */
export const STARTUP_PROGRAMS: Opportunity[] = [];
