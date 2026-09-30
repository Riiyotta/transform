import A from './assets'

// Security certification cells — CLONE_SPEC §14. `sm` = the smaller NIST logo height.
// Two `.security-row-of-2` rows of two cells; the last cell is empty.
export const SECURITY_ROWS = [
  {
    variant: '_1',
    cells: [
      {
        variant: '_2nd',
        sm: true,
        alt: 'NIST 800-53 Moderate Controls',
        white: A('6891ebdb0ad3ebb68fe6d694-nist-white.svg'),
        black: A('6891ebdb7394dd666fb56b4e-nist-white-1.svg'),
      },
      {
        sm: true,
        alt: 'NIST 800-30 Risk Assessment',
        white: A('698db856e06a92021fdfd2d6-nist-2-white.svg'),
        black: A('698db856fcc2fd567ffa01fe-nist-2-white-1.svg'),
      },
    ],
  },
  {
    cells: [
      {
        alt: 'SOC 2 Type 2 Compliant logo',
        white: A('6891ebdb97d9bef9310d4f85-soc-white.svg'),
        black: A('6891ebdb9f4ab9a258d517a7-soc-white-1.svg'),
      },
      { variant: 'right', empty: true },
    ],
  },
]
