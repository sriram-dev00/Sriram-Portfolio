import { SiteConfig, Project, TileLayout } from '../types/portfolio';

export const SITE_CONFIG: SiteConfig = {
  name: 'Sriram MJ',
  role: 'Multidisciplinary Designer',

  splashText: 'ENABLE AUDIO SOUND EXPERIENCE?',
  heroWelcome: 'Welcome',
  heroLine: 'to Sriram’s world of <em>stunt riding films</em>, product design, and visual craft.',

  navLead1: 'THE',
  navWork: 'WORK',
  navLead2: 'AND',
  navAbout: 'ABOUT ME',
  navLead3: 'OR',
  navContact: 'CONTACT',
  workLabel: 'projects',
  singularLabel: 'project',

  soundBadgeText: 'VIEW THE WORK • VIEW THE WORK • ',

  aboutHeadline: 'SRIRAM IS A DESIGNER FOR ALL MEDIA AS WELL AS VIDEO EDITOR AND VISUAL CRAFTSMAN',
  aboutHeroSubtitle: 'VISUAL CRAFTSMAN',
  aboutBg: '/media/about-hero-bg.jpg',

  aboutIntro: 'Multidisciplinary designer practicing across video editing, UI/UX architecture, and graphic craft. Driven by kinetic pacing, atmospheric lighting, and systemic clarity.',
  aboutBio: 'With deep roots in fast-paced cinematic editing and motorcycle stunt films, Sriram MJ bridges raw visual energy with refined digital product design. Based between creative film suites and design systems Figma files, every piece of work balances high-contrast aesthetics with uncompromising precision.',

  sections: [
    {
      id: 'section-hero',
      label: 'All Media',
      eyebrow: 'SRIRAM MJ — MULTIDISCIPLINARY DESIGNER'
    },
    {
      id: 'section-foundations',
      label: 'Foundations & Rhythm',
      eyebrow: 'EARLY CRAFT & PACING',
      stepped: ['SRIRAM', 'BEGAN', 'CRAFTING', 'AND EDITING', 'STORIES', 'FROM DAY ONE'],
      text: 'Starting in the high-adrenaline world of stunt riding films and kinetic cinematography, Sriram developed an instinctive feel for visual velocity, frame-by-frame rhythm, and atmospheric color grading. Every cut is engineered with sound, tension, and narrative momentum.'
    },
    {
      id: 'section-interface',
      label: 'Interface Architecture',
      eyebrow: 'SYSTEMATIC INTERACTION DESIGN',
      stepped: ['BRIDGING', 'RAW KINETIC CINEMA', 'WITH SYSTEMATIC', 'DIGITAL ARCHITECTURE'],
      text: 'Translating cinematic motion into cohesive digital experiences. From complex enterprise design systems to intuitive mobile applications, Sriram treats interface design as living choreography — where hierarchy, micro-interactions, and visual craftsmanship merge seamlessly.'
    },
    {
      id: 'section-orbit',
      label: 'Disciplines Orbit',
      eyebrow: 'DISCIPLINES & EXPERIMENTS',
      lead: 'EDITING, ARCHITECTING, AND CRAFTING ACROSS EVERY MEDIUM',
      sub: 'COMBINING HIGH-OCTANE VIDEO EDITING, SYSTEMIC PRODUCT DESIGN, AND EXPERIMENTAL TYPOGRAPHY',
      cards: ['night-ride', 'luminal-hr', 'burnout', 'wheelie-city', 'behind-the-lens', 'reel-2026']
    },
    {
      id: 'section-socials',
      label: 'Outreach & Connect',
      eyebrow: 'COLLABORATIONS',
      lead: 'FOR MORE UPDATES & SELECT WORKS',
      sublead: 'FOLLOW SRIRAM ON',
      socials: [
        { label: 'INSTAGRAM', url: 'https://www.instagram.com/delusional.efx?stkn=MW82b2ttZW9vdnNuaw==' },
        { label: 'LINKEDIN', url: 'https://www.linkedin.com/in/sriram-m-j-5491a7322/' },
        { label: 'EMAIL', url: 'mailto:srirammj221@gmail.com' }
      ]
    }
  ],

  contactText: 'For edits, designs, collabs, or the full reel — reach out.',
  contactLinks: [
    { label: 'Instagram', href: 'https://www.instagram.com/delusional.efx?stkn=MW82b2ttZW9vdnNuaw==' },
    { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/sriram-m-j-5491a7322/' },
    { label: 'Email',     href: 'mailto:srirammj221@gmail.com' }
  ]
};

export const PROJECTS: Project[] = [
  {
    slug: 'night-ride',
    title: 'NIGHT RIDE',
    category: 'Video',
    short: 'A night stunt run cut to a driving score.',
    description: 'A cinematic night stunt motorcycle run color graded with dark moody tones.',
    moreInfo: 'Shot on Sony FX3 with anamorphic lenses.',
    thumb: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Main Cut', type: 'play', meta: '0:00' },
      { title: 'Slow-Mo Highlight Reel', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'wheelie-city',
    title: 'WHEELIE CITY',
    category: 'Video',
    short: 'Urban wheelie compilation, color graded for a moody teal-orange look.',
    description: 'High energy urban stunt compilation featuring precision street riding.',
    moreInfo: 'Color graded in DaVinci Resolve.',
    thumb: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Final Edit', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'burnout',
    title: 'BURNOUT',
    category: 'Video',
    short: 'Sound-forward edit built around engine and tire audio.',
    description: 'Dynamic automotive film focusing on sound design and fast-paced rhythmic editing.',
    thumb: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Main Cut', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'behind-the-lens',
    title: 'BEHIND THE LENS',
    category: 'Video',
    short: 'Behind-the-scenes look at a shoot day.',
    description: 'Documentary style behind-the-scenes film capturing the creative process on set.',
    thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Full BTS', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'reel-2026',
    title: 'REEL 2026',
    category: 'Video',
    short: 'The full year showreel — best cuts in one edit.',
    description: 'Annual highlight reel bringing together video editing, motion design, and direction.',
    thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Full Reel', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'luminal-hr',
    title: 'LUMINAL HR',
    category: 'UI/UX',
    short: 'An HRIS dashboard for a 500-person company — three personas, one system.',
    description: 'Luminal HR is a Human Resource Information System designed for a mid-sized company.',
    moreInfo: 'Process: problem analysis → user flows → high-fidelity Figma UI.',
    thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'HR Admin Dashboard', type: 'view', meta: 'Figma' }
    ]
  },
  {
    slug: 'hr-admin-flow',
    title: 'HR ADMIN FLOW',
    category: 'UI/UX',
    short: 'How an HR admin manages policy, compliance, and headcount.',
    description: 'Comprehensive administrative UI workflow covering employee records and compliance.',
    thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Journey Map', type: 'view', meta: 'Figma' }
    ]
  },
  {
    slug: 'manager-flow',
    title: 'MANAGER FLOW',
    category: 'UI/UX',
    short: 'Overseeing team performance, leave, and hiring in one view.',
    description: 'Clean manager overview portal balancing quick actions and team telemetry.',
    thumb: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Journey Map', type: 'view', meta: 'Figma' }
    ]
  },
  {
    slug: 'employee-flow',
    title: 'EMPLOYEE FLOW',
    category: 'UI/UX',
    short: 'Self-service profile, leave requests, and career growth.',
    description: 'Mobile-first self service interface designed for seamless employee onboarding.',
    thumb: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Journey Map', type: 'view', meta: 'Figma' }
    ]
  },
  {
    slug: 'poster-series',
    title: 'POSTER SERIES',
    category: 'Graphic Design',
    short: 'A set of typographic event posters.',
    description: 'Experimental typographic poster series exploring brutalist grid layouts and film stills.',
    thumb: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Poster 01', type: 'view', meta: 'PNG' }
    ]
  },
  {
    slug: 'brand-identity',
    title: 'BRAND IDENTITY',
    category: 'Graphic Design',
    short: 'Logo, color system, and type stack for a modern brand.',
    description: 'Minimalist brand identity system including typography, stationery, and packaging.',
    thumb: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Logo & Marks', type: 'view', meta: 'PDF' }
    ]
  },
  {
    slug: 'illustration-set',
    title: 'ILLUSTRATION SET',
    category: 'Graphic Design',
    short: 'Digital illustrations and vector artwork.',
    description: 'Curated gallery of vector artwork and digital illustrations.',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Illustration 01', type: 'view', meta: 'SVG' }
    ]
  },
  {
    slug: 'cinema-stills',
    title: 'CINEMA STILLS',
    category: 'Video',
    short: 'Frame grabs and color study from cinematic projects.',
    description: 'A curated selection of high-resolution stills from 35mm and digital film shoots.',
    thumb: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: '35mm Stills', type: 'view', meta: 'PNG' }
    ]
  },
  {
    slug: 'interface-craft',
    title: 'INTERFACE CRAFT',
    category: 'UI/UX',
    short: 'Design system components and micro-interactions.',
    description: 'Comprehensive UI kit focusing on dynamic layout grids and interactive micro-animations.',
    thumb: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'UI Kit', type: 'view', meta: 'Figma' }
    ]
  },
  {
    slug: 'editorial-layout',
    title: 'EDITORIAL LAYOUT',
    category: 'Graphic Design',
    short: 'Print magazine layout and typography exploration.',
    description: 'Minimalist editorial spread design using high-contrast serif typography.',
    thumb: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Magazine Spread', type: 'view', meta: 'PDF' }
    ]
  },
  {
    slug: 'motion-graphics',
    title: 'MOTION GRAPHICS',
    category: 'Video',
    short: '3D title sequences and kinetic typography.',
    description: 'Kinetic title sequence and procedural motion design graphics.',
    thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=75&w=450&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Title Reel', type: 'play', meta: '0:00' }
    ]
  }
];

export const TILE_LAYOUTS: TileLayout[] = [
  { x: -920, y: -20,  w: 240, h: 360, zPx: 180,  rx: 1.5,  ry: -5.5, rz: -1.5, sizeClass: 'large' },
  { x: -320, y: -220, w: 280, h: 180, zPx: 120,  rx: -2.0, ry: 2.5,  rz: 1.2,  sizeClass: 'medium' },
  { x: 380,  y: -230, w: 290, h: 190, zPx: 140,  rx: -2.5, ry: -3.5, rz: -1.8, sizeClass: 'medium' },
  { x: -360, y: 220,  w: 280, h: 185, zPx: 150,  rx: 2.0,  ry: 2.2,  rz: 1.0,  sizeClass: 'medium' },
  { x: 40,   y: 250,  w: 250, h: 190, zPx: 110,  rx: 2.0,  ry: -1.0, rz: -0.5, sizeClass: 'medium' },
  { x: 490,  y: -80,  w: 160, h: 115, zPx: -60,  rx: 2.5,  ry: -3.0, rz: -1.5, sizeClass: 'small' },
  { x: 740,  y: 110,  w: 180, h: 130, zPx: 60,   rx: -1.8, ry: -4.5, rz: 1.2,  sizeClass: 'small' },
  { x: -550, y: 290,  w: 140, h: 170, zPx: 30,   rx: 2.8,  ry: 4.5,  rz: -1.8, sizeClass: 'small' },
  { x: -620, y: -230, w: 130, h: 95,  zPx: -220, rx: 1.8,  ry: 3.5,  rz: -1.0, sizeClass: 'small' },
  { x: 360,  y: 350,  w: 150, h: 180, zPx: 50,   rx: 2.0,  ry: -2.8, rz: -1.0, sizeClass: 'small' },
  { x: 70,   y: -320, w: 120, h: 90,  zPx: -250, rx: -1.2, ry: 1.2,  rz: 0.8,  sizeClass: 'small' },
  { x: -160, y: 340,  w: 140, h: 100, zPx: -120, rx: 2.2,  ry: -2.8, rz: -1.5, sizeClass: 'small' },
  { x: -330, y: -380, w: 140, h: 95,  zPx: -200, rx: -2.5, ry: 3.0,  rz: 1.2,  sizeClass: 'small' },
  { x: -880, y: -340, w: 150, h: 105, zPx: -180, rx: -2.2, ry: 4.8,  rz: 1.5,  sizeClass: 'small' },
  { x: 860,  y: -330, w: 150, h: 105, zPx: -190, rx: 2.6,  ry: -4.8, rz: -1.5, sizeClass: 'small' },
  { x: 780,  y: 280,  w: 140, h: 100, zPx: -80,  rx: 2.5,  ry: -4.2, rz: -1.5, sizeClass: 'small' }
];

export const SPACE_CONFIG = {
  REF_WIDTH: 5760,
  REF_HEIGHT: 3100,
  REF_ASPECT: 5760 / 3100,
  REF_MOBILE_WIDTH: 2137,
  REF_MOBILE_HEIGHT: 1644,
  REF_MOBILE_ASPECT: 2137 / 1644,
  CONCAVE_CURVE_STRENGTH: 180,
  PITCH_COEFF: 5.5,
  YAW_COEFF: -9.5,
  HOVER_INTENT_DELAY: 25,
  HOVER_EXIT_DELAY: 60,
  TILE_REST_BRIGHTNESS: 0.55,
  TILE_REST_SATURATE: 0.75,
  CAMERA_LERP: 0.045
};
