// Local asset paths (public/assets, sanitized names — see public/assets/_map.tsv).
// Single place to resolve asset URLs so components never hardcode filenames.
const A = (name) => `/assets/${name}`

export const ASSETS = {
  logoWhite: A('68639bb30a93107837363b04-logo-2.svg'),
  logoBlack: A('68906575d051bc5b61776ed5-logo-black.svg'),
  logoFooter: A('68920b38695cade17f6e41a0-logo-footer.svg'),
  burgerWhite: A('68a300503634463bc8a25527-menu-burger.svg'),
  burgerBlack: A('68a5a50307e780f41451718b-menu-burger-close.svg'),
  crossWhite: A('689caa3e67c8dbd2e70dc1bc-close-icon-white.svg'),
  closeWhite28: A('689caa792a4b35f0e9aba831-close-icon-white-28.svg'),
  closeBlack28: A('68af7e1deaff18ed0b98d8fb-close-icon-black-28.svg'),
  heroVideoMp4: A('hero-tablet.mp4'),
  heroVideoWebm: A('hero-tablet.webm'),
  heroVideoPoster: A('hero-tablet-poster.jpg'),
  ytThumb: A('yt-thumb.jpg'),
  statsGradient: A('6894e2b1ef0879a32ffdc2a5-gr-bl.webp'),
}

export default A
