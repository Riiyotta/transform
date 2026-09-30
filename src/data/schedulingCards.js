import A from './assets'

// Scheduling Agent #1 stacking cards — CLONE_SPEC §10b (text verbatim from live DOM).
// `mod` mirrors the Webflow modifier classes on the head/text (`_2`, `_3`, `_4`), which
// carry per-card max-widths.
export const SCHEDULING_CARDS = [
  {
    index: '01',
    head: 'Comprehensive Scheduling',
    text: 'Supports scheduling, rescheduling, cancelling, and confirming all appointment types — office visits, procedures, and ancillaries — including multiple visits in a single conversation.',
    img: A('6895b5254b12f4e9385d2b64-cb862a86e82892dd803115dfaf743bfe-sch-img-1.avif'),
    headMod: '',
    textMod: '',
  },
  {
    index: '02',
    head: 'New Patient Intake With Insurance Verification',
    text: 'Collect patient info and verify insurance before the visit—saving your staff time and reducing delays.',
    img: A('6895b52599b0bc61961ff546-d5924aa3dfe7c5f576623788a8ab5825-sch-img-2.avif'),
    headMod: '_2',
    textMod: '_2',
  },
  {
    index: '03',
    head: 'Industry Leading Scheduling Rules Engine',
    text: 'AI follows your practice’s custom scheduling rules 100% accurately every time, reducing costly human agent training time and mistakes.',
    img: A('6895b5252492c7e65980a91c-6da87d9d094dc249ee70d2f8f5118203-sch-img-3.avif'),
    headMod: '',
    textMod: '_3',
  },
  {
    index: '04',
    head: 'Fill Schedules and Maximize Revenue',
    text: 'Automatically fill physician schedules to desired capacity, preventing missed opportunities for appointments.',
    img: A('6895b525dc871b1f5fe7bedd-721d1e1a3e576f29f09b75ccf4d7db9e-sch-img-4.avif'),
    headMod: '',
    textMod: '_4',
  },
]
