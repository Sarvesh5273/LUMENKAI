# Recruiter verification log

Note: there is no longer a separate recruiter list in the app. The TCS NQT record now lives in `data/company_drives.ts` under the `company_drives` category with its real cutoffs, so the app shows which rule failed. This file keeps the reading notes and the list of recruiters reviewed and left out.

Checked on 2026-09-21. Only official company pages were used. Only TCS NQT publishes its cutoffs on a public official page, so it is the only record kept. It stays `needs_check` because the next drive and its batch list are not announced. The graduation year rule was left empty on purpose: the 2026 drive named the 2024, 2025 and 2026 batches, and the next drive has not named its batches yet.

## tcs-nqt

- URL read: https://www.tcs.com/careers/india/tcs-all-india-nqt-hiring
- Deadline: “A2: The last date to register is **20 March 2026**”
- Graduation years: “TCS All India NQT Hiring is exclusively open to for the Batch of 2024, 2025 and 2026”
- Class 10 and 12: “Candidates should have a minimum aggregate (all subjects to be included for calculation) of 60% or equivalent CGPA in class 10th, 12th, Diploma (if applicable), Graduation and Post-Graduation (if applicable).”
- Active backlogs: “No pending backlog will be permitted at the time of appearing for the TCS selection process.”
- Education gap: “Overall academic gap should not exceed 24 months until highest qualification.”
- Branches: the qualification sentence ends with “in any specialization offered by AICTE/UGC recognized universities/colleges.”
- Student status: the page covers the 2024, 2025 and 2026 batches and says “Candidates with work experience of up to 2 years are eligible to apply,” so current enrollment is not required.
- Gender and citizenship: the page states no restriction. These are represented as `any`, not as a claim of a special entitlement.
- Doubt: graduation also requires 60% or equivalent CGPA, but no 10-point CGPA cutoff is stated. The schema has no degree-percentage field and no maximum-work-experience field. The next deadline and eligible batches are not announced.

## Reviewed and dropped: no public official cutoffs

These companies were checked on 2026-09-21. None of them publishes a fresher cutoff table on a public official page, so a record would have had every rule set to null. In the app that reads as "no cutoff", which is the opposite of the truth for a mass recruiter. Keeping them would have been a silent lie, so they were removed. If you have an official drive notice (a PDF from the company or a campus notice that quotes the company), that counts as an official source: add the record back with the numbers from it.

| Company and role | What the official site showed |
| --- | --- |
| Infosys Systems Engineer | No current India opening, deadline or cutoffs on the official apply page. |
| Infosys Specialist Programmer | HackWithInfy confirms a 2027-batch cohort but is a contest route, not a cutoff table. Belongs with hackathons, not here. |
| Wipro Elite NTH | No active official notice or criteria. |
| Wipro Turbo | No active official notice or criteria. |
| Accenture Associate Software Engineer | Job details sat behind a session-gated portal; academic rules could not be read. |
| Capgemini Exceller | Official recruitment page has no current cycle or cutoffs. |
| Cognizant GenC | Official page says criteria are drive-specific; no active engineering drive listed. |
| HCLTech Graduate Engineer Trainee | Degree eligibility visible, but no marks cutoffs, batches or deadline. |
| LTIMindtree Graduate Engineer Trainee | No readable current official listing. |
| IBM Associate Systems Engineer | Official job URL expired and no longer exposes criteria. |
| DXC Associate Professional | No current India fresher posting or public cutoffs. |

## Programs reviewed but excluded

- Tech Mahindra fresher hiring: the official careers results found were experienced-hire jobs, not a stable India fresher or Graduate Engineer Trainee drive. No official common fresher criteria page was found.
- Deloitte USI Analyst: the official USI search page showed many unrelated analyst and specialist vacancies but no single campus Analyst program with common BTech eligibility. Criteria are posting-specific.

## Retry on 2026-09-22

Official company career searches were checked again. Search results from blogs, college notices and fresher aggregators were ignored.

| Company and role | What the official site showed on 2026-09-22 |
| --- | --- |
| Wipro Elite NTH and Turbo | Wipro Careers and its Early Careers page were live, but no current Elite NTH or Turbo posting with public academic cutoffs was present. |
| Infosys Systems Engineer, Specialist Programmer and Digital Specialist Engineer | Search returned third-party drive pages, but no readable Infosys Careers, InfyTQ or Springboard posting with the claimed cutoffs. |
| Capgemini Exceller | No current official Exceller drive page with eligibility cutoffs and an application deadline was found. |
| Cognizant GenC | No live official India engineering drive page exposing GenC academic cutoffs was found. |
| HCLTech fresher hiring | The official careers material did not expose a current drive with marks, backlog and gap rules. |
| Accenture Associate Software Engineer India | No readable live official listing with common fresher academic cutoffs was found. |
| LTIMindtree GET | No readable current official GET listing with public academic cutoffs was found. |
| Tech Mahindra fresher hiring | Official results did not show a current India fresher drive with published cutoffs. |
| IBM Associate Systems Engineer | No live official India fresher posting with public academic cutoffs was found. |
| DXC Associate Professional | No live official India fresher posting with public academic cutoffs was found. |
| Deloitte India campus | Official results did not expose a single current BTech campus drive with common eligibility cutoffs. |
| Persistent, Mphasis, Hexaware, Virtusa, Zensar, Cyient and NTT Data | Official career pages or job search pages were available, but no common current fresher drive page with public academic cutoffs was found. |