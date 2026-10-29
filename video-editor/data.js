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

/* ===========================================================
   PROJECTS DATA STRUCTURE
   Each project contains:
     - title
     - description
     - category
     - images[] (individual images rendered across the 30 3D spatial slots)

   The Index View renders only these unique projects.
   The 3D Space renders the individual images from these groups.
   =========================================================== */

window.PROJECTS = [
  {
    slug: 'team-never-enough',
    title: 'TEAM NEVER ENOUGH',
    category: 'Motorcycle Stunt Collective',
    description: 'I’ve been a fan of Team Never Enough and their unique approach to motorcycle stunt performances. I create and edit videos of their work out of genuine passion, not as a paid project. For me, it’s a way to combine my love for their work with my passion for editing and visual storytelling.',
    short: 'I’ve been a fan of Team Never Enough and their unique approach to motorcycle stunt performances. I create and edit videos of their work out of genuine passion, not as a paid project. For me, it’s a way to combine my love for their work with my passion for editing and visual storytelling.',
    moreInfo: 'Royal Enfield Guerrilla 450 edition. Precision street riding, vertical balance acrobatics, and raw visual velocity.',
    thumb: 'media/team-never-enough.jpg?v=5242',
    media: { type: 'image', src: 'media/team-never-enough.jpg?v=5242' },
    mediaKind: 'image',
    images: [
      {
        id: 1,
        slot: 1,
        src: 'media/team-never-enough.jpg?v=5242',
        orientation: 'portrait',
        caption: 'Guerrilla 450 Hero Balance'
      },
      {
        id: 2,
        slot: 5,
        src: 'media/tne-poster.jpg?v=5242',
        orientation: 'landscape',
        caption: 'Street Precision Cut'
      },
      {
        id: 3,
        slot: 18,
        src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Stunt Telemetry HUD'
      },
      {
        id: 4,
        slot: 15,
        src: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Slow-Mo Mechanics'
      },
      {
        id: 5,
        slot: 19,
        src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Telemetry Dashboard'
      },
      {
        id: 6,
        slot: 29,
        src: 'media/tne-poster.jpg?v=5242',
        orientation: 'portrait',
        caption: 'Vertical Balance Acrobatics'
      },
      {
        id: 7,
        slot: 20,
        src: 'media/team-never-enough.jpg?v=5242',
        orientation: 'landscape',
        caption: 'Raw Engine Velocity'
      },
      {
        id: 8,
        slot: 13,
        src: 'media/team-never-enough.jpg?v=5242',
        orientation: 'landscape',
        caption: 'Suspension Compression'
      },
      {
        id: 9,
        slot: 23,
        src: 'media/tne-poster.jpg?v=5242',
        orientation: 'landscape',
        caption: 'Underground Night Acrobatics'
      }
    ],
    items: [
      { title: 'Guerrilla 450 Cut', type: 'play', meta: '0:00' },
      { title: 'Slow-Mo Highlight Reel', type: 'play', meta: '0:00' },
      { title: 'Raw B-Roll Select', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'wheelie-city',
    title: 'WHEELIE CITY',
    category: 'Cinematic Edit',
    description: 'High energy urban stunt compilation featuring precision street riding and low-angle tracking camera capture.',
    short: 'Urban wheelie compilation, color graded for a moody teal-orange look.',
    moreInfo: 'Color graded in DaVinci Resolve with custom LUTs.',
    thumb: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
    images: [
      {
        id: 10,
        slot: 25,
        src: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Urban Wheelie Action'
      },
      {
        id: 11,
        slot: 2,
        src: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'FPV Drone Alley Tracking'
      },
      {
        id: 12,
        slot: 17,
        src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: '35mm Street Optics'
      },
      {
        id: 13,
        slot: 12,
        src: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Golden Hour Sunset Highway'
      },
      {
        id: 14,
        slot: 16,
        src: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Mid-Day Asphalt Heat Distortion'
      }
    ],
    items: [
      { title: 'Final Edit', type: 'play', meta: '0:00' },
      { title: 'Alternate Cut (Instagram Reel)', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'burnout',
    title: 'BURNOUT',
    category: 'Sound Design',
    description: 'Dynamic automotive film focusing on sound design, resonant exhaust harmonics, and fast-paced rhythmic editing.',
    short: 'Sound-forward edit built around engine and tire audio.',
    thumb: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
    images: [
      {
        id: 15,
        slot: 30,
        src: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'White Highway Drift'
      },
      {
        id: 16,
        slot: 6,
        src: 'media/night-ride.jpg?v=5242',
        orientation: 'landscape',
        caption: 'Midnight Drift Friction'
      },
      {
        id: 17,
        slot: 14,
        src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Synthesizer & Audio Foley Lab'
      },
      {
        id: 18,
        slot: 4,
        src: 'media/night-ride.jpg?v=5242',
        orientation: 'landscape',
        caption: 'Analog Tape Textures'
      },
      {
        id: 19,
        slot: 9,
        src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Exhaust Firing Harmonics'
      },
      {
        id: 20,
        slot: 26,
        src: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Stadium Floodlit Tire Smoke'
      }
    ],
    items: [
      { title: 'Main Cut', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'behind-the-lens',
    title: 'BEHIND THE LENS',
    category: 'BTS',
    description: 'Documentary style behind-the-scenes film capturing camera rigging, optics, lighting setup, and production on set.',
    short: 'Behind-the-scenes look at a shoot day.',
    thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
    images: [
      {
        id: 21,
        slot: 11,
        src: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Desert Clapperboard Production'
      },
      {
        id: 22,
        slot: 3,
        src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Anamorphic Flare & Aperture Study'
      },
      {
        id: 23,
        slot: 8,
        src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Atmospheric Concrete Foley Capture'
      },
      {
        id: 24,
        slot: 21,
        src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Soundstage Lighting Architecture'
      },
      {
        id: 25,
        slot: 27,
        src: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'FX3 Rig & Wireless Transmitter'
      },
      {
        id: 26,
        slot: 28,
        src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Director Field Monitor Preview'
      }
    ],
    items: [
      { title: 'Full BTS', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'reel-2026',
    title: 'REEL 2026',
    category: 'Showreel',
    description: 'Annual highlight reel bringing together video editing, motion design, and direction into one seamless editorial sequence.',
    short: 'The full year showreel \u2014 best cuts in one edit.',
    thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
    images: [
      {
        id: 27,
        slot: 22,
        src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Neon Cinema Marquee Facade'
      },
      {
        id: 28,
        slot: 7,
        src: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Chromatic Flow Print Film Look'
      },
      {
        id: 29,
        slot: 24,
        src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: 'Kinetic Audio Reactive Titles'
      },
      {
        id: 30,
        slot: 10,
        src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        orientation: 'landscape',
        caption: '1000fps Speed Ramp Interlacing'
      }
    ],
    items: [
      { title: 'Full Reel', type: 'play', meta: '0:00' }
    ]
  }
];
