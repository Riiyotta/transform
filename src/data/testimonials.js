import A from './assets'

// Testimonials slider content — CLONE_SPEC §8 (text verbatim from recon/live-dom-1440.html).
// `highlight` is the green `.testim-highlight` span; `closing` is the text after it.
// Point 1 text ends in U+2028 (LINE SEPARATOR), verbatim from the live DOM; it has width.
// Point `sub` renders as `.text-span-3` / `.text-span-4` (block at >=992, inline below).
export const TESTIMONIALS = [
  {
    photo: A('687f914b39717f558eb082e8-tammy-jackson.webp'),
    photoAlt: 'A photo of Tammy Jackson',
    name: 'Tammy Jackson',
    title: 'CAO, The Orthopaedic Center',
    quote:
      '“The Transform9 team has been one of our best vendor relationships. Their people know what they\'re doing, hear what we\'re saying, and even look out for things we don\'t even know to look out for. ',
    highlight: "It's been a great relationship.",
    closing: '”',
    points: [
      { num: '80%', text: 'decrease in call abandonment\u2028', sub: 'from 20% to 3% in 1 month', subClass: 'text-span-3' },
      { num: '90%', text: 'decrease in ', sub: 'patient hold times', subClass: 'text-span-4' },
    ],
    logo: A('687f56b54ba0d2c838ec91b8-the-orthopaedic-center.webp'),
    logoAlt: 'The Orthopaedic Center logo',
  },
  {
    photo: A('68b03d1ff7bab6dbf46fb416-scott-griffin.webp'),
    photoAlt: 'A photo of Scott Griffin',
    name: 'Scott Griffin, MBA',
    title: 'CEO, Southern Bone & Joint Specialists',
    quote:
      '“Implementing Transform9 has been one of our best decisions. Their team is incredibly knowledgeable, accommodating, and always looking for ways to further support our practice. We have experienced significant impacts in our operations and ',
    highlight: 'enjoy our relationship with the entire team.',
    closing: '”',
    // Original: this number has no `.testim-num` class (plain `._30px-text.white`).
    points: [{ num: '93%', text: 'patient satisfaction', numPlain: true }],
    logo: A('68b03e7aa72891aa77fb17bf-southern-bone-and-joint-specialists.webp'),
    logoAlt: 'Southern Bone and Joint Specialists logo',
  },
]

export const TESTIM_ARROWS = {
  leftWhite: A('68af375b6ed817d8303e6d01-arrow-white-left.svg'),
  leftBlack: A('68af375bd94b22d7288ceba1-arrow-black-left.svg'),
  rightWhite: A('687f9e315c0a9b7f071b0a0c-arrow.svg'),
  rightBlack: A('68af321214fa5cc11e7994c7-arrow-black.svg'),
}
