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
- Money (read 2026-09-22 at https://developers.google.com/open-source/gsoc/help/student-stipends): the India row states "$750 | $1500 | $3000" for small, medium, and large projects.
- Fee (read 2026-09-22 at https://summerofcode.withgoogle.com/rules): the rules do not state an application fee, so the fee remains unchecked.
- Apply (read 2026-09-22 at https://summerofcode.withgoogle.com/rules): the rules define a "Project Proposal" as the contributor's proposal for a project.
- Selection (read 2026-09-22 at https://summerofcode.withgoogle.com/programs/2026): "Proposal Ranking Deadline" is followed by "Slot Allocation Deadline."
- Beginner friendly (read 2026-09-22 at https://summerofcode.withgoogle.com/programs/2026): organizations are "eager to teach newcomers to open source."

## `lfx-mentorship`

- Criteria: [Am I Eligible to Become a Mentee?](https://docs.linuxfoundation.org/lfx/mentorship/mentee-guide/am-i-eligible)
- Timing: [Program Schedule & Timelines](https://docs.linuxfoundation.org/lfx/mentorship/mentorship-program-timelines)
- Student status: the eligibility list applies to "all mentee applicants" and does not require enrollment, so `requires_student` is false.
- Citizenship: "Be eligible to work in the country and jurisdiction where you will be participating in the Mentorship program." It also says, "Not reside in a country or jurisdiction where participation in the mentorship is prohibited under applicable U.S. federal, state or local laws or the laws of other countries." This is not a nationality limit, so `citizenship` is `any`.
- Gender and branch: the common eligibility list states no gender or branch restriction, so both are `any`.
- Deadline: no single date is published for all projects. The timeline says, "Mentee applications open on LFX: approximately 4 weeks" for each standard term and warns that dates may vary by project.
- Other caveats: "Be at least 18 years old by the time the mentorship program starts." Applicants must also "Meet all criteria set by the program to which a mentees is applying, i.e. any custom prerequisites and requirements."
- Doubt: `needs_check` because every project may add prerequisites and an exact deadline. Re-check the chosen listing on the LFX portal.
- Money (read 2026-09-22 at https://docs.linuxfoundation.org/lfx/mentorship/mentee-stipends/total-stipend-amount): the page is titled "Total Stipend Amount," says "These amounts apply to mentorship programs starting on or after July 1, 2026," and lists "India" and "1300" under "Amount in USD." The amount is the total stipend for an eligible term, not a monthly amount.
- Fee (read 2026-09-22 at https://docs.linuxfoundation.org/lfx/mentorship/mentee-guide/how-to-apply): the profile and application instructions do not state a fee, so the fee remains unchecked.
- Apply (read 2026-09-22 at https://docs.linuxfoundation.org/lfx/mentorship/mentee-guide/how-to-apply): "Create a Profile" and "Submit Application."
- Selection (read 2026-09-22 at https://docs.linuxfoundation.org/lfx/mentorship/mentee-guide/how-to-apply): "Your application will be reviewed, and the program admin will contact you with the next steps."
- Beginner friendly (read 2026-09-22 at https://docs.linuxfoundation.org/lfx/mentorship/mentee-guide/am-i-eligible): the common eligibility page does not say beginners or first-timers are welcome, so this remains null.

Re-checked 2026-09-22 at https://lfx.linuxfoundation.org/tools/mentorship/ and the LFX mentee eligibility guide (https://docs.linuxfoundation.org/lfx/mentorship/mentee-guide/am-i-eligible).
- Eligibility quoted: “be at least 18 years old”, “not have been previously accepted as an LF mentee”, must be “eligible to work in the jurisdiction where you reside”, apply as an individual, and “Meet all criteria set by the program” including any custom prerequisites.
- Keyword scan (%, CGPA, GPA, aggregate, marks, backlog, arrear, gap): no hits. All academic rules stay null and the record is now `verified`; per-project prerequisites remain a caveat in notes.

## `mlh-fellowship`

- Criteria and deadline: [MLH Fellowship application](https://fellowship.mlh.io/apply)
- Student status: the form says applicants must meet the listed qualifications and does not list current enrollment, so `requires_student` is false.
- Citizenship: "Residency: I do not reside in a country embargoed by the United States." This is a residence exclusion, not a citizenship requirement, so `citizenship` is `any`.
- Gender and branch: the qualification list has no gender or academic discipline restriction, so both are `any`.
- Deadline: "Deadline for Applicants from all regions: August 31, 2026."
- Other caveats: "Age: I am over the age of 18." "Time Commitment: I am able to commit at least 20 hours per week to the program." "Coding Experience: I can code proficiently in at least one programming language." "Event Attendance: I have participated in at least one MLH Hackathon or Global Hack Week event."
- Doubt: none about the represented rules or deadline.
- Money (read 2026-09-22 at https://fellowship.mlh.io/): "We offer fellows an educational stipend to help offset expenses while they participate in the program." The page gives no figure, so `amount_status` is `not_stated`.
- Fee (read 2026-09-22 at https://fellowship.mlh.io/apply): the application form does not state a fee or show a payment step in the fetched form, so the fee remains unchecked.
- Apply (read 2026-09-22 at https://fellowship.mlh.io/apply): "You must share at least one of the listed items with us to submit an application," referring to a resume, GitHub, LinkedIn, or portfolio, and the form also requires coding proficiency and MLH event attendance.
- Selection (read 2026-09-22 at https://fellowship.mlh.io/apply): the page does not say how MLH chooses among eligible applicants, so this remains null.
- Beginner friendly (read 2026-09-22 at https://fellowship.mlh.io/apply): "I can code proficiently in at least one programming language." This requires prior skill, so it remains false.

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
- Amount (read 2026-09-22 at https://www.outreachy.org/docs/applicant/): "Interns are paid a stipend of $7,000 USD for the three month internship." The home page repeats "$7,000 USD total internship stipend".
- Fee (read 2026-09-22 at https://www.outreachy.org/docs/applicant/): the applicant guide does not state an application fee, so the fee remains unchecked.
- Apply (read 2026-09-22 at https://www.outreachy.org/docs/applicant/): applicants submit an initial application, then "record a contribution" and "fill out a final application."
- Selection (read 2026-09-22 at https://www.outreachy.org/docs/applicant/): "Outreachy organizers review initial applications and their essays," then "Mentors tell Outreachy organizers which interns they want to select."
- Beginner friendly (read 2026-09-22 at https://www.outreachy.org/docs/applicant/): some projects list "1 - No knowledge required," while most require programming skills, so the program-wide field remains null.

## `summer-of-bitcoin`

- Criteria: [Am I eligible?](https://guide.summerofbitcoin.org/about/am-i-eligible)
- Deadline: [How Summer of Bitcoin works](https://www.summerofbitcoin.org/how-it-works)
- Student status: "You're a student enrolled in a university or high school program." Therefore `requires_student` is true.
- Citizenship, gender, and branch: the eligibility list states no nationality, gender, degree, or academic discipline restriction, so `citizenship`, `gender`, and `branches` are `any`.
- Deadline: "The last date to apply is February 15, 2026, by 23:59 UTC."
- Other caveats: "You have a strong programming or design skill and experience with open-source development." "You are available to work during the summer full-time." The page explains that the internship lasts 12 weeks and applicants should have no major competing commitment.
- Doubt: none about the represented rules or deadline.
- Money (read 2026-09-22 at https://guide.summerofbitcoin.org/about/is-it-a-paid-internship): under "All amounts are in USD," the table lists "India" and "$3000."
- Fee (read 2026-09-22 at https://www.summerofbitcoin.org/apply): the fetched application page does not state a fee, so the fee remains unchecked.
- Apply (read 2026-09-22 at https://www.summerofbitcoin.org/how-it-works): applications include coding or design portfolios, then applicants solve bootcamp challenges and submit a project proposal.
- Selection (read 2026-09-22 at https://www.summerofbitcoin.org/how-it-works): "Candidates will be selected based on the solutions to the bootcamp challenges, quality of their project proposals and proactive contributions to the project they're applying to."
- Beginner friendly (read 2026-09-22 at https://guide.summerofbitcoin.org/about/am-i-eligible): "You have a strong programming or design skill and experience with open-source development." This requires prior experience, so it remains false.

## `fossee-summer-fellowship`

- Criteria and timing: [FOSSEE Internships](https://fossee.in/node/82)
- Current-cycle page: [FOSSEE Summer Fellowship 2026](https://fossee.in/fellowship/2026)
- Student status: "These internships are open to students from any college, pursuing any degree, and at any stage of their undergraduate or postgraduate studies." Therefore `requires_student` is true and `grad_years` is null because no specific year is named.
- Citizenship: the page says opportunities are for "students from across the country" but does not state an Indian citizenship requirement. `citizenship` is therefore `any`; a reviewer should not infer citizenship from location wording.
- Gender and branch: "any college, pursuing any degree" supports `branches: 'any'`, and no gender restriction is stated.
- Deadline: no exact next-cycle deadline is announced. The schedule says, "FOSSEE Summer Fellowship | Registrations opens in March | Fellowship starts in May." The deadline is therefore `tbd`.
- Other caveats: "Students interested in applying for this fellowship must first learn a Free/Libre and Open Source Software (FLOSS) and complete a set of screening tasks." "Kindly note that the FOSSEE Project will not be able to provide the honorarium for the Internships/Fellowship."
- Doubt: `needs_check` because the next cycle and exact closing date are not published. Re-check the fellowship page when March registration opens.
- Money (read 2026-09-22 at https://fossee.in/node/82): "the FOSSEE Project will not be able to provide the honorarium for the Internships/Fellowship." No cash figure is stated, so `amount_status` remains `not_stated`.
- Fee (read 2026-09-22 at https://fossee.in/fellowship/2026): the page does not state an application fee, so the fee remains unchecked.
- Apply (read 2026-09-22 at https://fossee.in/node/82): applicants must "complete a set of screening tasks."
- Selection (read 2026-09-22 at https://fossee.in/node/82): the page describes screening tasks and selection by the FOSSEE team.
- Beginner friendly (read 2026-09-22 at https://fossee.in/node/82): the page does not explicitly welcome beginners or require prior work, so this remains null.

Re-checked 2026-09-22 at https://fossee.in/node/82 (source_url) and https://fossee.in/fellowship/2026.
- Eligibility: “open to students from any college, pursuing any degree, and at any stage of their undergraduate or postgraduate studies. The only criterion for selection is the successful completion of a useful project.”
- Cycle: the 2026 page shows results (page updated 18 September 2026); no 2027 dates are published, so the deadline stays `tbd`.
- Keyword scan (%, CGPA, GPA, aggregate, marks, backlog, arrear, gap): no hits. Rules stay null; record set to `verified`.

## `hacktoberfest`

- Criteria and timing: [Hacktoberfest 2026 FAQ](https://hacktoberfest.com/questions)
- Student status, gender, citizenship, and branch: "Anyone aged 13 and older worldwide is welcome to participate, subject to U.S. export controls and embargo restrictions." This supports `requires_student: false`, `gender: 'any'`, `citizenship: 'any'`, and `branches: 'any'`.
- Deadline: the page says, "Hacktoberfest is a global celebration of open source that runs throughout October." It provides no single attendee deadline. The 2026 format uses individual in-person and online events, so the record uses `tbd`.
- Other caveats: 2026 differs from the earlier pull-request challenge. The FAQ says it features "300+ in-person and online community events worldwide focused on hands-on building, experimentation, and learning with open-source AI and open-weight models."
- Doubt: `needs_check` because each event has its own registration timing and the official FAQ does not publish one program-wide participant deadline. Check the selected event listing.
- Money (read 2026-09-22 at https://hacktoberfest.com/questions): the FAQ mentions possible event prizes and swag but gives no cash figure, so `amount_status` remains `not_stated`.
- Fee (read 2026-09-22 at https://hacktoberfest.com/questions): the FAQ does not state an attendee application fee, so the fee remains unchecked.
- Apply (read 2026-09-22 at https://hacktoberfest.com/questions): events use OrganizerHQ "for attendee registration and day-of check-in."
- Selection (read 2026-09-22 at https://hacktoberfest.com/questions): the page does not describe selection of ordinary attendees, so this remains null.
- Beginner friendly (read 2026-09-22 at https://hacktoberfest.com/questions): the page emphasizes learning but does not explicitly say beginners or first-timers are welcome, so this is null.

Re-checked 2026-09-22 at https://hacktoberfest.com/ and the FAQ (source_url).
- Cycle: “October 2026 · 300+ events In person and online” and “Hacktoberfest 2026: AI belongs to everyone.” Participation is through events run under Major League Hacking and DEV; there is no single registration closing date, so the deadline stays `tbd` with the 2026 window described in `typical_window`.
- Eligibility: the FAQ keeps the age rule already logged (13 years or older with guardian consent under 18). Keyword scan (%, CGPA, GPA, aggregate, marks, backlog, arrear, gap): no hits. Record set to `verified`.

## `season-of-kde`

- Criteria and deadline: [Season of KDE enrollment site](https://season.kde.org/)
- Additional criteria context: [Season of KDE About](https://community.kde.org/SoK/About)
- Student status: "Focused on offering an opportunity to anyone (not just enrolled students) contributing to the KDE community." Therefore `requires_student` is false.
- Citizenship, gender, and branch: "SoK offers everyone an opportunity to participate in both code and non-code projects which benefit the KDE ecosystem." No nationality or gender restriction is stated, so `citizenship`, `gender`, and `branches` are `any`.
- Deadline: "Deadline for the contributors applications" followed by "2026-01-14."
- Other caveats: "As it is a KDE internal event, the rules are not fixed and may vary each season." Applicants are encouraged to contact the community and discuss a proposal before applications.
- Doubt: none about the represented rules or 2026 deadline.
- Money (read 2026-09-22 at https://community.kde.org/SoK/About): the page states "a certificate of completion, plus a t-shirt" and gives no cash figure, so `amount_status` remains `not_stated`.
- Fee (read 2026-09-22 at https://season.kde.org/): the page does not state an application fee, so the fee remains unchecked.
- Apply (read 2026-09-22 at https://community.kde.org/SoK/About): applicants should contact the community and potential mentor, and "work with the teams to develop a proposal."
- Selection (read 2026-09-22 at https://season.kde.org/): "We will mostly go with the people who have contacted us to discuss their proposal and start engaging with the project."
- Beginner friendly (read 2026-09-22 at https://community.kde.org/SoK/About): the page does not explicitly say beginners or first-timers are welcome, so this remains null.

## igalia-coding-experience

- Sources read: https://www.igalia.com/coding-experience and https://www.igalia.com/2026/02/27/Igalia-2026-Coding-Experience-Open-for-Applications.html
- Deadline: "The application period is open through April 3rd, 2026."
- Money: "CE participants receive financial compensation of €7,000 for 450 hours of work time over a period of either 3 or 6 months."
- Fee: not stated, left unchecked.
- Student status: "Applicants to the program can be students enrolled in an official education program ... or can be students in alternative learning itineraries." It is also open to career changers, so `requires_student` is false.
- Citizenship: "Igalia welcomes all applicants regardless of their ... race ... religion ... or any other marginalized identity." No nationality restriction is listed, so `citizenship` is `any`.
- Gender: "Igalia welcomes all applicants regardless of their ... gender," so `gender` is `any`.
- Branch: the program accepts formal or self-taught study and does not impose an academic branch, so `branches` is `any`.
- Beginner friendly: "Are you looking for your first open source experience in a professional environment?" and the program is open to people who "do not have experience working in tech fields."
- Apply: applicants choose one of "Linux Packaging, Graphics, JavaScript DevTools, Multimedia and GStreamer, and Web Standards."
- Selection: the page does not publish selection criteria, so this is null.
- Academic-cutoff keyword check: searched the eligibility and application text for `%`, `CGPA`, `GPA`, `aggregate`, `backlog`, `arrear`, `gap`, and `marks`; none are present.
- Doubt: none about the represented rules.

## ospp

- Sources read: https://docs2026-en.summer.ospp.ac.cn/archives/FAQ and https://docs2026-en.summer.ospp.ac.cn/archives/student-guide
- Deadline: "Open throughout project availability" for student registration and project application.
- Money: "The corresponding pre-tax remuneration upon successful project completion is CNY 3,500 and CNY 5,000" for regular projects, and "CNY 6,000, CNY 8,000 and CNY 10,000" for pioneer projects.
- Fee: not stated, left unchecked.
- Student status: "The event is open to currently enrolled university students aged 18 or older," so `requires_student` is true.
- Citizenship: "International students participating in the event must provide a passport," so international applicants are allowed and `citizenship` is `any`.
- Gender: the student eligibility section states no gender restriction, so `gender` is `any`.
- Branch: "Eligible applicants are enrolled students aged 18 or above, with no restrictions on majors or academic years," so `branches` is `any`.
- Apply: international students provide "a passport, as well as documents such as a student ID, admission letter, or certificate of enrollment" and submit a project application.
- Selection: "Students whose project applications pass the mentor, community, and organizing committee reviews will be considered selected participants."
- Beginner friendly: a beginner-friendly application guide is linked, but the eligibility section does not explicitly welcome beginners or first-timers, so this is null.
- Academic-cutoff keyword check: searched the "Who can participate?" eligibility text for `%`, `CGPA`, `GPA`, `aggregate`, `backlog`, `arrear`, `gap`, and `marks`; none are present. Percentage signs elsewhere on the guide occur in tax calculations, not student eligibility.
- Doubt: none about the represented rules.

## openssf-mentorship

- Sources read: https://openssf.org/podcast/2026/03/17/whats-in-the-soss-podcast-56-s3e8-empowering-new-maintainers-inside-the-openssf-mentorship-program/ and https://docs.linuxfoundation.org/lfx/mentorship/mentee-guide/am-i-eligible
- Card URL check: the OpenSSF page loads with the title "Empowering New Maintainers: OpenSSF Mentorship Program" and describes the paid 2026 cycle.
- Deadline: "Applications Close: April 12, 2026."
- Money: the OpenSSF page calls it an "upcoming paid mentorship cycle" but gives no amount. It states "Mentorship Period: June 1 – August 21, 2026." The current LFX amount page says, "These amounts apply to mentorship programs starting on or after July 1, 2026," so its India figure does not support this June 1 cycle. The amount is therefore `not_stated`.
- Fee: not stated, left unchecked.
- Student status: the common LFX eligibility rules apply to "all mentee applicants" and do not require current enrollment, so `requires_student` is false.
- Citizenship: LFX requires applicants to "Be eligible to work in the country and jurisdiction where you will be participating," which is not a citizenship limit, so `citizenship` is `any`.
- Gender: the eligibility page states no gender restriction, so `gender` is `any`.
- Branch: the eligibility page states no degree or discipline restriction, so `branches` is `any`.
- Beginner friendly: the OpenSSF page calls the program a route for a "mentee looking to break into open source" and discusses "the barrier to entry for security beginners."
- Apply: applications route through https://mentorship.lfx.linuxfoundation.org/. The LFX guide says "Create a Profile" and "Submit Application."
- Selection: the OpenSSF cycle lists "Selection Period: April 13 – April 30, 2026."
- Academic-cutoff keyword check: searched the OpenSSF cycle description and common LFX eligibility text for `%`, `CGPA`, `GPA`, `aggregate`, `backlog`, `arrear`, `gap`, and `marks`; none are present.
- Doubt: none about the represented common rules; individual projects may still list technical prerequisites.

## open-mainframe-mentorship

- Sources read: https://openmainframeproject.org/community/mentorship-program and https://openmainframeproject.org/blog/open-mainframe-projects-summer-2026-mentorship-program
- Card URL check: the foundation page loads with the title "Mentorship Program - Open Mainframe Project" and says, "The Open Mainframe Project funds mentees to complete projects during the LFX Mentorship terms."
- Deadline: "The deadline to submit applications is Friday, May 15."
- Money: the program "provides a stipend for selected mentees" but gives no amount. The 2026 announcement says, "The term runs June 1 through August 31." The current LFX amount page says, "These amounts apply to mentorship programs starting on or after July 1, 2026," so its India figure does not support this June 1 term. The amount is therefore `not_stated`.
- Fee: not stated, left unchecked.
- Student status: the mentorship appears under "For Higher Education Students," and the 2026 call says, "If you're a student ready to work on real problems," so `requires_student` is true.
- Citizenship: the linked common LFX eligibility page does not impose nationality, so `citizenship` is `any`.
- Gender: the program page states no gender restriction, so `gender` is `any`.
- Branch: the program page states no academic branch restriction, so `branches` is `any`.
- Apply: each 2026 mentorship links to its application on https://mentorship.lfx.linuxfoundation.org/.
- Selection: "Mentee application review and acceptance" occurs "during the 2 weeks before the term begins."
- Beginner friendly: a 2026 participant post says "From Zero Mainframe Experience," but the eligibility page does not explicitly welcome all beginners, so this is null.
- Academic-cutoff keyword check: searched the program page and 2026 announcement eligibility text for `%`, `CGPA`, `GPA`, `aggregate`, `backlog`, `arrear`, `gap`, and `marks`; none are present.
- Doubt: none about the represented rules.

## lf-decentralized-trust-mentorship

- Sources read: https://lf-decentralized-trust-mentorships.github.io/mentorship-program/latest/ and https://docs.linuxfoundation.org/lfx/mentorship/mentee-stipends/total-stipend-amount
- Card URL check: the foundation's official GitHub Pages site loads with the heading "LF Decentralized Trust Mentorship Program" and calls it "a structured remote learning opportunity."
- Deadline: "31 Mar 2026 - 11 May 2026 ... mentee application period on LFX Mentorship."
- Money: "Eligible mentees may receive a stipend, calculated using a tiered structured based on their country of residence during the program." The page says "15 Jun 2026 - 30 Nov 2026" for the working period and does not state the amount. The current LFX amount page applies only to programs starting on or after July 1, 2026, so its India figure does not support this June 15 program. The amount is therefore `not_stated`.
- Fee: not stated, left unchecked.
- Student status: the program is for "aspiring decentralized tech developers, researchers, and other contributors," with no enrollment requirement, so `requires_student` is false.
- Citizenship: participants collaborate "from their preferred locations," and no nationality requirement is stated, so `citizenship` is `any`.
- Gender: the program description states no gender restriction, so `gender` is `any`.
- Branch: the program description states no academic discipline restriction, so `branches` is `any`.
- Apply: applicants use https://mentorship.lfx.linuxfoundation.org/ and must choose a project; unpaid listings are explicitly identified.
- Selection: the schedule lists "mentee application review and applicant interview."
- Beginner friendly: the page says "introducing new talent" but does not explicitly welcome beginners or first-timers, so this is null.
- Academic-cutoff keyword check: searched the program description and mentee-applicant eligibility text for `%`, `CGPA`, `GPA`, `aggregate`, `backlog`, `arrear`, `gap`, and `marks`; none are present.
- Doubt: applicants must confirm that a selected project is not labeled unpaid.

## cncf-lfx-mentorship

- Sources read: https://github.com/cncf/mentoring/tree/main/programs/lfx-mentorship/2026/03-Sep-Nov and https://github.com/cncf/mentoring/blob/main/programs/lfx-mentorship/README.md
- Card URL check: the official CNCF repository loads with the heading "LFX Mentorship by The Linux Foundation" and says it "is actively used by the Cloud Native Computing Foundation as a mentorship platform across the CNCF projects."
- Deadline: "Mentee Applications Open | Mon, Aug 3, 00:00 UTC – Tue, Aug 18, 23:59 UTC."
- Money: the term runs September to November 2026. The LFX page is titled "Total Stipend Amount," says "These amounts apply to mentorship programs starting on or after July 1, 2026," and lists "India" and "1300" under "Amount in USD." The USD 1,300 is the total stipend for the term, not a monthly amount.
- Fee: not stated, left unchecked.
- Student status: the linked LFX eligibility criteria do not require enrollment, so `requires_student` is false.
- Citizenship: LFX requires legal participation where the mentee works but does not require a particular nationality, so `citizenship` is `any`.
- Gender: the eligibility criteria state no gender restriction, so `gender` is `any`.
- Branch: the common eligibility criteria state no academic branch restriction, so `branches` is `any`.
- Apply: "you'll have to apply as a mentee on the LFX Mentorship website" at https://mentorship.lfx.linuxfoundation.org/, with prerequisites varying by project.
- Selection: "Mentors are responsible for selecting and matching mentees to their projects" and must choose "who is the best fit for the project."
- Beginner friendly: the common page does not explicitly welcome beginners for every CNCF project, so this is null.
- Academic-cutoff keyword check: searched the common eligibility text and Term 3 project page for `%`, `CGPA`, `GPA`, `aggregate`, `backlog`, `arrear`, `gap`, and `marks`. No academic cutoff is present. The term page uses `>80% coverage` for software tests and uses "gap" and "backlog" in technical project descriptions, not student eligibility.
- Doubt: `needs_check` because each project can add prerequisites and the term page does not state that every listed project pays a stipend.

Re-checked 2026-09-22 at https://github.com/cncf/mentoring (source_url). Program terms defer to the LFX mentee eligibility rules quoted under lfx-mentorship.
- Keyword scan (%, CGPA, GPA, aggregate, marks, backlog, arrear, gap): no hits. Rules stay null, record set to `verified`; project-level prerequisites stay in notes.

## Programs reviewed but excluded

- GirlScript Summer of Code: the official 2026 site returned a service-paused page when fetched, so current eligibility and a deadline could not be read from an official page.
- Code for GovTech Dedicated Mentoring Program: the official site describes the annual program, mentorship, projects, and stipend, but it does not publish a current 2026 or 2027 application cycle, eligibility rules, or deadline.

## Reviewed and dropped

- Google Season of Docs: the official Google page says the program supported 2019-2024 and now funds organizations rather than accepting student technical writers.
- Julia Seasons of Contributions: the official page is an umbrella for GSoC and Season of Docs, not a distinct paid student program with its own current stipend.
- X.Org Endless Vacation of Code: the official page says the project is being sunset and no applications are accepted.
- Google Summer of Earth Engine: the official rules and application are for 2019, with no current cycle.
- Quansight Labs internships: the official 2026 cohort page confirms the program and Indian interns but publishes no pay figure, so the money cannot be traced.
- Rust Foundation Fellowship: the current grants page no longer publishes fellowship eligibility or an application; the amount and eligibility page found was from 2023.
- Processing Foundation Fellowship: the official page says there will be no fellowship in 2026.
- Processing Foundation Open Source Software Microgrants: the official 2026 grantee page states $500 but does not publish who could apply or a current application route.
- Zulip internships: Zulip's official page describes participation through GSoC and Outreachy rather than a separate paid internship.
- GNOME Foundation internships: official opportunities route applicants through Outreachy or GSoC, so there is no distinct paid record.
- Linux Kernel Mentorship Program: current LFX listings label the 2026 kernel mentorship terms unpaid.
