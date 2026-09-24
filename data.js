/* ===========================================================
   SRIRAM MJ — MULTIDISCIPLINARY DESIGNER
   Unified portfolio data — one file for all three disciplines:
   Video Editing · UI/UX Design · Graphic Design

   SITE object:  global identity, nav labels, about/contact text.
   PROJECTS:     every project from both former sites, fully intact,
                 plus graphic design placeholder entries (marked TODO).

   Category values used throughout:
     'Video'          — video editing / stunt riding films
     'UI/UX'          — product design & case studies
     'Graphic Design' — posters, branding, illustration

   The Index View groups by these categories automatically via the
   shared engine's .cat column.
   =========================================================== */

window.SITE = {
  name: 'Sriram MJ',
  role: 'Multidisciplinary Designer',

  /* TODO: rewrite heroLine to reflect all three disciplines */
  splashText: 'ENABLE AUDIO SOUND EXPERIENCE?',
  heroWelcome: 'Welcome',
  heroLine: 'to Sriram\u2019s world of <em>stunt riding films</em>, product design, and visual craft.',

  navLead1: 'THE', navWork: 'WORK', navLead2: 'AND', navAbout: 'ABOUT ME',
  navLead3: 'OR', navContact: 'CONTACT',
  workLabel: 'projects', singularLabel: 'project',

  soundBadgeText: 'VIEW THE WORK \u2022 VIEW THE WORK \u2022 ',

  /* ── ABOUT PAGE ───────────────────────────────────────────
     Structured for editorial Michael Gatt reference layout:
     Full-bleed media hero, Zapf-Humanist typography with inline connectors,
     stepped narrative layouts, project orbit showcase, and section indicator. */
  aboutHeadline: {
    line1: { name: 'SRIRAM', connector: 'IS A' },
    line2: { role: 'DESIGNER', connector: 'FOR', media: 'ALL MEDIA' },
    subline: [
      { connector: 'AS WELL AS', text: 'VIDEO EDITOR' },
      { connector: 'AND', text: 'VISUAL CRAFTSMAN' }
    ]
  },

  aboutBg: 'media/about-hero-bg.jpg?v=5230',
  aboutBgType: 'image',

  aboutSections: [
    {
      id: 'section-hero',
      label: 'All Media',
      eyebrow: 'SRIRAM MJ — MULTIDISCIPLINARY DESIGNER'
    },
    {
      id: 'section-foundations',
      label: 'Foundations & Rhythm',
      eyebrow: 'MEANING IN EVERY DETAIL',
      stepped: ['SRIRAM', 'BELIEVES EVERY', 'COLOR HAS', 'A STORY', 'TO TELL'],
      text: 'Sriram has a strong belief that every color carries meaning, and every element has a purpose. He pays attention to even the smallest details, often embedding meaning within the tiniest parts of his work. He creates primarily for self-satisfaction and personal expression, which makes every production a reflection of his personality, perspective, and character.',
      quote: '“My work is not just something I create; it is a reflection of who I am.”'
    },
    {
      id: 'section-interface',
      label: 'Interface Architecture',
      eyebrow: 'SYSTEMATIC INTERACTION DESIGN',
      stepped: ['STRUCTURING IDEAS', 'INTO UI/UX', 'THROUGH DIGITAL', 'ARCHITECTURE'],
      text: 'I begin by structuring the idea and breaking the work into meaningful components. This allows me to organize content, define how each element connects within the UI, and establish a clear direction before moving into design. I then execute the plan, refine the details, and continuously iterate until the final result feels clear, intentional, and complete.'
    },
    {
      id: 'section-orbit',
      label: 'Disciplines Orbit',
      eyebrow: 'DISCIPLINES & EXPERIMENTS',
      lead: 'EDITING, ARCHITECTING, AND CRAFTING ACROSS EVERY MEDIUM',
      sub: 'COMBINING HIGH-OCTANE VIDEO EDITING, SYSTEMIC PRODUCT DESIGN, AND EXPERIMENTAL TYPOGRAPHY',
      cards: ['team-never-enough', 'luminal-hr', 'burnout', 'wheelie-city']
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

  aboutIntro: 'Multidisciplinary designer practicing across video editing, UI/UX architecture, and graphic craft. Driven by kinetic pacing, atmospheric lighting, and systemic clarity.',
  aboutBio: 'With deep roots in fast-paced cinematic editing and motorcycle stunt films, Sriram MJ bridges raw visual energy with refined digital product design. Based between creative film suites and design systems Figma files, every piece of work balances high-contrast aesthetics with uncompromising precision.',

  contactText: 'For edits, designs, collabs, or the full reel \u2014 reach out.',
  contactLinks: [
    { label: 'Instagram', href: 'https://www.instagram.com/delusional.efx?stkn=MW82b2ttZW9vdnNuaw==' },
    { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/sriram-m-j-5491a7322/' },
    { label: 'Email',     href: 'mailto:srirammj221@gmail.com' }
  ]
};

window.PROJECTS = [
  {
    slug: 'team-never-enough',
    title: 'TEAM NEVER ENOUGH',
    category: 'Motorcycle Stunt Collective',
    short: 'I’ve been a fan of Team Never Enough and their unique approach to motorcycle stunt performances. I create and edit videos of their work out of genuine passion, not as a paid project. For me, it’s a way to combine my love for their work with my passion for editing and visual storytelling.',
    description: 'I’ve been a fan of Team Never Enough and their unique approach to motorcycle stunt performances. I create and edit videos of their work out of genuine passion, not as a paid project. For me, it’s a way to combine my love for their work with my passion for editing and visual storytelling.',
    moreInfo: 'Royal Enfield Guerrilla 450 edition. Precision street riding, vertical balance acrobatics, and raw visual velocity.',
    thumb: 'media/team-never-enough.jpg?v=5238',
    mediaKind: 'image',
    media: {
      type: 'image',
      src: 'media/team-never-enough.jpg?v=5238'
    },
    items: [
      { title: 'Guerrilla 450 Cut', type: 'play', meta: '0:00' },
      { title: 'Slow-Mo Vertical Stunt Reel', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'wheelie-city',
    title: 'WHEELIE CITY',
    category: 'Video',
    short: 'Urban wheelie compilation, color graded for a moody teal-orange look.',
    description: 'High energy urban stunt compilation featuring precision street riding.',
    moreInfo: 'Color graded in DaVinci Resolve.',
    thumb: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Full BTS', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'reel-2026',
    title: 'REEL 2026',
    category: 'Video',
    short: 'The full year showreel \u2014 best cuts in one edit.',
    description: 'Annual highlight reel bringing together video editing, motion design, and direction.',
    thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Full Reel', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'luminal-hr',
    title: 'LUMINAL HR',
    category: 'UI/UX',
    short: 'An HRIS dashboard for a 500-person company \u2014 three personas, one system.',
    description: 'Luminal HR is a Human Resource Information System designed for a mid-sized company.',
    moreInfo: 'Process: problem analysis \u2192 user flows \u2192 high-fidelity Figma UI.',
    thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
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
    thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      { title: 'Title Reel', type: 'play', meta: '0:00' }
    ]
  },
  {
    slug: 'tne-guerrilla-cut',
    title: 'TNE — GUERRILLA 450 CUT',
    category: 'Motorcycle Stunt Collective',
    short: 'Action still from the vertical balance acrobatic series on the Royal Enfield Guerrilla 450.',
    description: 'High-speed street precision stunts and balance acrobatics by Team Never Enough.',
    thumb: 'media/tne-poster.jpg?v=5241',
    mediaKind: 'image',
    targetSlug: 'team-never-enough'
  },
  {
    slug: 'night-drift',
    title: 'NIGHT DRIFT',
    category: 'Video',
    short: 'Midnight automotive drift reel with heavy analog sound textures.',
    description: 'Moody midnight drift film highlighting visceral tire friction and engine growl.',
    thumb: 'media/night-ride.jpg?v=5241',
    mediaKind: 'image',
    targetSlug: 'burnout'
  },
  {
    slug: 'stunt-telemetry',
    title: 'STUNT TELEMETRY',
    category: 'UI/UX',
    short: 'Real-time telemetry HUD overlay for high-velocity stunt analytics.',
    description: 'Telemetry dashboard capturing lean angle, velocity curves, and vertical balance points.',
    thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'team-never-enough'
  },
  {
    slug: 'urban-velocity',
    title: 'URBAN VELOCITY',
    category: 'Video',
    short: 'FPV drone tracking through narrow alleys and elevated highway lines.',
    description: 'High-speed FPV tracking cut focusing on spatial rhythm and kinetic motion.',
    thumb: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'wheelie-city'
  },
  {
    slug: 'sound-design-lab',
    title: 'SOUND DESIGN LAB',
    category: 'Sound Design',
    short: 'Sub-bass harmonics, granular synthesizer patches, and industrial mechanical Foley.',
    description: 'Experimental audio design laboratory showcasing layered Foley and synthesized drones.',
    thumb: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'burnout'
  },
  {
    slug: 'aperture-study',
    title: 'APERTURE STUDY',
    category: 'Cinematography',
    short: 'Color density and depth of field experiments on anamorphic glass.',
    description: 'Technical visual exploration of optical aberrations and anamorphic flare rendering.',
    thumb: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'behind-the-lens'
  },
  {
    slug: 'chromatic-flow',
    title: 'CHROMATIC FLOW',
    category: 'Color Grading',
    short: 'Film-emulation color palette exploration with rich amber shadows.',
    description: 'DaVinci Resolve print-film look development featuring custom LUT curves.',
    thumb: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'reel-2026'
  },
  {
    slug: 'slowmo-mechanics',
    title: 'SLOW-MO MECHANICS',
    category: 'Motorcycle Stunt Collective',
    short: '120fps high-frame-rate breakdown of suspension compression and balance locks.',
    description: 'Detailed physical examination of balance physics and stunt riding acrobatics.',
    thumb: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'team-never-enough'
  },
  {
    slug: 'telemetry-dashboard',
    title: 'TELEMETRY DASHBOARD',
    category: 'UI/UX',
    short: 'Data dense performance dashboard designed for high-refresh telemetry displays.',
    description: 'Enterprise telemetry design system prioritizing instant cognitive clarity under pressure.',
    thumb: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'luminal-hr'
  },
  {
    slug: 'atmospheric-foley',
    title: 'ATMOSPHERIC FOLEY',
    category: 'Sound Design',
    short: 'Field recording acoustic captures in brutalist concrete architectures.',
    description: 'Environmental acoustic sampling exploring natural reverberation in empty spaces.',
    thumb: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'behind-the-lens'
  },
  {
    slug: 'street-optics',
    title: 'STREET OPTICS',
    category: 'Photography',
    short: 'Raw 35mm monochrome candid captures across urban transit hubs.',
    description: 'Monochrome documentary photography focusing on natural light, geometry, and human gesture.',
    thumb: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'cinema-stills'
  },
  {
    slug: 'lighting-architecture',
    title: 'LIGHTING ARCHITECTURE',
    category: 'Cinematography',
    short: 'Volumetric haze and negative fill studies on soundstage sets.',
    description: 'Studio lighting architecture diagrams and practical fixture placement study.',
    thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'behind-the-lens'
  },
  {
    slug: 'kinetic-titles',
    title: 'KINETIC TITLES',
    category: 'Motion Design',
    short: 'Typographic title sequences with variable font interpolation and displacement.',
    description: 'Modern title sequences driven by audio transients and variable font physics.',
    thumb: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'motion-graphics'
  },
  {
    slug: 'raw-velocity',
    title: 'RAW VELOCITY',
    category: 'Motorcycle Stunt Collective',
    short: 'Uncut street riding audio track paired with raw, authentic visual pacing.',
    description: 'Raw engine notes, tire screech, and unfiltered visual velocity from Team Never Enough.',
    thumb: 'media/tne-poster.jpg?v=5241',
    mediaKind: 'image',
    targetSlug: 'team-never-enough'
  }
];
