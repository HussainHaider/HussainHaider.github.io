/**
 * Every word on the site lives here.
 *
 * Ported from the Claude Design source (design/Hussain Zaidi - Site.dc.html).
 * Components read from these exports and never hardcode copy, so updating a
 * metric or adding a role is a one-line change in one file.
 */

/* ── Identity ────────────────────────────────────────────────────────────── */

export const person = {
  name: 'Syed Hussain Haider Zaidi',
  shortName: 'S. Hussain Haider Zaidi',
  role: 'Full-Stack Engineer · Agentic AI · 6+ years',
  jobTitle: 'Software Engineer',
  employer: 'EF Education First',
  city: 'Budapest',
  country: 'Hungary',
  countryCode: 'HU',
  email: 'hussainhaider490@gmail.com',
  linkedin: 'https://www.linkedin.com/in/hh-zaidi',
  linkedinHandle: '/in/hh-zaidi',
  github: 'https://github.com/HussainHaider',
  githubHandle: 'HussainHaider',
  medium: 'https://medium.com/@HussainZaidi14',
  mediumHandle: '@HussainZaidi14',
  cv: '/Syed-Hussain-Haider-Zaidi-CV.pdf',
} as const;

/* ── Display flags ───────────────────────────────────────────────────────────
   These were editor props in the design (`showAvailability`, `sectionNumbers`,
   `caseDetail`). Kept as switches so the availability badge can be turned off
   without touching markup. */

export const flags = {
  /** The "Open to senior roles & agent builds" badge in the hero. */
  showAvailability: true,
  /** The `01 /`, `02 /` … prefixes on section eyebrows. */
  showSectionNumbers: true,
  /** Full case-study bullet lists vs. headline only. */
  fullCaseDetail: true,
} as const;

/* ── Analytics ───────────────────────────────────────────────────────────────
   Microsoft Clarity: click/scroll heatmaps and session recordings. The project
   ID is not a secret — it ships in the page source of every site using Clarity
   — so it lives here rather than in an env var, and CI needs no extra wiring.

   An empty string disables tracking entirely. Tracking is also skipped on dev
   builds, so this only ever fires on the deployed site. */

export const analytics = {
  /** From clarity.microsoft.com → Settings → Overview. Empty string = off. */
  clarityProjectId: 'xw5wnpvljc',
} as const;

/* ── Navigation ──────────────────────────────────────────────────────────── */

export const navLinks = [
  { href: '#results', label: 'Results' },
  { href: '#services', label: 'What I Do' },
  { href: '#work', label: 'Case Studies' },
  { href: '#stack', label: 'Stack' },
  { href: '#credentials', label: 'Credentials' },
  { href: '#writing', label: 'Writing' },
] as const;

/* ── Hero ────────────────────────────────────────────────────────────────── */

export const hero = {
  availability: 'Open to senior roles & agent builds',
  headline: 'AI agents that survive production.',
  intro:
    'I build multi-agent AI systems in LangGraph and CrewAI — on top of six years of shipping React, Next.js and Django platforms that carry real traffic, real money and 99.9% uptime targets. Most AI demos die on contact with production. Mine are engineered by someone who has spent a career keeping systems up.',
  facts: [
    { label: 'Now', value: 'Software Engineer, EF Education First — Budapest' },
    { label: 'Based', value: 'Budapest, Hungary — remote friendly, EU work rights' },
    { label: 'Depth', value: 'Python / Django + React / Next.js + AWS serverless' },
  ],
} as const;

/* ── 01 · Results ────────────────────────────────────────────────────────── */

export type Result = {
  /** The metric itself, e.g. "95%". */
  figure: string;
  /** Small trailing unit rendered at 0.45em, e.g. "ms". */
  unit?: string;
  label: string;
  detail: string;
};

export const results: Result[] = [
  {
    figure: '95%',
    label: 'Downtime eliminated',
    detail: 'Diagnosed ISR cache invalidation across Cloudflare + Next.js · EF',
  },
  {
    figure: '45%',
    label: 'Faster page loads',
    detail: 'ISR → SSG migration deployed to S3 · EF',
  },
  {
    figure: '40%',
    label: 'Lower TTFB',
    detail: 'Static delivery + GitHub Actions CI/CD · EF',
  },
  {
    figure: '3×',
    label: 'Deploys per day',
    detail: 'Unblocked release cadence at 99.9% uptime · EF',
  },
  {
    figure: '120',
    unit: 'ms',
    label: 'Patient-data retrieval',
    detail: 'Django ORM + PostgreSQL indexing, Q-object search · SARC MedIQ',
  },
  {
    figure: '2.5×',
    label: 'Dashboard responsiveness',
    detail: 'Query optimisation on a diagnostic platform · SARC MedIQ',
  },
  {
    figure: '90%',
    label: 'Cut from initial load',
    detail: 'Virtualisation + memoisation, re-renders under 50ms · xiQ',
  },
  {
    figure: '40%',
    label: 'Fewer post-release bugs',
    detail: 'Jest + RTL test culture and QA process · Carte Blanche',
  },
];

export const resultsSection = {
  eyebrow: 'The receipts',
  heading: 'Numbers I have actually moved',
  note: 'Every figure below is tied to shipped work at a named employer. Ask me about any of them.',
} as const;

/* ── 02 · Services ───────────────────────────────────────────────────────── */

export type Service = {
  key: string;
  title: string;
  summary: string;
  points: string[];
  proof: { lead: string; strong: string; tail: string };
};

export const services: Service[] = [
  {
    key: 'A',
    title: 'Agentic AI systems',
    summary:
      'Multi-agent workflows that do real analytical work — research, monitoring, summarisation, risk scoring — with tracing and evaluation wired in from day one, not bolted on after the demo.',
    points: [
      'LangChain / LangGraph orchestration, CrewAI crews',
      'LangSmith tracing, evals and cost visibility',
      'Tool-calling, retrieval and structured JSON contracts',
      'Deployed on AWS Lambda / serverless, not a notebook',
    ],
    proof: {
      lead: 'Proven in ',
      strong: 'MarketMind AI',
      tail: ' — a multi-agent investment research assistant.',
    },
  },
  {
    key: 'B',
    title: 'Performance & reliability rescue',
    summary:
      'You have a platform that is slow, flaky, or quietly burning cloud spend. I find the actual root cause in the logs, fix the architecture, and leave the numbers measurably better.',
    points: [
      'Rendering strategy audits — ISR, SSG, SSR, caching layers',
      'CloudWatch / SQS pipeline forensics and cost reduction',
      'CI/CD rebuilds with GitHub Actions',
      'Edge hardening: WAF, CloudFront, CAPTCHA middleware',
    ],
    proof: {
      lead: 'Proven at ',
      strong: 'EF Education First',
      tail: ' — 95% less downtime, 45% faster loads.',
    },
  },
  {
    key: 'C',
    title: 'Full-stack product delivery',
    summary:
      'End-to-end feature ownership in data-intensive products: React and Next.js on the front, Django or Node behind it, tests that hold, documentation that survives your next hire.',
    points: [
      'React / Next.js / TypeScript with design-system discipline',
      'Django & Node REST APIs, event-driven microservices',
      'PostgreSQL modelling, indexing and query tuning',
      'Jest, React Testing Library, Cypress from the start',
    ],
    proof: {
      lead: 'Proven across ',
      strong: 'four companies',
      tail: ' and two continents since 2019.',
    },
  },
];

export const servicesSection = {
  eyebrow: 'What you get',
  heading: 'Three ways to put me to work',
} as const;

/* ── 03 · Case studies ───────────────────────────────────────────────────── */

export type Tag = { label: string; tone: 'accent' | 'neutral' };

export type CaseStudy = {
  company: string;
  role: string;
  period: string;
  tags: Tag[];
  headline: string;
  /** Inline <strong> is allowed here — rendered with set:html. */
  points: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    company: 'EF Education First',
    role: 'Software Engineer',
    period: 'Nov 2024 — Present · Budapest',
    tags: [
      { label: 'Next.js', tone: 'accent' },
      { label: 'AWS Lambda', tone: 'accent' },
      { label: 'Storyblok', tone: 'accent' },
      { label: 'Cypress', tone: 'neutral' },
    ],
    headline: "Made EF's global marketing platform fast, cheap and boringly reliable",
    points: [
      'Traced chronic outages to ISR cache invalidation between Cloudflare and Next.js — <strong>95% reduction in downtime</strong> across multiple production sites serving High School Exchange Year, Cultural Care, EF Language and EF Academy.',
      'Migrated ISR → SSG with S3 delivery and an automated GitHub Actions pipeline: <strong>40% lower TTFB, 45% faster loads, 3× more deploys per day</strong>, 99.9% uptime held.',
      'Dug through CloudWatch log groups to find two root causes of a CI/CD bottleneck — unbatched dependency story queuing inflating SQS, and ungrouped SQS-to-Actions dispatch flooding the workflow queue. Batching and queue grouping cut build failures, congestion and AWS spend.',
      'Scaled a student photo-voting campaign under an unexpected traffic surge: AWS WAF, CloudFront with secret origin headers, and custom middleware validating Cloudflare Turnstile tokens — direct API Gateway exposure eliminated.',
      'Designed event-driven microservices on the Architect framework using CQRS-inspired patterns, with documented interface contracts and independent deployability.',
    ],
  },
  {
    company: 'SARC MedIQ',
    role: 'Full Stack Developer',
    period: 'Jan 2023 — Oct 2024 · Remote',
    tags: [
      { label: 'Django', tone: 'accent' },
      { label: 'React', tone: 'accent' },
      { label: 'Cornerstone3D', tone: 'accent' },
      { label: 'PostgreSQL', tone: 'neutral' },
    ],
    headline: 'Gave radiologists back their afternoons',
    points: [
      'Integrated and customised OHIF Viewer inside a React/Django DICOM platform with Cornerstone3D and Web Workers — <strong>30% better radiologist workflow efficiency</strong> on 3D volume visualisation, and 40% faster diagnosis with advanced manipulation and annotation tooling.',
      "Rebuilt the streaming viewer's caching and pre-loading strategy for medical studies: <strong>30% faster image processing</strong>.",
      'Tuned patient-data access in a modular Django architecture with PostgreSQL indexing and multi-attribute Q-object search — <strong>120ms retrieval latency, 2.5× more responsive dashboards</strong>.',
      'Built a rule-driven report templating engine in React and TypeScript with JSON-schema validation and dynamic mapping — <strong>50% faster reporting</strong>, standardised findings across departments.',
      'Introduced Jest and React Testing Library as team standard and mentored engineers on TDD in a high-stakes diagnostic codebase.',
    ],
  },
  {
    company: 'xiQ, Inc.',
    role: 'Senior Frontend Developer',
    period: 'Jul 2022 — Dec 2022 · Lahore',
    tags: [
      { label: 'TypeScript', tone: 'accent' },
      { label: 'React DnD', tone: 'accent' },
      { label: 'Virtualisation', tone: 'neutral' },
    ],
    headline: 'Turned a sluggish marketing tool into a workflow engine',
    points: [
      'Virtualised and memoised heavy list rendering — <strong>90% cut in initial load time</strong>, re-renders under 50ms.',
      'Built a behaviour-triggered nurturing tool for hyper-personalised campaigns using React DnD and a depth-first traversal over the workflow graph — <strong>30% gain in user workflow efficiency</strong>.',
    ],
  },
  {
    company: 'Carte Blanche Innovation',
    role: 'Front-end Developer',
    period: 'Feb 2019 — Aug 2022 · Lahore',
    tags: [
      { label: 'Redux-Saga', tone: 'accent' },
      { label: 'Material UI', tone: 'accent' },
      { label: 'Spring Boot', tone: 'neutral' },
    ],
    headline: 'Built an ATS product and the design system underneath it',
    points: [
      'Led front-end development of HireCinch — a mobile-first, responsive applicant tracking platform in React, Redux and Material UI.',
      'Helped establish a shared component library and design system in React and TypeScript that standardised UI patterns and accelerated every feature after it.',
      'Engineered REST integrations with Redux-Saga for reliable asynchronous state, plus Java Spring Boot APIs on the server side.',
      'Instituted automated testing and QA process — <strong>40% fewer post-release bugs</strong> — and validated product-market fit with user research and Venture Design prototyping before launch.',
    ],
  },
];

export const workSection = {
  eyebrow: 'Case studies',
  heading: 'Six years, four companies, one pattern',
} as const;

/* ── 04 · Stack ──────────────────────────────────────────────────────────── */

export type StackGroup = { title: string; items: string };

export const stackGroups: StackGroup[] = [
  {
    title: 'AI & agents',
    items: 'LangChain · LangGraph · LangSmith · CrewAI · RAG · tool-calling · Cursor · Claude Code',
  },
  {
    title: 'Languages',
    items: 'Python · TypeScript · JavaScript · SQL · HTML5 · CSS3 · Java (basic)',
  },
  {
    title: 'Frontend',
    items: 'React · Next.js · Redux · Redux-Saga · Tailwind CSS · Material UI',
  },
  {
    title: 'Backend & architecture',
    items:
      'Django · Node.js · Architect · REST · GraphQL (basic) · microservices · event-driven · CQRS · MVC',
  },
  {
    title: 'Data',
    items: 'PostgreSQL · ORM query optimisation · indexing · DynamoDB · NoSQL',
  },
  {
    title: 'Cloud & DevOps',
    items:
      'AWS Lambda · S3 · SQS · CloudWatch · CloudFront · WAF · GitHub Actions · Docker · Terraform · Vercel · Cloudflare',
  },
  {
    title: 'Testing',
    items: 'Jest · React Testing Library · Cypress · TDD practice',
  },
  {
    title: 'Ways of working',
    items:
      'Agile sprints · Jira · Confluence · Figma · Storyblok CMS · design systems · stakeholder alignment',
  },
];

export const stackSection = {
  eyebrow: 'Toolset',
  heading: 'The stack, without the padding',
  note: 'Cursor and Claude Code are part of my daily loop — used for leverage, reviewed like any other diff.',
} as const;

/* ── 05 · Credentials ────────────────────────────────────────────────────── */

export const education = [
  {
    degree: 'M.S. Software Project Management',
    school: 'FAST NUCES, Pakistan · 2021—2023 · GPA 3.7',
    detail: 'Software quality assurance, process management & metrics, requirements engineering.',
  },
  {
    degree: 'B.S. Computer Science',
    school: 'FAST NUCES, Pakistan · 2014—2019',
    detail: 'Data science, database systems, object-oriented analysis and design.',
  },
] as const;

export const certifications = [
  'Agentic AI Bootcamp 04',
  'JavaScript Algorithms and Data Structures',
  'Front End Libraries',
  'Running Product Design Sprints',
  'Managing an Agile Team',
] as const;

export const credentialsSection = {
  eyebrow: 'Credentials',
  heading: 'Formally trained, continuously retrained',
  beyondTitle: 'Beyond the code',
  beyondBody:
    'Active member of <strong>Toastmasters International</strong> — I practise the part of engineering that happens in rooms with stakeholders, not editors.',
  languages: 'English, Urdu',
} as const;

/* ── 06 · Writing ────────────────────────────────────────────────────────────
   The posts themselves are not listed here: they are read from the Medium RSS
   feed at build time (see src/lib/medium.ts), so publishing on Medium is the
   only step needed to get a post onto this page. Only the framing copy lives
   here, like every other section. */

export const writingSection = {
  eyebrow: 'Writing',
  heading: 'Notes from the build',
  note: 'Published on Medium — pulled in automatically, newest first.',
  /** Shown when the feed is reachable but empty. */
  empty: 'Nothing published yet. New posts will appear here automatically.',
  cta: 'All posts on Medium',
  /** Most recent posts shown on the page; the rest stay on Medium. */
  limit: 6,
} as const;

/* ── Contact ─────────────────────────────────────────────────────────────── */

export const contact = {
  eyebrow: 'Next step',
  heading: 'Hiring, or need an agent that actually ships?',
  body: 'Send me a message on LinkedIn. Tell me what is slow, broken, or not built yet — I will tell you straight whether I am the right engineer for it.',
} as const;

/* ── SEO ─────────────────────────────────────────────────────────────────── */

export const seo = {
  title: 'Syed Hussain Haider Zaidi — Full-Stack Engineer & Agentic AI',
  description:
    'Full-stack engineer in Budapest building multi-agent AI systems in LangGraph and CrewAI, on six years of React, Next.js and Django platforms held at 99.9% uptime.',
  ogImage: '/og.png',
} as const;
