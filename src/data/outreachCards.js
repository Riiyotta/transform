import A from './assets'

// Outreach Agent #4 split cards — CLONE_SPEC §10e. `variant` is the Webflow card class
// (_1.._5) that sets the card colour and fixed stacking offset.
export const OUTREACH_CARDS = [
  {
    variant: '_1',
    index: '01',
    title: 'Patient Recall & Surveys',
    text: 'Reconnect with past patients and collect feedback to improve care.',
    icon: A('6883f34c4e63a9b69a4e5d84-out-icon-01.webp'),
  },
  {
    variant: '_2',
    index: '02',
    title: 'Targeted Campaigns',
    text: 'Send customized messages about new services, promotions, and updates.',
    icon: A('6883f34c4175e5ba20591b09-out-icon-02.webp'),
  },
  {
    variant: '_3',
    index: '03',
    title: 'Last-Minute Appointment Slot Fill',
    text: 'Proactively reach out to backfill cancellations and open appointment slots.',
    icon: A('6883f34c5f69d9e9448db9e1-out-icon-03.webp'),
  },
  {
    variant: '_4',
    index: '04',
    title: 'Outbound Scheduling Support',
    text: 'Manage referred patient calls and recover incomplete inquiries automatically.',
    icon: A('6883f1f3db0dc1ce3dd77736-out-icon-04.webp'),
  },
  {
    variant: '_5',
    index: '05',
    title: 'Appointment Reminders',
    text: 'Reduce no-shows with timely appointment and prescription refill nudges.',
    icon: A('6883f34cf8d4db106318440c-out-icon-05.webp'),
  },
]
