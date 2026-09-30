// /book-a-demo content — specs/book-a-demo.md §2–§3, verbatim from recon/pages/book-a-demo/raw.html.

// h1.white-text.hero-home.demo — two lines separated by the source <br>.
export const DEMO_HEADING = ['30 minutes. Real Demo.', 'No Sales Script.']

// div.text-block-5 — straight apostrophes (&#x27;); the source ends with two spaces and a <br>.
export const DEMO_TEXT =
  'A quick, 30-minute Q&A and demo so that you get the answers you need to the questions you\'re asking. No hard sell, just a chance to connect and show you how we\'re helping practices across the country.  '

// form#wf-form-T9-demo-form fields, in order. All: input.w-input, maxlength 256, required.
export const DEMO_FIELDS = [
  { id: 'first_name', label: 'First Name', type: 'text', placeholder: 'First Name' },
  { id: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Last Name' },
  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'Email' },
  { id: 'practice_name', label: 'Practice Name', type: 'text', placeholder: 'Practice Name' },
  { id: 'emr_pms', label: 'EMR/PMS', type: 'text', placeholder: 'EMR/PMS' },
]

export const DEMO_FORM = {
  id: 'wf-form-T9-demo-form',
  name: 'wf-form-T9-demo-form',
  dataName: 'T9 demo form',
  submit: 'Book My Demo',
  dataWait: 'Please wait...',
  // Label the live inline script sets while the HubSpot request is in flight (§3).
  submitting: 'Submitting...',
  success: 'Thank you! Your submission has been received!',
  fail: 'Oops! Something went wrong while submitting the form.',
  // CLONE CHOICE (not measured): live waits on the HubSpot network round trip; the clone
  // never submits (D2), so it holds the "Submitting..." state for this long before success.
  submittingMs: 800,
}
