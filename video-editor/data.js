/* ===========================================================
   VIDEO EDITOR PORTFOLIO — content config
   =========================================================== */

window.SITE = {
  name: 'Sriram MJ',
  role: 'Video Editor',

  heroWelcome: 'Welcome',
  heroLine: 'to Sriram\u2019s world of <em>stunt riding films</em>, cinematic edits, and color.',

  navLead1: 'THE', navWork: 'WORK', navLead2: 'AND', navAbout: 'ABOUT ME',
  navLead3: 'OR', navContact: 'CONTACT',
  workLabel: 'projects', singularLabel: 'project',

  soundBadgeText: 'WATCH THE CUT \u2022 WATCH THE CUT \u2022 ',

  aboutText: 'I edit cinematic stunt-riding and action footage for @delusional.efx \u2014 pacing, color, and sound design built in DaVinci Resolve.',

  contactText: 'For edits, collabs, or the full reel \u2014 reach out.',
  contactLinks: [
    { label: 'Instagram', href: 'https://www.instagram.com/delusional.efx?stkn=MW82b2ttZW9vdnNuaw==' },
    { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/sriram-m-j-5491a7322/' },
    { label: 'Email',     href: 'mailto:srirammj221@gmail.com' }
  ]
};

window.PROJECTS = [
  {
    slug: 'night-ride',
    title: 'NIGHT RIDE',
    category: 'Stunt Edit',
    short: 'A night stunt run cut to a driving score.',
    description: 'A cinematic night stunt motorcycle run color graded with dark moody tones.',
    moreInfo: 'Shot on Sony FX3 with anamorphic lenses. Edited in DaVinci Resolve.',
    thumb: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
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
    description: 'High energy urban stunt compilation featuring precision street riding.',
    moreInfo: 'Color graded in DaVinci Resolve with custom LUTs.',
    thumb: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
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
    description: 'Dynamic automotive film focusing on sound design and fast-paced rhythmic editing.',
    thumb: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
    items: [
      { title: 'Main Cut', type:'play', meta:'0:00' }
    ]
  },
  {
    slug: 'behind-the-lens',
    title: 'BEHIND THE LENS',
    category: 'BTS',
    short: 'Behind-the-scenes look at a shoot day.',
    description: 'Documentary style behind-the-scenes film capturing the creative process on set.',
    thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
    items: [
      { title: 'Full BTS', type:'play', meta:'0:00' }
    ]
  },
  {
    slug: 'reel-2026',
    title: 'REEL 2026',
    category: 'Showreel',
    short: 'The full year showreel \u2014 best cuts in one edit.',
    description: 'Annual highlight reel bringing together video editing, motion design, and direction.',
    thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
    items: [
      { title: 'Full Reel', type:'play', meta:'0:00' }
    ]
  }
];
