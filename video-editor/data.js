/* ===========================================================
   VIDEO EDITOR PORTFOLIO — content config
   Replace the placeholder text/media paths below with your own.
   - thumb: small image/clip shown on the home wall (leave blank
     for a dashed placeholder box)
   - media: the featured video/image on the project page
   - items: the row list under the featured media (extra cuts,
     alt versions, behind-the-scenes, etc.)
   =========================================================== */

window.SITE = {
  name: 'Sriram MJ',
  role: 'Multidisciplinary Designer',

  heroWelcome: 'Welcome',
  heroLine: 'to Sriram\u2019s world of <em>stunt riding films</em>, cinematic edits, and color.',

  navLead1: 'the', navWork: 'Work', navLead2: 'and', navAbout: 'About Me',
  navLead3: 'or', navContact: 'Contact',
  workLabel: 'projects', singularLabel: 'project',

  soundBadgeText: 'WATCH THE CUT \u2022 WATCH THE CUT \u2022 ',

  aboutText: 'I edit cinematic stunt-riding and action footage for @delusional.efx \u2014 pacing, color, and sound design built in DaVinci Resolve. This page is a placeholder: swap in your own bio, stills, and reel history.',

  contactText: 'For edits, collabs, or the full reel \u2014 reach out.',
  contactLinks: [
    { label: 'Instagram', href: 'https://instagram.com/delusional.efx' },
    { label: 'Email', href: 'mailto:you@example.com' }
  ]
};

window.PROJECTS = [
  {
    slug: 'night-ride',
    title: 'NIGHT RIDE',
    category: 'Stunt Edit',
    short: 'A night stunt run cut to a driving score \u2014 placeholder description.',
    description: 'NIGHT RIDE is a placeholder project. Replace this with a real description of the edit: the bike, the location, the story you cut for.',
    moreInfo: 'Add extra context here \u2014 gear used, camera setup, edit software, runtime, release date.',
    thumb: '', // e.g. 'media/night-ride-thumb.jpg'
    media: null, // e.g. { type:'video', src:'media/night-ride.mp4', poster:'media/night-ride-poster.jpg' }
    mediaKind: 'video',
    items: [
      { title: 'Main Cut', type:'play', meta:'0:00' },
      { title: 'Slow-Mo Highlight Reel', type:'play', meta:'0:00' },
      { title: 'Raw B-Roll Select', type:'play', meta:'0:00' }
    ]
  },
  {
    slug: 'wheelie-city',
    title: 'WHEELIE CITY',
    category: 'Cinematic Edit',
    short: 'Urban wheelie compilation, color graded for a moody teal-orange look.',
    description: 'WHEELIE CITY placeholder \u2014 describe the concept, the riders featured, and what made this edit different.',
    moreInfo: 'Add extra context here.',
    thumb: '',
    media: null,
    mediaKind: 'video',
    items: [
      { title: 'Final Edit', type:'play', meta:'0:00' },
      { title: 'Alternate Cut (Instagram Reel)', type:'play', meta:'0:00' }
    ]
  },
  {
    slug: 'burnout',
    title: 'BURNOUT',
    category: 'Sound Design',
    short: 'Sound-forward edit built around engine and tire audio.',
    description: 'BURNOUT placeholder \u2014 describe the sound design approach and pacing.',
    thumb: '',
    media: null,
    mediaKind: 'video',
    items: [
      { title: 'Main Cut', type:'play', meta:'0:00' }
    ]
  },
  {
    slug: 'behind-the-lens',
    title: 'BEHIND THE LENS',
    category: 'BTS',
    short: 'Behind-the-scenes look at a shoot day.',
    description: 'BEHIND THE LENS placeholder \u2014 describe the shoot.',
    thumb: '',
    media: null,
    mediaKind: 'video',
    items: [
      { title: 'Full BTS', type:'play', meta:'0:00' }
    ]
  },
  {
    slug: 'reel-2026',
    title: 'REEL 2026',
    category: 'Showreel',
    short: 'The full year showreel \u2014 best cuts in one edit.',
    description: 'REEL 2026 placeholder \u2014 your annual highlight reel.',
    thumb: '',
    media: null,
    mediaKind: 'video',
    items: [
      { title: 'Full Reel', type:'play', meta:'0:00' }
    ]
  }
];
