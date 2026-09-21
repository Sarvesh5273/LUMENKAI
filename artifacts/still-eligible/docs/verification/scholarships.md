# Abroad scholarships verification log

Checked on 2026-09-21. Quotes below are from official programme or organisation pages.

## `mext-undergraduate`

- Criteria and deadline: https://www.in.emb-japan.go.jp/education/Undergraduate_Student.html
- General guidelines linked by the Embassy: https://www.studyinjapan.go.jp/en/_mt/2026/04/2027_Guidelines_Undergraduate_E.pdf
- `min_twelfth_pct: 80`: “If you have completed your Grade 12 in or before 2026, then minimum 80% marks are required.”
- Citizenship `any`: “Applicants must have the nationality of a country that has diplomatic relations with Japan.” The India Embassy page is the application route researched, but the general rule itself is not nationality-exclusive.
- `gender: any`: no gender restriction appears in the official qualifications and conditions.
- `requires_student: false`: “Applicants who have completed 12 years of schooling in countries other than Japan” are eligible, as are applicants who will meet the condition by March 2027.
- `branches: any`: the official page offers social sciences, humanities and several natural science fields. No applicant’s existing BTech branch is required.
- Deadline: “Application deadline: 25 May 2026”.
- Caveat: the Embassy states a conditional Grade 10 rule for applicants awaiting Grade 12 results: “80% marks are required in their Grade 10, along with a provisional document from the current school certifying that the applicant is expected to score more than 80% in their 2027 Grade 12 board examinations.” This is not represented as an unconditional `min_tenth_pct`.

## `chevening`

- India application page and deadline: https://www.chevening.org/scholarship/india/
- Eligibility: https://www.chevening.org/resource-hub/guidance/eligibility/
- Work requirement: https://www.chevening.org/scholarships/who-can-apply/work-experience/
- Citizenship `['IN']`: the official award page is titled “Chevening in India”, and the eligibility page says applicants must “Be a citizen of a Chevening-eligible country or territory.”
- `requires_student: false`: “Hold an undergraduate degree that qualifies you for a UK master’s programme. You must have finished your undergraduate studies at least two years before our application deadline.”
- `gender: any`: “Your gender, age (there is no upper age limit), sexual orientation, religion, marriage or parenthood status, caste, class, or other attributes do not matter to us.”
- Deadline: “Open for applications until 6 October 2026, at 11:00 (UTC)”.
- `min_work_years: 2`: “You must have at least 2800 hours of work experience, acquired after the completion of your undergraduate degree,” gained “over a minimum of two years.” The two years is stated by Chevening itself, so it is entered as the minimum; the hours figure is not converted to anything and stays in notes.

## `fulbright-nehru-masters`

- Criteria and deadline: https://www.usief.org.in/fulbright-fellowships/fellowships-for-indian-citizen/fulbright-nehru-masters-fellowships
- Citizenship `['IN']`: the official page is under “fellowships-for-indian-citizen”, and describes fellows returning to “their communities in India.”
- `min_work_years: 3`: “Must have at least three years' full-time (paid) professional work experience relevant to the proposed field of study by the application deadline.”
- `requires_student: false`: “Must have completed an equivalent of a U.S. bachelor's degree from a recognized Indian university”.
- `gender: any` and `branches: any`: the page states no gender rule. It lists eligible fields of proposed study but does not tie eligibility to the applicant’s BTech branch.
- Deadline: “Application Deadline: May 14, 2025, 23:59:59 hrs (IST)”.
- Doubt: the page still displays the 2026-27 call and old deadline. A newer master’s call needs checking. It also requires “at least 55% marks” in the qualifying degree; this degree percentage is not converted to `min_cgpa`.

## `rhodes-scholarship-india`

- Deadline and application: https://www.rhodeshouse.ox.ac.uk/scholarships/applications/india
- Eligibility: https://www.rhodeshouse.ox.ac.uk/scholarships/applications/india/eligibilitycriteria
- Citizenship `['IN']`: “Are you a citizen of India, holding an Indian passport, or equivalent proof of citizenship? PIO or OCI card holders do not satisfy the Indian citizenship criteria for this purpose.”
- `requires_student: false`: eligible applicants may be “in the final year of, or have completed an undergraduate degree at a university in India.”
- `gender: any` and `branches: any`: the constituency checker states no gender or branch restriction. Academic suitability is assessed against the chosen Oxford course.
- Deadline: “Closing date: 23:59, Indian Standard Time, 23 July 2026”.
- Other important criteria: “Will you have completed an undergraduate degree (normally a Bachelor’s degree) by July 2027” and the page states age routes of 18 to 23, or under 27 with recent degree completion. No doubt about the stored rules or deadline.

## `inlaks-scholarship`

- Criteria: https://inlaksfoundation.org/opportunities/scholarship/
- Official 2026 instructions linked by that page: https://a.storyblok.com/f/288561/x/e88a11a9fd/2026-application-instructions-inlaks-scholarship.pdf
- Citizenship `['IN']`: “The applicant must be an Indian passport holder who is resident in India at the time of application.”
- `requires_student: false`: “The applicant must hold a degree from a recognised university in India. If you are in the final year of graduation and awaiting results, you are eligible to apply.”
- `gender: any`: no gender restriction is stated.
- Deadline: “The last day to submit your application is till 12:00pm (afternoon) on 31st March 2026.”
- Amount (read 2026-09-22 on the same page): “The value depends on the course and covers tuition fees, living expenses, one-way travel, visa costs and health allowance, up to USD 120,000.”
- Doubt: the official degree thresholds differ by subject. The page gives “65%, CGPA 6.8/10, or GPA 2.6/4” for listed humanities-related fields and “70%, CGPA 7.2/10, or GPA 3/4” for listed science-related fields. A single cutoff would misrepresent these alternatives, so `min_cgpa` is null. The official page also limits Engineering and Natural Sciences study to Imperial College London.

## `erasmus-mundus-joint-masters`

- Criteria and timing: https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters
- Citizenship `any`: “Students from all over the world are welcome.”
- `requires_student: false`: applicants may “have a bachelor’s degree (first degree), or be in your last year of bachelor studies”.
- `gender: any` and `branches: any`: the central page gives no gender or branch restriction; each master’s sets its own entry requirements.
- Typical window: “In most cases, you should submit your application between October and January for courses starting the following academic year.”
- Doubt: “Each master's website has all the details about ... the entry requirements and all the steps of the application process.” There is no single exact deadline, so the record is `tbd`; check the selected consortium.

## `kaust-fellowship`

- Entry criteria: https://admissions.kaust.edu.sa/how-to-apply/entry-requirements
- Deadline: https://admissions.kaust.edu.sa/how-to-apply/admission-timelines
- Fellowship: https://www.kaust.edu.sa/study/applying-to-kaust
- Citizenship `any`, `gender: any`: the official entry requirements state no nationality or gender restriction.
- `requires_student: false`: the master’s minimum is a “Bachelors degree in a subject relevant the program being applied to, from a recognized higher education institution”. The page separately permits an applicant who has not yet completed the current degree to submit a recent academic record.
- `branches: any`: relevance is programme-specific and cannot be mapped to one stored BTech branch list.
- Deadline (re-read 2026-09-22 at https://admissions.kaust.edu.sa/how-to-apply/admission-timelines): under “Fall 2027 Admission”, “Fall 2027 admission is open to MS, MS/PhD, and PhD applicants.” with “Round 2 application open | 28 September 2026” and “Round 2 application deadline | 3 January 2027”. Under “Spring 2027 Admission”, “Spring 2027 admission is only open to PhD applicants.” with “Round 1 application deadline | 27 September 2026”. The page notes “These dates are tentative and may change based on application volume.” The record stores the fall round because a BTech student applies for the MS intake, and `typical_window` describes both rounds.
- Doubt: “The minimum permitted GPA is 3.0 on a 4-point scale (or equivalent).” This is not converted to a 10-point `min_cgpa`. The applicant must also confirm the appropriate intake and programme.

## `stipendium-hungaricum`

- Application page: https://stipendiumhungaricum.hu/apply/
- Official 2026-27 call linked there: https://stipendiumhungaricum.hu/wp-content/uploads/2025/10/BA_MA_OTM_Call_for_Applications_2026_27.pdf
- Citizenship `any`: the call’s eligible sending partner list includes many countries, including “Republic of India”.
- `requires_student: false`: the call covers full bachelor’s and master’s degree programmes and does not generally require current enrolment.
- `gender: any`: no gender restriction is stated.
- `branches: any`: “Applicants are eligible to apply only for those scholarship types and study fields that are determined in the educational cooperation programmes in effect between Hungary and the specific Sending Partner.”
- Deadline: “The deadline for submitting the complete application: 15 January 2026, 2 p.m. (Central European Time).”
- Doubt: the call says applications must also be submitted to the responsible sending authority and that each partner may impose different deadlines and requirements. The India-specific authority requirements and the next cycle must be checked.

## Official programmes reviewed but excluded

- MEXT Research Scholarship: excluded because the Embassy of Japan in India research page did not expose current criteria or a deadline in a form that could be verified during this review.
- DAAD Study Scholarships: excluded because no single official India call with one deadline and a sufficiently specific engineering master’s eligibility set was verified.
- Commonwealth Master’s Scholarships: excluded because the current India nominating route and its deadline were not verified from both official sources.
- Global Korea Scholarship graduate track: excluded because a current India-specific official call and deadline were not verified.
- Türkiye Scholarships: excluded because the current cycle’s official criteria and deadline were not fully checked.