import A from './assets'

// /compare page content — specs/compare.md. All copy verified against
// recon/pages/compare/raw.html (the measurement JSON truncates text; do not copy from it).

export const COMPARE_ASSETS = {
  logoTable: A('68639bb30a93107837363b04-logo-2.svg'), // white T9 logo, reused as .logo-table (§4)
  tick: A('69930212d8ba3f0cb66dbbe1-tick.svg'), // §15
  callBlue: A('6992da8bade6530f1dab73f8-call-blue.avif'), // .left-side.generic bg (§3)
  privacyGreen: A('69946c2576805aff36fcf31a-privacy-green.avif'), // .privacy-left bg (§7)
}

// §2 hero
export const COMPARE_HERO = {
  label: 'What We Do:',
  text:
    'Transform9 builds AI voice agents for specialty physician practices. Our intentional focus enables us to be experts in the space - especially within Orthopedics, Urology, Neurology, GI and Ophthalmology.',
  ctaLabel: 'Test Our AI Agent',
}

// Shared "Book a Live Demo" link (hero + table bottom, §2 / §4)
export const BOOK_LIVE_DEMO = { href: '/book-a-demo', label: 'Book a Live Demo' }

// §3 "Not Generic"
export const GENERIC_TEXT =
  'Our AI voice agents are designed to handle real patient access workflows with precision, security, and consistency. Unlike general-purpose AI solutions, Transform9 is an expert in healthcare where accuracy and security matter most. Our knowledge and deep understanding of the industry separate us from our competition.'

// §4 comparison table: [label, Transform9 cell, "Other AI Agents" cell]. The \u00a0 are
// non-breaking spaces present in the live copy (raw.html); they change line wrapping.
export const COMPARE_ROWS = [
  ['Purpose-built for healthcare', 'Designed specifically for healthcare access and front office workflows', 'Many platforms adapt generic call-center AI for healthcare use'],
  ['Specialty-specific experts', 'Industry experts across Orthopedics, Neurology, Urology, Gastroenterology, Ophthalmology and others', 'Varies by vendor. Many have broad reach with limited expertise'],
  ['Pricing structure', 'Tailored to match customer needs', 'Usage-based/per-call. Can be highly variable'],
  ['Hidden fees', 'None/no overages - transparent pricing', 'Additional costs can often appear as call volume grows'],
  ['Budget predictability', 'Easy to forecast monthly/annually', 'Costs may fluctuate month to month'],
  ['IT lift required', 'Minimal burden on internal IT teams - the T9 team works hand in hand with you throughout the process', 'Often requires deeper IT involvement. Internal teams left responsible with minimal guidance or support'],
  ['Security & compliance', 'T9 is in the top-5% of most secure/compliant vendors in the industry with HIPAA, SOC\u00a02: Type I/II, FedRAMP\u00a020x, NIST 800-30, NIST 800-53 designations', "Most vendors are HIPAA\u00a0'aware' or HIPAA\u00a0'compliant' only - the lowest level of required security."],
  ['Customer support model', 'White-glove onboarding and ongoing partnership/customer support', 'Ticket-based or tiered support models - less involved following deployment'],
  ['Product focus', 'Our focus is on healthcare only and our technology is designed specifically for it', 'Voice AI is often one product across multiple verticals - not healthcare focused'],
  ['Long-term fit', 'Designed to scale with growing practices - lower "Technical Debt"\u00a0than other offerings', 'Risk of outgrowing the solution - future costs can occur as a result of necessary updates'],
]

export const TABLE_BOTTOM_TEXT =
  'The chart above highlights the fundamental differences between Transform9 and typical AI voice agents. Transform9 is designed around practice-specific workflows and healthcare-first principles — not templates or guess-based behavior.'

// §5 patient access
export const ACCESS_BLOCKS = [
  {
    head: 'Patient access Is broken — and generic AI falls short',
    text:
      'Specialty practices face overwhelming call volumes and increasing strain on front office teams. Many AI voice agents attempt to solve this with generic intent detection and scripted responses, which often break down in real-world healthcare environments.',
  },
  {
    head: 'An AI voice agent governed by precision',
    text:
      'Healthcare requires consistency. AI voice agents should follow defined rules and workflows — not make guesses. Transform9 layers a proprietary rule engine and workflow orchestrator on top of AI reasoning, ensuring every action is checked against your practice’s rules and executed correctly within real systems.',
  },
]

// §6b / §6c white-section copy
export const SPECIALTY_WHITE_BOTTOM =
  'Transform9 is designed to support complex specialty workflows, terminology, and scheduling requirements. Each agent is tailored to the unique needs of the specialty it serves, ensuring conversations feel natural, relevant, and accurate for patients.'
export const INTEGRATIONS_WHITE_TEXT =
  'Transform9 works with leading electronic health record platforms commonly used by physician practices. Integration capabilities vary by practice and workflow.'

// §7 privacy blocks, in DOM order (two rows of two). `long` = .privacy-text.long (44ch).
export const PRIVACY_ROWS = [
  [
    {
      head: 'FedRAMP 20x',
      text:
        'FedRAMP Low ensures foundational cybersecurity for systems handling non-sensitive or public data, meeting baseline federal requirements for cloud security and operational trust.',
    },
    {
      head: 'NIST 800-30 Risk Assessment',
      text:
        'NIST 800-30 ensures Transform9 proactively identifies and mitigates risks before they impact data or operations, demonstrating a mature, government-aligned approach to security continuity and compliance.',
    },
  ],
  [
    {
      head: 'SOC 2 Type I/II',
      long: true,
      text:
        'This designation provides a significantly higher level of patient data protection than HIPAA alone. Type II status places Transform9 among the top 10–15% of healthcare SaaS vendors for security maturity and trustworthiness.',
    },
    {
      head: 'NIST 800-53 Moderate',
      text:
        'NIST 800-53 Moderate is the federal benchmark for securing sensitive data, with 260+ controls protecting PHI at the same level required by government healthcare systems.',
    },
  ],
]

// §8 Healthcare AI Evaluation accordion
export const EV_TABS = [
  {
    head: 'Accuracy and Consistency',
    text:
      'Healthcare conversations need predictable outcomes. Systems that rely on guessing introduce risk and inconsistency into patient access workflows.',
  },
  {
    head: 'Healthcare-Specific Design',
    text:
      'Tools built specifically for healthcare are more likely to align with regulatory, operational, and patient experience expectations than solutions adapted from other industries.',
  },
  {
    head: 'Uniqueness and Control',
    text:
      'Practices should understand how much control they have over workflows, call logic, and ongoing changes as operational needs evolve.',
  },
  {
    head: 'Ownership and Accountability',
    text:
      'Long-term success depends on clear ownership and accountability. Practices should evaluate who is responsible for performance, optimization, and support after deployment.',
  },
]
