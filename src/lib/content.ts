/**
 * Single source of truth for every word and number on the site.
 * Keeping copy out of components makes the voice auditable in one pass.
 */

export const BRAND = {
  name: 'KINETIQ',
  tagline: 'The operating system for modern gyms.',
  email: 'hello@kinetiq.fit',
  phone: '+91 80 4718 2200',
  city: 'Bengaluru, India',
} as const

export const NAV = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#resources' },
  { label: 'Contact', href: '#contact' },
] as const

export const SECTION_IDS = NAV.map((n) => n.href.slice(1))

/* ============================================================
   HERO
   ============================================================ */

export const HERO = {
  eyebrow: 'Gym management, rebuilt',
  headline: ['RUN YOUR GYM.', 'LIKE A BUSINESS.'],
  sub:
    'KINETIQ replaces the registers, the reminders and the guesswork. Memberships, payments, attendance, trainers, leads and renewals — one platform that runs the admin so you can run the floor.',
  primaryCta: 'Book a Demo',
  secondaryCta: 'Explore Platform',
  footnote: 'No card required · Live in 48 hours · Free data migration',
} as const

/** Marquee of fictional fitness businesses used as social proof. */
export const CLIENTS = [
  'IRONHAUS',
  'PULSE24',
  'TITAN STRENGTH CO.',
  'FORGE ATHLETIC',
  'APEX FITNESS CLUB',
  'CROSSGRID',
  'THE BARBELL ROOM',
  'VELOCITY WELLNESS',
  'NORTHSIDE STRENGTH',
  'OXYGEN FITNESS',
] as const

export const PROOF_STATS = [
  { value: 2400, suffix: '+', label: 'Gyms & studios running on KINETIQ' },
  { value: 1.8, suffix: 'M', label: 'Members managed every month', precision: 1 },
  { value: 31, suffix: '%', label: 'Average lift in renewal rate' },
  { value: 11, suffix: ' hrs', label: 'Admin hours saved, per week' },
] as const

/* ============================================================
   PRODUCT — sticky scroll chapters
   ============================================================ */

export type ProductChapter = {
  id: string
  index: string
  title: string
  line: string
  body: string
  metrics: { label: string; value: string; delta?: string }[]
}

export const PRODUCT_CHAPTERS: ProductChapter[] = [
  {
    id: 'memberships',
    index: '01',
    title: 'Memberships',
    line: 'Every member, one record.',
    body:
      'Plans, freezes, upgrades, family accounts and personal training packages live on a single profile. No duplicate entries, no register, no "let me check with the front desk".',
    metrics: [
      { label: 'Active members', value: '1,284', delta: '+62 this month' },
      { label: 'On hold', value: '37' },
      { label: 'Avg. tenure', value: '14.2 mo' },
    ],
  },
  {
    id: 'payments',
    index: '02',
    title: 'Payments',
    line: 'Money in, on time, on record.',
    body:
      'UPI, cards, autopay mandates and cash all reconcile into one ledger. Failed collections retry themselves and dues chase themselves — quietly, and in the member\'s language.',
    metrics: [
      { label: 'Collected (MTD)', value: '₹8,42,500', delta: '+18.4%' },
      { label: 'Outstanding', value: '₹64,200' },
      { label: 'Autopay active', value: '71%' },
    ],
  },
  {
    id: 'attendance',
    index: '03',
    title: 'Attendance',
    line: 'Know who walked in. And who stopped.',
    body:
      'QR, biometric or tap-in check-ins stream live to the floor. The moment a regular goes quiet, the system flags them — weeks before they would have cancelled.',
    metrics: [
      { label: 'Checked in today', value: '418' },
      { label: 'Peak hour', value: '7–8 PM' },
      { label: 'At-risk members', value: '23', delta: 'Flagged' },
    ],
  },
  {
    id: 'trainers',
    index: '04',
    title: 'Trainers',
    line: 'Payroll that matches the work.',
    body:
      'Sessions, class loads, client rosters and commissions are tracked as they happen. Trainer payouts stop being a spreadsheet argument at the end of every month.',
    metrics: [
      { label: 'Active trainers', value: '18' },
      { label: 'PT sessions (wk)', value: '246' },
      { label: 'Commission due', value: '₹1,12,400' },
    ],
  },
  {
    id: 'analytics',
    index: '05',
    title: 'Analytics',
    line: 'The numbers that decide the month.',
    body:
      'Revenue, retention, lead conversion and trainer performance in one board. Built for the decision you make on the first of the month, not a report you export and ignore.',
    metrics: [
      { label: 'MRR', value: '₹11,96,000', delta: '+9.2%' },
      { label: 'Retention', value: '88.4%' },
      { label: 'Lead → member', value: '34%' },
    ],
  },
]

/* ============================================================
   FEATURE STORYTELLING
   ============================================================ */

export type FeatureStory = {
  id: string
  eyebrow: string
  title: string[]
  body: string
  points: string[]
  visual: 'renewals' | 'leads' | 'scheduling' | 'notifications' | 'reports'
}

export const FEATURE_STORIES: FeatureStory[] = [
  {
    id: 'renewals',
    eyebrow: 'Renewals',
    title: ['NOBODY EXPIRES', 'QUIETLY.'],
    body:
      'Renewals are the difference between a good month and a bad one. KINETIQ watches every expiry window, scores the likelihood of each member coming back, and starts the conversation before the plan runs out.',
    points: [
      'Expiry windows tracked 30 / 14 / 7 / 1 days out',
      'Renewal probability scored per member',
      'One-tap renewal link over WhatsApp, SMS and app',
      'Win-back sequences for lapsed members',
    ],
    visual: 'renewals',
  },
  {
    id: 'leads',
    eyebrow: 'Lead management',
    title: ['THE WALK-IN', 'NEVER GETS LOST.'],
    body:
      'Every enquiry — walk-in, Instagram DM, missed call, web form — lands in one pipeline with an owner and a next action. Follow-ups are assigned, timed and measured, not remembered.',
    points: [
      'Unified inbox across web, social, calls and referrals',
      'Stage-based pipeline with owner and due date',
      'Trial passes issued and tracked end to end',
      'Conversion measured by source, staff and offer',
    ],
    visual: 'leads',
  },
  {
    id: 'scheduling',
    eyebrow: 'Classes & scheduling',
    title: ['FULL CLASSES.', 'NO CLIPBOARD.'],
    body:
      'Publish the timetable once. Members book from the app, waitlists promote themselves when a slot opens, and no-shows are logged against the member instead of the trainer.',
    points: [
      'Capacity, waitlist and auto-promotion',
      'Recurring schedules and trainer substitutions',
      'Credit-based and unlimited class packs',
      'Live floor occupancy by hour',
    ],
    visual: 'scheduling',
  },
  {
    id: 'notifications',
    eyebrow: 'Automated engagement',
    title: ['THE FOLLOW-UP', 'ALWAYS HAPPENS.'],
    body:
      'Welcome messages, dues reminders, birthday offers, streak nudges and win-backs go out on schedule, in the right channel, without anyone remembering to send them.',
    points: [
      'WhatsApp, SMS, email and push in one flow',
      'Triggered by behaviour, not by calendar alone',
      'Templates in English, Hindi and 6 regional languages',
      'Delivery, open and reply tracked per campaign',
    ],
    visual: 'notifications',
  },
  {
    id: 'reports',
    eyebrow: 'Reports',
    title: ['ONE BOARD.', 'EVERY BRANCH.'],
    body:
      'Compare locations on the metrics that matter — revenue per member, retention curve, trainer utilisation, collection efficiency. Roll up the group or drill into a single floor.',
    points: [
      'Multi-branch consolidation with per-branch drill-down',
      'Revenue, retention and cohort reporting',
      'Scheduled exports to email, GST-ready',
      'Role-based visibility for managers and owners',
    ],
    visual: 'reports',
  },
]

/** The complete capability index — presented as an editorial list, not cards. */
export const CAPABILITY_INDEX = [
  { group: 'Members', items: ['Membership management', 'Freezes & transfers', 'Family accounts', 'Member app'] },
  { group: 'Money', items: ['Billing & payments', 'Autopay mandates', 'Dues & collections', 'GST invoicing'] },
  { group: 'Floor', items: ['Attendance & check-in', 'Class scheduling', 'Trainer management', 'Trainer app'] },
  { group: 'Growth', items: ['Lead management', 'Renewals & win-back', 'Automated notifications', 'Referrals'] },
  { group: 'Intelligence', items: ['Owner dashboard', 'Analytics & reports', 'AI insights', 'Churn prediction'] },
  { group: 'Operations', items: ['Multi-branch', 'Staff roles & access', 'Inventory & POS', 'Audit log'] },
] as const

/* ============================================================
   BEFORE / AFTER
   ============================================================ */

export const COMPARISON = {
  before: {
    label: 'CHAOS',
    caption: 'How most gyms still run',
    items: [
      'Members tracked across three spreadsheets',
      'Attendance in a register nobody reads',
      'Follow-ups living in one person\'s WhatsApp',
      'Renewals remembered, then missed',
      'Cash, UPI and card records that never match',
      'A month-end number you find out about too late',
    ],
  },
  after: {
    label: 'CONTROL',
    caption: 'How it runs on KINETIQ',
    items: [
      'One member record, one source of truth',
      'Live attendance, streaming from the door',
      'Follow-ups assigned, timed and measured',
      'Renewals scored and chased automatically',
      'Every rupee reconciled into one ledger',
      'Revenue you can read on any day of the month',
    ],
  },
} as const

/* ============================================================
   LIVE DASHBOARD DATA — realistic, internally consistent
   ============================================================ */

export const KPIS = [
  { id: 'revenue', label: 'Revenue this month', value: 842500, prefix: '₹', delta: 18.4, trend: 'up' as const },
  { id: 'members', label: 'Active members', value: 1284, delta: 4.9, trend: 'up' as const },
  { id: 'leads', label: 'New leads', value: 176, delta: 12.1, trend: 'up' as const },
  { id: 'renewals', label: 'Renewals due (7d)', value: 47, delta: -6.2, trend: 'down' as const },
  { id: 'attendance', label: 'Check-ins today', value: 418, delta: 7.3, trend: 'up' as const },
  { id: 'pending', label: 'Pending payments', value: 64200, prefix: '₹', delta: -22.8, trend: 'down' as const },
]

export const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

/** Monthly revenue in ₹ lakh — a believable 12-month climb with seasonality. */
export const REVENUE_SERIES = [5.9, 6.2, 5.8, 6.4, 7.1, 7.0, 7.6, 8.1, 7.9, 9.4, 9.1, 9.8]
export const REVENUE_PREV = [4.8, 5.0, 4.9, 5.2, 5.6, 5.4, 5.9, 6.1, 6.0, 7.0, 6.8, 7.2]

/** Active members, month over month. */
export const MEMBER_SERIES = [842, 878, 901, 936, 974, 1002, 1048, 1091, 1120, 1186, 1231, 1284]

/** Check-ins by hour of a typical weekday — the classic gym twin peak. */
export const ATTENDANCE_HOURS = [
  { hour: '5a', v: 18 }, { hour: '6a', v: 52 }, { hour: '7a', v: 74 }, { hour: '8a', v: 61 },
  { hour: '9a', v: 34 }, { hour: '10a', v: 21 }, { hour: '11a', v: 14 }, { hour: '12p', v: 17 },
  { hour: '1p', v: 12 }, { hour: '2p', v: 9 }, { hour: '3p', v: 11 }, { hour: '4p', v: 19 },
  { hour: '5p', v: 44 }, { hour: '6p', v: 78 }, { hour: '7p', v: 96 }, { hour: '8p', v: 83 },
  { hour: '9p', v: 47 }, { hour: '10p', v: 22 },
]

/** Renewal outcomes for the last six months. */
export const RENEWALS = [
  { month: 'Oct', renewed: 88, lapsed: 21 },
  { month: 'Nov', renewed: 94, lapsed: 19 },
  { month: 'Dec', renewed: 81, lapsed: 27 },
  { month: 'Jan', renewed: 126, lapsed: 18 },
  { month: 'Feb', renewed: 118, lapsed: 16 },
  { month: 'Mar', renewed: 131, lapsed: 14 },
]

export const RETENTION_CURVE = [100, 94, 89, 86, 83, 81, 79, 78, 77, 76, 75, 74]

export const LEAD_SOURCES = [
  { source: 'Walk-in', value: 38 },
  { source: 'Instagram', value: 27 },
  { source: 'Referral', value: 19 },
  { source: 'Google', value: 11 },
  { source: 'Other', value: 5 },
]

export const TRAINER_PERFORMANCE = [
  { name: 'R. Iyer', sessions: 68, rating: 4.9, retention: 92 },
  { name: 'A. Khan', sessions: 61, rating: 4.8, retention: 88 },
  { name: 'S. Nair', sessions: 54, rating: 4.7, retention: 85 },
  { name: 'D. Mehta', sessions: 47, rating: 4.6, retention: 81 },
]

/* ============================================================
   AI
   ============================================================ */

export const AI_CONVERSATION = [
  { role: 'owner' as const, text: 'Which memberships are likely to expire this week?' },
  {
    role: 'ai' as const,
    text: '47 memberships expire in the next 7 days.',
    detail: [
      { label: 'High probability of renewal', value: '23', tone: 'good' as const },
      { label: 'Needs a nudge', value: '16', tone: 'warn' as const },
      { label: 'Likely to lapse', value: '8', tone: 'bad' as const },
    ],
  },
  {
    role: 'ai' as const,
    text:
      'The 8 at risk have each missed more than 12 days. Last quarter, a personal call from their trainer recovered 6 of 10 in this state.',
  },
  { role: 'owner' as const, text: 'Set up the follow-up.' },
  {
    role: 'ai' as const,
    text: 'Done. Campaign queued and trainers assigned.',
    actions: ['23 renewal links · WhatsApp', '16 offer nudges · 48h delay', '8 trainer call tasks'],
  },
]

export const AI_CAPABILITIES = [
  { title: 'Churn prediction', body: 'Scores every member on how likely they are to leave, weeks before they do.' },
  { title: 'Revenue forecasting', body: 'Projects the month from renewals in flight, not from last month\'s total.' },
  { title: 'Capacity planning', body: 'Reads attendance patterns and tells you when to add a class or a trainer.' },
  { title: 'Plain-language answers', body: 'Ask about your gym the way you\'d ask a manager. Get the number and the reason.' },
]

/* ============================================================
   AUTOMATION
   ============================================================ */

export const AUTOMATION_FLOW = [
  { id: 'lead', label: 'Enquiry captured', meta: 'Instagram DM' },
  { id: 'trial', label: 'Trial pass issued', meta: 'Auto, 3 days' },
  { id: 'join', label: 'Membership activated', meta: 'Annual · Autopay' },
  { id: 'welcome', label: 'Welcome sent', meta: 'WhatsApp' },
  { id: 'trainer', label: 'Trainer assigned', meta: 'By goal & slot' },
  { id: 'plan', label: 'Workout plan pushed', meta: 'Member app' },
  { id: 'track', label: 'Attendance tracked', meta: 'Live' },
  { id: 'nudge', label: 'Inactivity nudge', meta: 'After 9 quiet days' },
  { id: 'remind', label: 'Renewal reminder', meta: '30 / 14 / 7 days' },
  { id: 'renew', label: 'Membership renewed', meta: 'One tap' },
] as const

/* ============================================================
   MOBILE APPS
   ============================================================ */

export const APPS = [
  {
    id: 'member',
    name: 'Member app',
    line: 'Book, pay, progress.',
    points: ['Class booking & waitlist', 'Autopay and receipts', 'Workout plan & streaks'],
  },
  {
    id: 'trainer',
    name: 'Trainer app',
    line: 'Roster in your hand.',
    points: ['Today\'s sessions', 'Client notes & logs', 'Commission tracker'],
  },
  {
    id: 'owner',
    name: 'Owner app',
    line: 'The whole business.',
    points: ['Live revenue & occupancy', 'Dues and renewal alerts', 'Branch comparison'],
  },
] as const

/* ============================================================
   SECURITY
   ============================================================ */

export const SECURITY_LAYERS = [
  { id: 'data', title: 'Your data', body: 'Member records, payments and biometrics stay yours. Exportable in full, any time.' },
  { id: 'encryption', title: 'Encryption', body: 'AES-256 at rest, TLS 1.3 in transit. Payment data never touches our servers.' },
  { id: 'cloud', title: 'Isolated cloud', body: 'Per-tenant isolation in Indian regions. Data residency guaranteed in writing.' },
  { id: 'backups', title: 'Continuous backups', body: 'Point-in-time recovery to any second in the last 35 days.' },
  { id: 'access', title: 'Access control', body: 'Role-based permissions, SSO, and an audit log of every record touched.' },
] as const

export const COMPLIANCE = ['ISO 27001', 'SOC 2 Type II', 'DPDP Act 2023', 'PCI-DSS via gateway', '99.98% uptime'] as const

/* ============================================================
   TESTIMONIALS
   ============================================================ */

export const TESTIMONIALS = [
  {
    quote: ['WE STOPPED MANAGING THE GYM.', 'THE PLATFORM STARTED MANAGING IT.'],
    body:
      'Renewals used to be whoever remembered to call. Now the system knows who is slipping before I do, and the month is decided by the tenth, not the thirtieth.',
    name: 'Rohit Deshpande',
    role: 'Owner',
    org: 'Ironhaus Strength',
    location: 'Pune',
    stat: { value: '+34%', label: 'renewal rate in 5 months' },
  },
  {
    quote: ['THREE BRANCHES.', 'ONE NUMBER I TRUST.'],
    body:
      'I used to get three different revenue figures on three different days. Now I open one board in the morning and know exactly where the business is.',
    name: 'Meera Krishnan',
    role: 'Managing Director',
    org: 'Pulse24 Fitness',
    location: 'Chennai',
    stat: { value: '3 → 1', label: 'systems replaced' },
  },
  {
    quote: ['MY TRAINERS STOPPED', 'ARGUING ABOUT PAYROLL.'],
    body:
      'Every session is logged where it happens. Commission is calculated the same way for everyone, and the conversation at month end is about clients, not arithmetic.',
    name: 'Arjun Salvi',
    role: 'Head Coach & Partner',
    org: 'Forge Athletic',
    location: 'Mumbai',
    stat: { value: '11 hrs', label: 'saved every week' },
  },
  {
    quote: ['THE FRONT DESK', 'FINALLY LOOKS UP.'],
    body:
      'Check-in takes a second and the register is gone. My staff spend their time with members instead of with a notebook.',
    name: 'Nisha Bhatt',
    role: 'Founder',
    org: 'Velocity Wellness',
    location: 'Ahmedabad',
    stat: { value: '418/day', label: 'check-ins, zero queue' },
  },
] as const

/* ============================================================
   PRICING
   ============================================================ */

export type Plan = {
  id: string
  name: string
  tagline: string
  monthly: number | null
  yearly: number | null
  memberCap: string
  features: string[]
  cta: string
  featured?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For a single floor finding its feet.',
    monthly: 1499,
    yearly: 1249,
    memberCap: 'Up to 300 members',
    features: [
      'Membership management',
      'Attendance & check-in',
      'Billing, UPI & receipts',
      'Member app',
      'Email support',
    ],
    cta: 'Start free trial',
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For a gym that has stopped guessing.',
    monthly: 3999,
    yearly: 3299,
    memberCap: 'Up to 1,000 members',
    features: [
      'Everything in Starter',
      'Lead pipeline & trials',
      'Automated renewals & win-back',
      'WhatsApp campaigns',
      'Trainer app & commissions',
      'Class scheduling & waitlists',
      'Priority support',
    ],
    cta: 'Start free trial',
    featured: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For operators running more than one floor.',
    monthly: 7999,
    yearly: 6599,
    memberCap: 'Up to 3,000 members · 3 branches',
    features: [
      'Everything in Growth',
      'Multi-branch consolidation',
      'AI insights & churn prediction',
      'Revenue forecasting',
      'Custom reports & exports',
      'Inventory & POS',
      'Dedicated success manager',
    ],
    cta: 'Book a demo',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For chains, franchises and groups.',
    monthly: null,
    yearly: null,
    memberCap: 'Unlimited members & branches',
    features: [
      'Everything in Pro',
      'Franchise & territory roles',
      'SSO and audit logging',
      'Open API & webhooks',
      'Custom SLA with 99.98% uptime',
      'On-site onboarding & training',
    ],
    cta: 'Talk to sales',
  },
]

export const PRICING_NOTE = 'Prices in INR, per branch, excluding GST. Yearly billing saves two months.'

export const FAQS = [
  {
    q: 'How long does it take to move our data across?',
    a: 'Most gyms are live within 48 hours. Send us whatever you have — spreadsheets, a register, an export from another system — and our team migrates members, plans, dues and attendance history for free.',
  },
  {
    q: 'Do members have to download an app?',
    a: 'No. Members can book, pay and check in through a browser link or over WhatsApp. The app is there for the ones who want streaks, plans and progress — typically around 60% of a member base within a month.',
  },
  {
    q: 'What happens to our biometric and payment data?',
    a: 'Biometric templates are encrypted per tenant and never leave Indian regions. Card and UPI data is handled entirely by the payment gateway — it never touches KINETIQ servers.',
  },
  {
    q: 'Can we run more than one branch?',
    a: 'Yes. Pro and Enterprise consolidate every branch into one board, with per-branch drill-down and role-based visibility so a manager sees their floor and you see the group.',
  },
  {
    q: 'What if we want to leave?',
    a: 'You export everything — members, payments, attendance, notes — in standard formats, on demand. No exit fee, no lock-in contract on monthly plans.',
  },
] as const

/* ============================================================
   CLOSE
   ============================================================ */

export const FINAL_CTA = {
  headline: ['YOUR GYM.', 'THE NEXT LEVEL.'],
  body: 'Stop managing your gym manually. Start running it intelligently.',
  primary: 'Book a Free Demo',
  secondary: 'Talk to sales',
  reassure: '30-minute walkthrough · Your data, migrated free · No contract',
} as const

export const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '#product' },
      { label: 'Features', href: '#features' },
      { label: 'Automation', href: '#automation' },
      { label: 'AI insights', href: '#ai' },
      { label: 'Mobile apps', href: '#apps' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Single gyms', href: '#solutions' },
      { label: 'Multi-branch chains', href: '#solutions' },
      { label: 'Boutique studios', href: '#solutions' },
      { label: 'CrossFit boxes', href: '#solutions' },
      { label: 'Personal trainers', href: '#solutions' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Analytics guide', href: '#resources' },
      { label: 'Security', href: '#security' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Status', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#contact' },
      { label: 'Careers', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
] as const
