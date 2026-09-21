import { Opportunity } from '../lib/types';

export const OPPORTUNITIES: Opportunity[] = [
  // --- MASS RECRUITERS (10) ---
  {
    id: 'tcs-ninja-2025',
    title: 'TCS Ninja (Off-Campus)',
    company: 'Tata Consultancy Services',
    category: 'mass_recruiter',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.0 },
      { type: 'min_10th', value: 60 },
      { type: 'min_12th', value: 60 },
      { type: 'max_backlogs', value: 1 },
      { type: 'max_gap_years', value: 2 },
      { type: 'allowed_branches', value: ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil'] },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://www.tcs.com/careers',
    source_url: 'https://www.tcs.com/careers',
    last_verified: '2024-03-01T00:00:00Z',
    tags: ['IT Services', 'Mass Recruiter'],
    notes: 'Verify current cycle dates on official portal.'
  },
  {
    id: 'tcs-digital-2025',
    title: 'TCS Digital (Off-Campus)',
    company: 'Tata Consultancy Services',
    category: 'mass_recruiter',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 7.0 },
      { type: 'min_10th', value: 70 },
      { type: 'min_12th', value: 70 },
      { type: 'max_backlogs', value: 0 },
      { type: 'max_gap_years', value: 1 },
      { type: 'allowed_branches', value: ['Computer Science', 'Information Technology', 'Electronics'] },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://www.tcs.com/careers',
    source_url: 'https://www.tcs.com/careers',
    last_verified: '2024-03-01T00:00:00Z',
    tags: ['Premium Role', 'High Package'],
    notes: 'Higher criteria than Ninja. Requires advanced coding skills.'
  },
  {
    id: 'infosys-system-engineer-2025',
    title: 'Infosys System Engineer',
    company: 'Infosys',
    category: 'mass_recruiter',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.0 },
      { type: 'min_10th', value: 60 },
      { type: 'min_12th', value: 60 },
      { type: 'max_backlogs', value: 0 },
      { type: 'max_gap_years', value: 2 },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://www.infosys.com/careers/graduates.html',
    source_url: 'https://www.infosys.com/careers/graduates.html',
    last_verified: '2024-03-10T00:00:00Z',
    tags: ['IT Services'],
    notes: 'Strict no active backlogs rule at time of application.'
  },
  {
    id: 'wipro-elite-2025',
    title: 'Wipro Elite National Talent Hunt',
    company: 'Wipro',
    category: 'mass_recruiter',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.0 },
      { type: 'min_10th', value: 60 },
      { type: 'min_12th', value: 60 },
      { type: 'max_backlogs', value: 0 },
      { type: 'max_gap_years', value: 3 },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://careers.wipro.com/elite',
    source_url: 'https://careers.wipro.com/elite',
    last_verified: '2024-03-15T00:00:00Z',
    tags: ['NTH', 'Mass Recruiter'],
    notes: 'Max 3 years gap allowed between 10th and graduation.'
  },
  {
    id: 'cognizant-genc-2025',
    title: 'Cognizant GenC',
    company: 'Cognizant',
    category: 'mass_recruiter',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.0 },
      { type: 'min_10th', value: 60 },
      { type: 'min_12th', value: 60 },
      { type: 'max_backlogs', value: 0 },
      { type: 'max_gap_years', value: 2 },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://careers.cognizant.com/global/en/student-and-early-career',
    source_url: 'https://careers.cognizant.com/global/en/student-and-early-career',
    last_verified: '2024-02-28T00:00:00Z',
    tags: ['GenC', 'IT Services'],
    notes: 'Check specific skill tracks if available.'
  },
  {
    id: 'hcl-first-careers',
    title: 'HCL First Careers (Fresher)',
    company: 'HCLTech',
    category: 'mass_recruiter',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.5 },
      { type: 'min_10th', value: 65 },
      { type: 'min_12th', value: 65 },
      { type: 'max_backlogs', value: 0 },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://www.hcltech.com/careers/fresher-engineer',
    source_url: 'https://www.hcltech.com/careers/fresher-engineer',
    last_verified: '2024-04-01T00:00:00Z',
    tags: ['IT Services'],
    notes: 'Usually requires an initial training program.'
  },
  {
    id: 'accenture-ase-2025',
    title: 'Accenture Associate Software Engineer',
    company: 'Accenture',
    category: 'mass_recruiter',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.5 },
      { type: 'max_backlogs', value: 0 },
      { type: 'max_gap_years', value: 1 },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://www.accenture.com/in-en/careers/local/students-graduates',
    source_url: 'https://www.accenture.com/in-en/careers/local/students-graduates',
    last_verified: '2024-04-10T00:00:00Z',
    tags: ['ASE', 'Consulting'],
    notes: 'Max 1 year of gap allowed in education.'
  },
  {
    id: 'capgemini-pats-2025',
    title: 'Capgemini Analyst (PATS)',
    company: 'Capgemini',
    category: 'mass_recruiter',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.0 },
      { type: 'min_10th', value: 60 },
      { type: 'min_12th', value: 60 },
      { type: 'max_backlogs', value: 0 },
      { type: 'max_gap_years', value: 2 },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://www.capgemini.com/in-en/careers/fresher-hiring/',
    source_url: 'https://www.capgemini.com/in-en/careers/fresher-hiring/',
    last_verified: '2024-04-15T00:00:00Z',
    tags: ['Analyst'],
    notes: 'Typically rolling admissions through pooled drives.'
  },
  {
    id: 'ibm-step-up',
    title: 'IBM Associate System Engineer',
    company: 'IBM',
    category: 'mass_recruiter',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.5 },
      { type: 'max_backlogs', value: 0 },
      { type: 'allowed_branches', value: ['Computer Science', 'Information Technology'] },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://www.ibm.com/in-en/employment/entrylevel/',
    source_url: 'https://www.ibm.com/in-en/employment/entrylevel/',
    last_verified: '2024-03-20T00:00:00Z',
    tags: ['Software', 'Systems'],
    notes: 'Focus on CS/IT fundamentals.'
  },
  {
    id: 'tech-mahindra-fresher',
    title: 'Tech Mahindra Fresher Hiring',
    company: 'Tech Mahindra',
    category: 'mass_recruiter',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.0 },
      { type: 'min_10th', value: 60 },
      { type: 'min_12th', value: 60 },
      { type: 'max_backlogs', value: 0 },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://careers.techmahindra.com/',
    source_url: 'https://careers.techmahindra.com/',
    last_verified: '2024-03-25T00:00:00Z',
    tags: ['IT Services'],
    notes: 'Verify registration cycles locally.'
  },

  // --- PRODUCT BASED (5) ---
  {
    id: 'amazon-swe-fresher',
    title: 'Amazon SDE 1 (University Hire)',
    company: 'Amazon',
    category: 'product',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.5 },
      { type: 'allowed_branches', value: ['Computer Science', 'Information Technology', 'Mathematics and Computing'] },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://amazon.jobs/',
    source_url: 'https://amazon.jobs/',
    last_verified: '2024-04-01T00:00:00Z',
    tags: ['SDE', 'FAANG'],
    notes: 'Heavy emphasis on DSA and System Design.'
  },
  {
    id: 'microsoft-associate-swe',
    title: 'Microsoft Associate Software Engineer',
    company: 'Microsoft',
    category: 'product',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 7.0 },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://careers.microsoft.com/students/us/en',
    source_url: 'https://careers.microsoft.com/students/us/en',
    last_verified: '2024-04-05T00:00:00Z',
    tags: ['Product', 'Big Tech'],
    notes: 'CGPA cutoff is usually 7.0 for standard off-campus drives.'
  },
  {
    id: 'cisco-fresher-2025',
    title: 'Cisco Software Engineer (New Grad)',
    company: 'Cisco',
    category: 'product',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 7.0 },
      { type: 'max_backlogs', value: 0 },
      { type: 'allowed_branches', value: ['Computer Science', 'Information Technology', 'Electronics'] },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://jobs.cisco.com/',
    source_url: 'https://jobs.cisco.com/',
    last_verified: '2024-04-10T00:00:00Z',
    tags: ['Networking', 'SWE'],
    notes: 'Strong networking fundamentals preferred.'
  },
  {
    id: 'goldman-sachs-eng',
    title: 'Goldman Sachs Engineering Analyst',
    company: 'Goldman Sachs',
    category: 'product',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 7.0 },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://www.goldmansachs.com/careers/students/programs/india/engineering-campus-hiring-program.html',
    source_url: 'https://www.goldmansachs.com/careers/students/programs/india/engineering-campus-hiring-program.html',
    last_verified: '2024-04-12T00:00:00Z',
    tags: ['FinTech', 'SWE'],
    notes: 'Aptitude and high-speed coding are crucial.'
  },
  {
    id: 'paypal-fresher',
    title: 'PayPal Software Engineer 1',
    company: 'PayPal',
    category: 'product',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 7.0 },
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://careers.paypal.com/us/en/students',
    source_url: 'https://careers.paypal.com/us/en/students',
    last_verified: '2024-04-15T00:00:00Z',
    tags: ['FinTech'],
    notes: 'Often open to all branches with strong CS fundamentals.'
  },

  // --- GOVERNMENT (5) ---
  {
    id: 'gate-2025',
    title: 'GATE 2025 for PSU Recruitment',
    company: 'Various PSUs',
    category: 'government',
    deadline: '2024-10-15T00:00:00Z', // Typical GATE deadline
    expected_next_cycle: false,
    rules: [
      { type: 'citizenship', value: ['Indian'] }
      // No CGPA rule for writing GATE, individual PSUs have rules later
    ],
    official_url: 'https://gate2025.iitr.ac.in/',
    source_url: 'https://gate2025.iitr.ac.in/',
    last_verified: '2024-04-20T00:00:00Z',
    tags: ['PSU', 'GATE', 'Govt'],
    notes: 'Appearing for GATE is the primary requirement.'
  },
  {
    id: 'isro-scientist-2025',
    title: 'ISRO Scientist/Engineer (SC)',
    company: 'ISRO',
    category: 'government',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.84 },
      { type: 'citizenship', value: ['Indian'] },
      { type: 'allowed_branches', value: ['Computer Science', 'Electronics', 'Mechanical'] }
    ],
    official_url: 'https://www.isro.gov.in/Careers.html',
    source_url: 'https://www.isro.gov.in/Careers.html',
    last_verified: '2024-03-01T00:00:00Z',
    tags: ['Govt', 'Research'],
    notes: '6.84 CGPA or 65% minimum strictly enforced.'
  },
  {
    id: 'drdo-scientist',
    title: 'DRDO Scientist \'B\'',
    company: 'DRDO',
    category: 'government',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.0 },
      { type: 'citizenship', value: ['Indian'] }
    ],
    official_url: 'https://drdo.gov.in/drdo/rac',
    source_url: 'https://drdo.gov.in/drdo/rac',
    last_verified: '2024-02-15T00:00:00Z',
    tags: ['Defense', 'Govt'],
    notes: 'Requires GATE score for shortlisting.'
  },
  {
    id: 'barc-oci',
    title: 'BARC OCES/DGFS',
    company: 'Bhabha Atomic Research Centre',
    category: 'government',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.0 },
      { type: 'citizenship', value: ['Indian'] }
    ],
    official_url: 'https://www.barcocesexam.in/',
    source_url: 'https://www.barcocesexam.in/',
    last_verified: '2024-03-25T00:00:00Z',
    tags: ['Research', 'Govt'],
    notes: 'Minimum 60% aggregate in B.Tech.'
  },
  {
    id: 'sscb-cgl-tech',
    title: 'SSC CGL (Tech & Non-Tech)',
    company: 'Staff Selection Commission',
    category: 'government',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'citizenship', value: ['Indian'] }
    ],
    official_url: 'https://ssc.nic.in/',
    source_url: 'https://ssc.nic.in/',
    last_verified: '2024-04-10T00:00:00Z',
    tags: ['Govt', 'Central'],
    notes: 'Open to any graduate. Preparation required.'
  },

  // --- HIGHER ED (5) ---
  {
    id: 'iit-mtech-cs',
    title: 'M.Tech via GATE',
    company: 'IITs / NITs',
    category: 'higher_ed',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.0 } // General eligibility for MTech admissions
    ],
    official_url: 'https://gate2025.iitr.ac.in/',
    source_url: 'https://gate2025.iitr.ac.in/',
    last_verified: '2024-04-10T00:00:00Z',
    tags: ['Masters', 'GATE'],
    notes: '60% or 6.0 CGPA is typically required for admission.'
  },
  {
    id: 'cat-2025',
    title: 'IIM MBA via CAT',
    company: 'IIMs',
    category: 'higher_ed',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 5.0 } // Represents 50% criteria
    ],
    official_url: 'https://iimcat.ac.in/',
    source_url: 'https://iimcat.ac.in/',
    last_verified: '2024-04-10T00:00:00Z',
    tags: ['MBA', 'Management'],
    notes: 'Must hold a bachelor\'s degree with at least 50% marks or equivalent CGPA.'
  },
  {
    id: 'cdac-pg-diploma',
    title: 'CDAC PG Diploma in Advanced Computing',
    company: 'CDAC',
    category: 'higher_ed',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 5.0 }
    ],
    official_url: 'https://www.cdac.in/index.aspx?id=edu_pg_diploma',
    source_url: 'https://www.cdac.in/index.aspx?id=edu_pg_diploma',
    last_verified: '2024-04-15T00:00:00Z',
    tags: ['Diploma', 'Upskilling'],
    notes: 'Requires 50% minimum. Very popular for getting back into IT placement pool.'
  },
  {
    id: 'nptel-certification',
    title: 'NPTEL Online Certifications',
    company: 'NPTEL / IITs',
    category: 'higher_ed',
    deadline: null,
    expected_next_cycle: true,
    rules: [], // Open to all
    official_url: 'https://nptel.ac.in/',
    source_url: 'https://nptel.ac.in/',
    last_verified: '2024-04-01T00:00:00Z',
    tags: ['Certification', 'Skill'],
    notes: 'No strict eligibility. Great for building resume for product companies.'
  },
  {
    id: 'bits-ms-data-science',
    title: 'BITS Pilani WILP M.Tech',
    company: 'BITS Pilani',
    category: 'higher_ed',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'min_cgpa', value: 6.0 }
    ],
    official_url: 'https://bits-pilani-wilp.ac.in/',
    source_url: 'https://bits-pilani-wilp.ac.in/',
    last_verified: '2024-03-20T00:00:00Z',
    tags: ['Working Professionals', 'Masters'],
    notes: 'Some programs require prior work experience, some are open via employer.'
  },

  // --- STARTUPS (5) ---
  {
    id: 'startup-zomato-fresher',
    title: 'Zomato SDE (Campus / Off-Campus)',
    company: 'Zomato',
    category: 'startup',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://www.zomato.com/careers',
    source_url: 'https://www.zomato.com/careers',
    last_verified: '2024-04-10T00:00:00Z',
    tags: ['Startup', 'Unicorn'],
    notes: 'Startups often ignore CGPA if you have excellent open-source or CP profiles.'
  },
  {
    id: 'startup-swiggy',
    title: 'Swiggy APM / SDE',
    company: 'Swiggy',
    category: 'startup',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://careers.swiggy.com/',
    source_url: 'https://careers.swiggy.com/',
    last_verified: '2024-04-05T00:00:00Z',
    tags: ['Startup', 'Unicorn'],
    notes: 'Focus on impactful personal projects.'
  },
  {
    id: 'startup-razorpay',
    title: 'Razorpay Software Engineer',
    company: 'Razorpay',
    category: 'startup',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://razorpay.com/jobs/',
    source_url: 'https://razorpay.com/jobs/',
    last_verified: '2024-03-15T00:00:00Z',
    tags: ['FinTech', 'Startup'],
    notes: 'Strong knowledge of databases and backend required.'
  },
  {
    id: 'startup-zerodha',
    title: 'Zerodha Hackers (Dev)',
    company: 'Zerodha',
    category: 'startup',
    deadline: null,
    expected_next_cycle: true,
    rules: [], // Truly open
    official_url: 'https://zerodha.com/careers',
    source_url: 'https://zerodha.com/careers',
    last_verified: '2024-04-01T00:00:00Z',
    tags: ['Bootstrapped', 'FinTech'],
    notes: 'They famously look at GitHub and passion over college degrees.'
  },
  {
    id: 'startup-cred',
    title: 'CRED Backend Engineer',
    company: 'CRED',
    category: 'startup',
    deadline: null,
    expected_next_cycle: true,
    rules: [
      { type: 'allowed_grad_years', value: [2024, 2025] }
    ],
    official_url: 'https://careers.cred.club/',
    source_url: 'https://careers.cred.club/',
    last_verified: '2024-04-20T00:00:00Z',
    tags: ['Startup', 'High Growth'],
    notes: 'Look out for hackathons hosted by CRED for hiring.'
  }
];
