# Open source verification log

Checked on 2026-09-21. Quotes below are from official program or organisation pages.

## `gsoc`

- Criteria: [Google Summer of Code 2026 Program Rules](https://summerofcode.withgoogle.com/rules)
- Deadline: [2026 program timeline](https://summerofcode.withgoogle.com/programs/2026)
- Student status: "be a student or a beginner to open source software development." This is an either/or rule, so `requires_student` is false.
- Citizenship: the rules require a contributor to "be eligible to work in the country in which they reside during the duration of the Program." They separately exclude a person who is "a resident of a United States embargoed country" or who "ordinarily reside[s] in a United States embargoed country." This is residence and legal participation, not Indian citizenship, so `citizenship` is `any`.
- Gender and branch: the contributor eligibility section states no gender, degree, or discipline restriction, so `gender` and `branches` are `any`.
- Deadline: "March 31, 2026 2:00 PM Proposal Deadline."
- Other caveats: "be eighteen (18) years of age or older upon registration for the Program." Prior participation limits and legal exclusions remain important but cannot be represented by the current rule fields.
- Doubt: none about the represented rules or deadline.

## `lfx-mentorship`

- Criteria: [Am I Eligible to Become a Mentee?](https://docs.linuxfoundation.org/lfx/mentorship/mentee-guide/am-i-eligible)
- Timing: [Program Schedule & Timelines](https://docs.linuxfoundation.org/lfx/mentorship/mentorship-program-timelines)
- Student status: the eligibility list applies to "all mentee applicants" and does not require enrollment, so `requires_student` is false.
- Citizenship: "Be eligible to work in the country and jurisdiction where you will be participating in the Mentorship program." It also says, "Not reside in a country or jurisdiction where participation in the mentorship is prohibited under applicable U.S. federal, state or local laws or the laws of other countries." This is not a nationality limit, so `citizenship` is `any`.
- Gender and branch: the common eligibility list states no gender or branch restriction, so both are `any`.
- Deadline: no single date is published for all projects. The timeline says, "Mentee applications open on LFX: approximately 4 weeks" for each standard term and warns that dates may vary by project.
- Other caveats: "Be at least 18 years old by the time the mentorship program starts." Applicants must also "Meet all criteria set by the program to which a mentees is applying, i.e. any custom prerequisites and requirements."
- Doubt: `needs_check` because every project may add prerequisites and an exact deadline. Re-check the chosen listing on the LFX portal.

## `mlh-fellowship`

- Criteria and deadline: [MLH Fellowship application](https://fellowship.mlh.io/apply)
- Student status: the form says applicants must meet the listed qualifications and does not list current enrollment, so `requires_student` is false.
- Citizenship: "Residency: I do not reside in a country embargoed by the United States." This is a residence exclusion, not a citizenship requirement, so `citizenship` is `any`.
- Gender and branch: the qualification list has no gender or academic discipline restriction, so both are `any`.
- Deadline: "Deadline for Applicants from all regions: August 31, 2026."
- Other caveats: "Age: I am over the age of 18." "Time Commitment: I am able to commit at least 20 hours per week to the program." "Coding Experience: I can code proficiently in at least one programming language." "Event Attendance: I have participated in at least one MLH Hackathon or Global Hack Week event."
- Doubt: none about the represented rules or deadline.

## `outreachy`

- Criteria: [Outreachy Eligibility Rules](https://www.outreachy.org/apply/eligibility/)
- Deadline: [Outreachy May 2026 internship cohort](https://www.outreachy.org/outreachy-may-2026-internship-cohort)
- Student status: "Both students and people who are not students are welcome to apply to Outreachy." Therefore `requires_student` is false.
- Citizenship: "Outreachy is open to applicants around the world." Therefore `citizenship` is `any`.
- Gender: "There is no list of groups that are eligible or ineligible for Outreachy." The page welcomes women, trans men, non-binary people, genderqueer people, and other people facing underrepresentation, systemic bias, or discrimination. It is not women-only, so `gender` is `any`.
- Branch: the general eligibility rules do not impose an academic branch restriction, so `branches` is `any`.
- Deadline: "Feb. 13, 2026 at 4pm UTC | Initial application deadline."
- Indian student timing: "Students in India are considered to be in the northern hemisphere, regardless of where their university is located." The page says Northern Hemisphere university students "will only be eligible for the May to August internship cohort."
- Other caveats: "You must be 18 years of age or older by Dec. 7, 2026." "You must be available for a full-time internship. Outreachy interns work 30 hours per week." The displayed age date belongs to the current December cohort; the record uses the last May cohort deadline because that is the cohort Indian university students can enter. Prior Outreachy, Outreach Program for Women, and GSoC interns are excluded.
- Doubt: none about the represented fields. Applicants should still complete Outreachy's identity and schedule eligibility questionnaire.

## `summer-of-bitcoin`

- Criteria: [Am I eligible?](https://guide.summerofbitcoin.org/about/am-i-eligible)
- Deadline: [How Summer of Bitcoin works](https://www.summerofbitcoin.org/how-it-works)
- Student status: "You're a student enrolled in a university or high school program." Therefore `requires_student` is true.
- Citizenship, gender, and branch: the eligibility list states no nationality, gender, degree, or academic discipline restriction, so `citizenship`, `gender`, and `branches` are `any`.
- Deadline: "The last date to apply is February 15, 2026, by 23:59 UTC."
- Other caveats: "You have a strong programming or design skill and experience with open-source development." "You are available to work during the summer full-time." The page explains that the internship lasts 12 weeks and applicants should have no major competing commitment.
- Doubt: none about the represented rules or deadline.

## `fossee-summer-fellowship`

- Criteria and timing: [FOSSEE Internships](https://fossee.in/node/82)
- Current-cycle page: [FOSSEE Summer Fellowship 2026](https://fossee.in/fellowship/2026)
- Student status: "These internships are open to students from any college, pursuing any degree, and at any stage of their undergraduate or postgraduate studies." Therefore `requires_student` is true and `grad_years` is null because no specific year is named.
- Citizenship: the page says opportunities are for "students from across the country" but does not state an Indian citizenship requirement. `citizenship` is therefore `any`; a reviewer should not infer citizenship from location wording.
- Gender and branch: "any college, pursuing any degree" supports `branches: 'any'`, and no gender restriction is stated.
- Deadline: no exact next-cycle deadline is announced. The schedule says, "FOSSEE Summer Fellowship | Registrations opens in March | Fellowship starts in May." The deadline is therefore `tbd`.
- Other caveats: "Students interested in applying for this fellowship must first learn a Free/Libre and Open Source Software (FLOSS) and complete a set of screening tasks." "Kindly note that the FOSSEE Project will not be able to provide the honorarium for the Internships/Fellowship."
- Doubt: `needs_check` because the next cycle and exact closing date are not published. Re-check the fellowship page when March registration opens.

## `hacktoberfest`

- Criteria and timing: [Hacktoberfest 2026 FAQ](https://hacktoberfest.com/questions)
- Student status, gender, citizenship, and branch: "Anyone aged 13 and older worldwide is welcome to participate, subject to U.S. export controls and embargo restrictions." This supports `requires_student: false`, `gender: 'any'`, `citizenship: 'any'`, and `branches: 'any'`.
- Deadline: the page says, "Hacktoberfest is a global celebration of open source that runs throughout October." It provides no single attendee deadline. The 2026 format uses individual in-person and online events, so the record uses `tbd`.
- Other caveats: 2026 differs from the earlier pull-request challenge. The FAQ says it features "300+ in-person and online community events worldwide focused on hands-on building, experimentation, and learning with open-source AI and open-weight models."
- Doubt: `needs_check` because each event has its own registration timing and the official FAQ does not publish one program-wide participant deadline. Check the selected event listing.

## `season-of-kde`

- Criteria and deadline: [Season of KDE enrollment site](https://season.kde.org/)
- Additional criteria context: [Season of KDE About](https://community.kde.org/SoK/About)
- Student status: "Focused on offering an opportunity to anyone (not just enrolled students) contributing to the KDE community." Therefore `requires_student` is false.
- Citizenship, gender, and branch: "SoK offers everyone an opportunity to participate in both code and non-code projects which benefit the KDE ecosystem." No nationality or gender restriction is stated, so `citizenship`, `gender`, and `branches` are `any`.
- Deadline: "Deadline for the contributors applications" followed by "2026-01-14."
- Other caveats: "As it is a KDE internal event, the rules are not fixed and may vary each season." Applicants are encouraged to contact the community and discuss a proposal before applications.
- Doubt: none about the represented rules or 2026 deadline.

## Programs reviewed but excluded

- GirlScript Summer of Code: the official 2026 site returned a service-paused page when fetched, so current eligibility and a deadline could not be read from an official page.
- Code for GovTech Dedicated Mentoring Program: the official site describes the annual program, mentorship, projects, and stipend, but it does not publish a current 2026 or 2027 application cycle, eligibility rules, or deadline.