/** @type {import('tailwindcss').Config} */
//
// Transform9 clone: design tokens.
// Every value here points at a CSS custom property defined in src/index.css (:root).
// The custom properties are the single source of truth: fluid formulas (vw/clamp) and
// their breakpoint overrides live there, so Tailwind utilities (text-hero, p-pad,
// w-rail, bg-green, ...) automatically pick up the right value at every breakpoint.
// Source: CLONE_SPEC.md §1.3 (colors), §1.4 (typography), §1.2/§1.5 (layout/spacing).
//
// BREAKPOINTS: Webflow's standard set (CLONE_SPEC §1.1). Webflow is desktop-first: the
// base rules are >=992px and each smaller range is a max-width override. We mirror that
// exactly with max-width screens (declared largest -> smallest so later/smaller ones win):
//   (no prefix)  >= 992px   desktop / "main"
//   tablet:      <= 991px   @media screen and (max-width: 991px)
//   mobile:      <= 767px   @media screen and (max-width: 767px)
//   tiny:        <= 479px   @media screen and (max-width: 479px)
// Tailwind's default min-width screens (sm/md/lg/...) are intentionally replaced.
//
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      tablet: { max: '991px' },
      mobile: { max: '767px' },
      tiny: { max: '479px' },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: 'var(--color-black)',
      white: 'var(--color-white)',
      green: 'var(--color-green)',
      'blue-light': 'var(--color-blue-light)',
      'blue-dark': 'var(--color-blue-dark)',
      'blue-2': 'var(--color-blue-2)',
      'blue-3': 'var(--color-blue-3)',
      'blue-4': 'var(--color-blue-4)',
      gray: 'var(--color-gray)',
      'stroke-dark': 'var(--color-stroke-dark)',
      'stroke-light': 'var(--color-stroke-light)',
      'nav-bg': 'var(--color-nav-bg)',
      'nav-link': 'var(--color-nav-link)',
      'hiw-inactive': 'var(--color-hiw-inactive)',
      'card-tint-1': 'var(--color-card-tint-1)',
      'card-tint-2': 'var(--color-card-tint-2)',
      'card-tint-3': 'var(--color-card-tint-3)',
      'block-bg': 'var(--color-block-bg)',
      'tab-inactive': 'var(--color-tab-inactive)',
      'yt-play': 'var(--color-yt-play)',
      'yt-icon': 'var(--color-yt-icon)',
      error: 'var(--color-error)',
      'error-bg': 'var(--color-error-bg)',
    },
    fontFamily: {
      sans: 'var(--font-sans)',
    },
    fontSize: {
      // role: [size, lineHeight]  (CLONE_SPEC §1.4)
      hero: ['var(--fs-hero)', { lineHeight: 'var(--lh-hero)' }],
      display: ['var(--fs-display)', { lineHeight: 'var(--lh-display)' }],
      hiw: ['var(--fs-hiw)', { lineHeight: 'var(--lh-display)' }],
      56: ['var(--fs-56)', { lineHeight: 'var(--lh-display)' }],
      'stats-head': ['var(--fs-stats-head)', { lineHeight: 'var(--lh-display)' }],
      'popup-head': ['var(--fs-popup-head)', { lineHeight: 'var(--lh-display)' }],
      30: ['var(--fs-30)', { lineHeight: 'var(--lh-30)' }],
      '30-hero': ['var(--fs-30-hero)', { lineHeight: 'var(--lh-30)' }],
      '30-testimonial': ['var(--fs-30-testimonial)', { lineHeight: 'var(--lh-30)' }],
      '30-card-head': ['var(--fs-30-card-head)', { lineHeight: 'var(--lh-30)' }],
      '30-card-index': ['var(--fs-30-card-index)', { lineHeight: 'var(--lh-30)' }],
      submit: ['var(--fs-submit)', { lineHeight: 'var(--lh-30)' }],
      16: ['var(--fs-16)', { lineHeight: 'var(--lh-body)' }],
      '16-specialty': ['var(--fs-16-specialty)', { lineHeight: 'var(--lh-body)' }],
      14: ['var(--fs-14)', { lineHeight: 'var(--lh-body)' }],
      'legal': ['var(--fs-legal)', { lineHeight: 'var(--lh-body)' }],
      nav: ['var(--fs-nav)', { lineHeight: 'var(--lh-body)' }],
      'nav-cta': ['var(--fs-nav-cta)', { lineHeight: 'var(--lh-body)' }],
      'form-input': 'var(--fs-form-input)',
      'hero-input': 'var(--fs-hero-input)',
    },
    extend: {
      spacing: {
        pad: 'var(--pad)',
        rail: 'var(--rail)',
        nav: 'var(--nav-h)',
        indent: 'var(--indent-label)',
      },
      borderColor: {
        DEFAULT: 'var(--color-stroke-dark)',
      },
      transitionTimingFunction: {
        // Easing curves from the original CSS / IX2 (CLONE_SPEC §18). Values only;
        // motion wiring is owned by the Animation pass.
        'out-cubic': 'var(--ease-out-cubic)',
        'out-quad': 'var(--ease-out-quad)',
        'in-out-quad': 'var(--ease-in-out-quad)',
        'in-out-cubic': 'var(--ease-in-out-cubic)',
      },
      backdropBlur: {
        nav: '80px',
      },
    },
  },
  plugins: [],
}
