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
      cards: ['team-never-enough', 'luminal-hr', 'burnout', 'graphical-design']
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
    slot: 1,
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
      {
        title: "Guerrilla 450 Cut",
        type: "play",
        meta: "0:00",
        src: "media/team-never-enough.jpg",
        thumb: "media/team-never-enough.jpg",
        url: "#"
      },
      {
        title: "Slow-Mo Vertical Stunt Reel",
        type: "play",
        meta: "0:00",
        src: "media/tne-poster.jpg",
        thumb: "media/tne-poster.jpg",
        url: "#"
      }
    ]
  },
  {
    slug: 'graphical-design',
    slot: 30,
    title: 'GRAPHICAL DESIGN',
    category: 'Graphic Design',
    short: 'Extensive portfolio of commercial print banners, typography posters, event creatives, and branding signage.',
    description: 'Comprehensive showcase of professional graphic design work spanning medical clinic branding, corporate events, retail inaugurations, festival creatives, and large-format architectural signage.',
    moreInfo: 'Designed across Adobe Illustrator, Photoshop, and InDesign. Featuring 43 production-ready posters, vinyl signage, banners, and editorial compositions.',
    thumb: 'Graphical designs/thumbs/Shiphakala-Panchamuga Vinayagar Poster.jpg.jpg',
    mediaKind: 'image',
    media: {
      type: 'image',
      src: 'Graphical designs/web/Shiphakala-Panchamuga Vinayagar Poster.jpg.jpg'
    },
    items: [
      {
        title: '4x1 Dermal Fillers Consultation Room 4',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/4x1 Dermal Fillers Consultation Room 4.jpg.jpg',
        thumb: 'Graphical designs/thumbs/4x1 Dermal Fillers Consultation Room 4.jpg.jpg',
        url: 'Graphical designs/4x1 Dermal Fillers Consultation Room 4.jpg.jpeg'
      },
      {
        title: '4x1 Microneedling Consultation Room (2)',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/4x1 Microneedling Consultation Room (2).jpg.jpg',
        thumb: 'Graphical designs/thumbs/4x1 Microneedling Consultation Room (2).jpg.jpg',
        url: 'Graphical designs/4x1 Microneedling Consultation Room (2).jpg.jpeg'
      },
      {
        title: '4x1 Vinayl Consultation Room 2.1',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/4x1 Vinayl Consultation Room 2.1.jpg.jpg',
        thumb: 'Graphical designs/thumbs/4x1 Vinayl Consultation Room 2.1.jpg.jpg',
        url: 'Graphical designs/4x1 Vinayl Consultation Room 2.1.jpg.jpeg'
      },
      {
        title: '4x1.5 Vinyl Consultation Room (2)',
        type: 'view',
        meta: 'SIGNAGE',
        src: 'Graphical designs/web/4x1.5 Vinyl Consultation Room (2).jpg.jpg',
        thumb: 'Graphical designs/thumbs/4x1.5 Vinyl Consultation Room (2).jpg.jpg',
        url: 'Graphical designs/4x1.5 Vinyl Consultation Room (2).jpg.jpeg'
      },
      {
        title: '4x1.5 Vinyl Consultation Room 02',
        type: 'view',
        meta: 'SIGNAGE',
        src: 'Graphical designs/web/4x1.5 Vinyl Consultation Room 02.jpg.jpg',
        thumb: 'Graphical designs/thumbs/4x1.5 Vinyl Consultation Room 02.jpg.jpg',
        url: 'Graphical designs/4x1.5 Vinyl Consultation Room 02.jpg.jpeg'
      },
      {
        title: '4x1.5 Vinyl Consultation Room 2.1',
        type: 'view',
        meta: 'SIGNAGE',
        src: 'Graphical designs/web/4x1.5 Vinyl Consultation Room 2.1.jpg.jpg',
        thumb: 'Graphical designs/thumbs/4x1.5 Vinyl Consultation Room 2.1.jpg.jpg',
        url: 'Graphical designs/4x1.5 Vinyl Consultation Room 2.1.jpg.jpeg'
      },
      {
        title: '4x3 Vinyl Glass',
        type: 'view',
        meta: 'SIGNAGE',
        src: 'Graphical designs/web/4x3 Vinyl Glass.jpg.jpg',
        thumb: 'Graphical designs/thumbs/4x3 Vinyl Glass.jpg.jpg',
        url: 'Graphical designs/4x3 Vinyl Glass.jpg.jpeg'
      },
      {
        title: '4x6 IIACT Aesthetic Medicine Course 2',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/4x6 IIACT Aesthetic Medicine Course 2.jpg.jpg',
        thumb: 'Graphical designs/thumbs/4x6 IIACT Aesthetic Medicine Course 2.jpg.jpg',
        url: 'Graphical designs/4x6 IIACT Aesthetic Medicine Course 2.jpg.jpeg'
      },
      {
        title: '8X4 Vinyl Foam',
        type: 'view',
        meta: 'SIGNAGE',
        src: 'Graphical designs/web/8X4 Vinyl Foam.jpg.jpg',
        thumb: 'Graphical designs/thumbs/8X4 Vinyl Foam.jpg.jpg',
        url: 'Graphical designs/8X4 Vinyl Foam.jpg.jpeg'
      },
      {
        title: 'Aazhira Diwali Special Offer',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Aazhira Diwali Special Offer.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Aazhira Diwali Special Offer.jpg.jpg',
        url: 'Graphical designs/Aazhira Diwali Special Offer.jpg.jpeg'
      },
      {
        title: 'Annam Trust & Pollachi Sandhippu Grand Occation Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Annam Trust & Pollachi Sandhippu Grand Occation Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Annam Trust & Pollachi Sandhippu Grand Occation Poster.jpg.jpg',
        url: 'Graphical designs/Annam Trust & Pollachi Sandhippu Grand Occation Poster.jpg.jpeg'
      },
      {
        title: 'Annam Trust & Pollachi Sandhippu Poster (2)',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Annam Trust & Pollachi Sandhippu Poster (2).jpg.jpg',
        thumb: 'Graphical designs/thumbs/Annam Trust & Pollachi Sandhippu Poster (2).jpg.jpg',
        url: 'Graphical designs/Annam Trust & Pollachi Sandhippu Poster (2).jpg.jpeg'
      },
      {
        title: 'BB Glow and Microneedling Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/BB Glow and Microneedling Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/BB Glow and Microneedling Poster.jpg.jpg',
        url: 'Graphical designs/BB Glow and Microneedling Poster.jpg.jpeg'
      },
      {
        title: 'Chemical Peel Workshop Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Chemical Peel Workshop Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Chemical Peel Workshop Poster.jpg.jpg',
        url: 'Graphical designs/Chemical Peel Workshop Poster.jpg.jpeg'
      },
      {
        title: 'Clinical Cosmetology Poster 01.1',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Clinical Cosmetology Poster 01.1.jpg',
        thumb: 'Graphical designs/thumbs/Clinical Cosmetology Poster 01.1.jpg',
        url: 'Graphical designs/Clinical Cosmetology Poster 01.1.png'
      },
      {
        title: 'Facial Aesthetics & Cosmetology 01',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Facial Aesthetics & Cosmetology 01.jpg',
        thumb: 'Graphical designs/thumbs/Facial Aesthetics & Cosmetology 01.jpg',
        url: 'Graphical designs/Facial Aesthetics & Cosmetology 01.png'
      },
      {
        title: 'Fair & Face PRP Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Fair & Face PRP Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Fair & Face PRP Poster.jpg.jpg',
        url: 'Graphical designs/Fair & Face PRP Poster.jpg.jpeg'
      },
      {
        title: 'Freshh Ayudha Puja Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Freshh Ayudha Puja Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Freshh Ayudha Puja Poster.jpg.jpg',
        url: 'Graphical designs/Freshh Ayudha Puja Poster.jpg.jpeg'
      },
      {
        title: 'Freshh Diwali Poster 02',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Freshh Diwali Poster 02.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Freshh Diwali Poster 02.jpg.jpg',
        url: 'Graphical designs/Freshh Diwali Poster 02.jpg.jpeg'
      },
      {
        title: 'Freshh Ganesh Chaturthi Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Freshh Ganesh Chaturthi Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Freshh Ganesh Chaturthi Poster.jpg.jpg',
        url: 'Graphical designs/Freshh Ganesh Chaturthi Poster.jpg.jpeg'
      },
      {
        title: 'Freshh Krishna Jeyanti Poster 03',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Freshh Krishna Jeyanti Poster 03.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Freshh Krishna Jeyanti Poster 03.jpg.jpg',
        url: 'Graphical designs/Freshh Krishna Jeyanti Poster 03.jpg.jpeg'
      },
      {
        title: 'Hair & Face Meso Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Hair & Face Meso Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Hair & Face Meso Poster.jpg.jpg',
        url: 'Graphical designs/Hair & Face Meso Poster.jpg.jpeg'
      },
      {
        title: 'Hair Transplant 1.1',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Hair Transplant 1.1.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Hair Transplant 1.1.jpg.jpg',
        url: 'Graphical designs/Hair Transplant 1.1.jpg.jpeg'
      },
      {
        title: 'Hydra Facial & Dermabrasion',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Hydra Facial & Dermabrasion.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Hydra Facial & Dermabrasion.jpg.jpg',
        url: 'Graphical designs/Hydra Facial & Dermabrasion.jpg.jpeg'
      },
      {
        title: 'Hydra Facial Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Hydra Facial Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Hydra Facial Poster.jpg.jpg',
        url: 'Graphical designs/Hydra Facial Poster.jpg.jpeg'
      },
      {
        title: 'IIACT 35x48inch Sticker (2)',
        type: 'view',
        meta: 'STICKER',
        src: 'Graphical designs/web/IIACT 35x48inch Sticker (2).jpg.jpg',
        thumb: 'Graphical designs/thumbs/IIACT 35x48inch Sticker (2).jpg.jpg',
        url: 'Graphical designs/IIACT 35x48inch Sticker (2).jpg.jpeg'
      },
      {
        title: 'IIACT 35x48inch Sticker 2.1',
        type: 'view',
        meta: 'STICKER',
        src: 'Graphical designs/web/IIACT 35x48inch Sticker 2.1.jpg.jpg',
        thumb: 'Graphical designs/thumbs/IIACT 35x48inch Sticker 2.1.jpg.jpg',
        url: 'Graphical designs/IIACT 35x48inch Sticker 2.1.jpg.jpeg'
      },
      {
        title: 'IIACT 6x4 ft Banner',
        type: 'view',
        meta: 'BANNER',
        src: 'Graphical designs/web/IIACT 6x4 ft Banner.jpg.jpg',
        thumb: 'Graphical designs/thumbs/IIACT 6x4 ft Banner.jpg.jpg',
        url: 'Graphical designs/IIACT 6x4 ft Banner.jpg.jpeg'
      },
      {
        title: 'IIACT 72X44 In Aesthetic Medicine Course 2',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/IIACT 72X44 In Aesthetic Medicine Course 2.jpg.jpg',
        thumb: 'Graphical designs/thumbs/IIACT 72X44 In Aesthetic Medicine Course 2.jpg.jpg',
        url: 'Graphical designs/IIACT 72X44 In Aesthetic Medicine Course 2.jpg.jpeg'
      },
      {
        title: 'IIACT 72X44 In Aesthetic Medicine Course',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/IIACT 72X44 In Aesthetic Medicine Course.jpg.jpg',
        thumb: 'Graphical designs/thumbs/IIACT 72X44 In Aesthetic Medicine Course.jpg.jpg',
        url: 'Graphical designs/IIACT 72X44 In Aesthetic Medicine Course.jpg.jpeg'
      },
      {
        title: 'IIACT Facebook Cover Image (2)',
        type: 'view',
        meta: 'EDITORIAL',
        src: 'Graphical designs/web/IIACT Facebook Cover Image (2).jpg.jpg',
        thumb: 'Graphical designs/thumbs/IIACT Facebook Cover Image (2).jpg.jpg',
        url: 'Graphical designs/IIACT Facebook Cover Image (2).jpg.jpeg'
      },
      {
        title: 'Kanthi Properties 2x3ft 6 Banner',
        type: 'view',
        meta: 'BANNER',
        src: 'Graphical designs/web/Kanthi Properties 2x3ft 6 Banner.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Kanthi Properties 2x3ft 6 Banner.jpg.jpg',
        url: 'Graphical designs/Kanthi Properties 2x3ft 6 Banner.jpg.jpeg'
      },
      {
        title: 'Kanthi Properties Campaign Poster   Copy',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Kanthi Properties Campaign Poster - Copy.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Kanthi Properties Campaign Poster - Copy.jpg.jpg',
        url: 'Graphical designs/Kanthi Properties Campaign Poster - Copy.jpg.jpeg'
      },
      {
        title: 'Kulali Collections Grand Opening Poster 2',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Kulali Collections Grand Opening Poster 2.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Kulali Collections Grand Opening Poster 2.jpg.jpg',
        url: 'Graphical designs/Kulali Collections Grand Opening Poster 2.jpg.jpeg'
      },
      {
        title: 'kurumbada potti director',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/kurumbada potti director.jpg.jpg',
        thumb: 'Graphical designs/thumbs/kurumbada potti director.jpg.jpg',
        url: 'Graphical designs/kurumbada potti director.jpg.jpeg'
      },
      {
        title: 'New Year Poster 02 With.F',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/New Year Poster 02 With.F.jpg.jpg',
        thumb: 'Graphical designs/thumbs/New Year Poster 02 With.F.jpg.jpg',
        url: 'Graphical designs/New Year Poster 02 With.F.jpg.jpeg'
      },
      {
        title: 'PRP Treatment 1.1',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/PRP Treatment 1.1.jpg.jpg',
        thumb: 'Graphical designs/thumbs/PRP Treatment 1.1.jpg.jpg',
        url: 'Graphical designs/PRP Treatment 1.1.jpg.jpeg'
      },
      {
        title: 'RUKS Magazine Quarter Page (2)',
        type: 'view',
        meta: 'EDITORIAL',
        src: 'Graphical designs/web/RUKS-Magazine Quarter Page (2).jpg.jpg',
        thumb: 'Graphical designs/thumbs/RUKS-Magazine Quarter Page (2).jpg.jpg',
        url: 'Graphical designs/RUKS-Magazine Quarter Page (2).jpg.jpeg'
      },
      {
        title: 'Saathanaiyaalargalin Sangamam 2',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Saathanaiyaalargalin Sangamam 2.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Saathanaiyaalargalin Sangamam 2.jpg.jpg',
        url: 'Graphical designs/Saathanaiyaalargalin Sangamam 2.jpg.jpeg'
      },
      {
        title: 'Shiphakala Panchamuga Vinayagar Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Shiphakala-Panchamuga Vinayagar Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Shiphakala-Panchamuga Vinayagar Poster.jpg.jpg',
        url: 'Graphical designs/Shiphakala-Panchamuga Vinayagar Poster.jpg.jpeg'
      },
      {
        title: 'Summer Tennis Coaching 2025 2',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Summer Tennis Coaching 2025 2.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Summer Tennis Coaching 2025 2.jpg.jpg',
        url: 'Graphical designs/Summer Tennis Coaching 2025 2.jpg.jpeg'
      },
      {
        title: 'Tennis Coaching Poster 02',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Tennis Coaching Poster 02.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Tennis Coaching Poster 02.jpg.jpg',
        url: 'Graphical designs/Tennis Coaching Poster 02.jpg.jpeg'
      },
      {
        title: 'Tennis Coaching Poster 03',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Tennis Coaching Poster 03.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Tennis Coaching Poster 03.jpg.jpg',
        url: 'Graphical designs/Tennis Coaching Poster 03.jpg.jpeg'
      }
    ]
  },
  {
    slug: 'burnout',
    slot: 13,
    title: 'BURNOUT',
    category: 'Video',
    short: 'Sound-forward edit built around engine and tire audio.',
    description: 'Dynamic automotive film focusing on sound design and fast-paced rhythmic editing.',
    thumb: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      {
        title: "Main Cut",
        type: "play",
        meta: "0:00",
        src: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop",
        thumb: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop",
        url: "#"
      }
    ]
  },
  {
    slug: 'behind-the-lens',
    slot: 25,
    title: 'BEHIND THE LENS',
    category: 'Video',
    short: 'Behind-the-scenes look at a shoot day.',
    description: 'Documentary style behind-the-scenes film capturing the creative process on set.',
    thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      {
        title: "Full BTS",
        type: "play",
        meta: "0:00",
        src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
        thumb: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
        url: "#"
      }
    ]
  },
  {
    slug: 'reel-2026',
    slot: 12,
    title: 'REEL 2026',
    category: 'Video',
    short: 'The full year showreel — best cuts in one edit.',
    description: 'Annual highlight reel bringing together video editing, motion design, and direction.',
    thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      {
        title: "Full Reel",
        type: "play",
        meta: "0:00",
        src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
        thumb: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
        url: "#"
      }
    ]
  },
  {
    slug: 'luminal-hr',
    slot: 27,
    title: 'LUMINAL HR',
    category: 'UI/UX',
    short: 'An HRIS dashboard for a 500-person company — three personas, one system.',
    description: 'Luminal HR is a Human Resource Information System designed for a mid-sized company.',
    moreInfo: 'Process: problem analysis → user flows → high-fidelity Figma UI.',
    thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      {
        title: "HR Admin Dashboard",
        type: "view",
        meta: "Figma",
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        url: "#"
      }
    ]
  },
  {
    slug: 'hr-admin-flow',
    slot: 7,
    title: 'HR ADMIN FLOW',
    category: 'UI/UX',
    short: 'How an HR admin manages policy, compliance, and headcount.',
    description: 'Comprehensive administrative UI workflow covering employee records and compliance.',
    thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      {
        title: "Journey Map",
        type: "view",
        meta: "Figma",
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        thumb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        url: "#"
      }
    ]
  },
  {
    slug: 'manager-flow',
    slot: 28,
    title: 'MANAGER FLOW',
    category: 'UI/UX',
    short: 'Overseeing team performance, leave, and hiring in one view.',
    description: 'Clean manager overview portal balancing quick actions and team telemetry.',
    thumb: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      {
        title: "Journey Map",
        type: "view",
        meta: "Figma",
        src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
        thumb: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
        url: "#"
      }
    ]
  },
  {
    slug: 'employee-flow',
    slot: 20,
    title: 'EMPLOYEE FLOW',
    category: 'UI/UX',
    short: 'Self-service profile, leave requests, and career growth.',
    description: 'Mobile-first self service interface designed for seamless employee onboarding.',
    thumb: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      {
        title: "Journey Map",
        type: "view",
        meta: "Figma",
        src: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop",
        thumb: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop",
        url: "#"
      }
    ]
  },
  {
    slug: 'poster-series',
    slot: 10,
    title: 'GRAPHICAL DESIGN',
    category: 'Graphic Design',
    short: 'Commercial print banners, typography posters, event creatives, and branding signage.',
    description: 'Comprehensive showcase of professional graphic design work spanning medical clinic branding, corporate events, retail inaugurations, festival creatives, and large-format architectural signage.',
    thumb: 'Graphical designs/thumbs/Summer Tennis Coaching 2025 2.jpg.jpg',
    mediaKind: 'image',
    items: [
      {
        title: 'Summer Tennis Coaching 2025 Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Summer Tennis Coaching 2025 2.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Summer Tennis Coaching 2025 2.jpg.jpg',
        url: 'Graphical designs/Summer Tennis Coaching 2025 2.jpg.jpeg'
      },
      {
        title: 'Kurumbada Potti Short Film Poster',
        type: 'view',
        meta: 'CINEMA',
        src: 'Graphical designs/web/kurumbada potti director.jpg.jpg',
        thumb: 'Graphical designs/thumbs/kurumbada potti director.jpg.jpg',
        url: 'Graphical designs/kurumbada potti director.jpg.jpeg'
      },
      {
        title: 'Saathanaiyaalargalin Sangamam Event Poster',
        type: 'view',
        meta: 'EVENT',
        src: 'Graphical designs/web/Saathanaiyaalargalin Sangamam 2.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Saathanaiyaalargalin Sangamam 2.jpg.jpg',
        url: 'Graphical designs/Saathanaiyaalargalin Sangamam 2.jpg.jpeg'
      },
      {
        title: 'Tennis Coaching Poster 02',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Tennis Coaching Poster 02.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Tennis Coaching Poster 02.jpg.jpg',
        url: 'Graphical designs/Tennis Coaching Poster 02.jpg.jpeg'
      },
      {
        title: 'Annam Trust Grand Occasion Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Annam Trust & Pollachi Sandhippu Grand Occation Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Annam Trust & Pollachi Sandhippu Grand Occation Poster.jpg.jpg',
        url: 'Graphical designs/Annam Trust & Pollachi Sandhippu Grand Occation Poster.jpg.jpeg'
      }
    ],
    media: {
      type: 'image',
      src: 'Graphical designs/web/Summer Tennis Coaching 2025 2.jpg.jpg'
    },
    targetSlug: 'graphical-design'
  },
  {
    slug: 'brand-identity',
    slot: 5,
    title: 'GRAPHICAL DESIGN',
    category: 'Graphic Design',
    short: 'Commercial print banners, typography posters, event creatives, and branding signage.',
    description: 'Comprehensive showcase of professional graphic design work spanning medical clinic branding, corporate events, retail inaugurations, festival creatives, and large-format architectural signage.',
    thumb: 'Graphical designs/thumbs/Kulali Collections Grand Opening Poster 2.jpg.jpg',
    mediaKind: 'image',
    items: [
      {
        title: 'Kulali Collections Grand Opening Poster',
        type: 'view',
        meta: 'BRANDING',
        src: 'Graphical designs/web/Kulali Collections Grand Opening Poster 2.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Kulali Collections Grand Opening Poster 2.jpg.jpg',
        url: 'Graphical designs/Kulali Collections Grand Opening Poster 2.jpg.jpeg'
      },
      {
        title: 'Kanthi Properties Campaign Poster',
        type: 'view',
        meta: 'CAMPAIGN',
        src: 'Graphical designs/web/Kanthi Properties Campaign Poster - Copy.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Kanthi Properties Campaign Poster - Copy.jpg.jpg',
        url: 'Graphical designs/Kanthi Properties Campaign Poster - Copy.jpg.jpeg'
      },
      {
        title: 'Kanthi Properties 2x3ft Banner',
        type: 'view',
        meta: 'BANNER',
        src: 'Graphical designs/web/Kanthi Properties 2x3ft 6 Banner.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Kanthi Properties 2x3ft 6 Banner.jpg.jpg',
        url: 'Graphical designs/Kanthi Properties 2x3ft 6 Banner.jpg.jpeg'
      },
      {
        title: 'Aazhira Diwali Special Offer',
        type: 'view',
        meta: 'RETAIL',
        src: 'Graphical designs/web/Aazhira Diwali Special Offer.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Aazhira Diwali Special Offer.jpg.jpg',
        url: 'Graphical designs/Aazhira Diwali Special Offer.jpg.jpeg'
      },
      {
        title: 'New Year Celebration Poster',
        type: 'view',
        meta: 'PROMO',
        src: 'Graphical designs/web/New Year Poster 02 With.F.jpg.jpg',
        thumb: 'Graphical designs/thumbs/New Year Poster 02 With.F.jpg.jpg',
        url: 'Graphical designs/New Year Poster 02 With.F.jpg.jpeg'
      }
    ],
    media: {
      type: 'image',
      src: 'Graphical designs/web/Kulali Collections Grand Opening Poster 2.jpg.jpg'
    },
    targetSlug: 'graphical-design'
  },
  {
    slug: 'illustration-set',
    slot: 11,
    title: 'GRAPHICAL DESIGN',
    category: 'Graphic Design',
    short: 'Commercial print banners, typography posters, event creatives, and branding signage.',
    description: 'Comprehensive showcase of professional graphic design work spanning medical clinic branding, corporate events, retail inaugurations, festival creatives, and large-format architectural signage.',
    thumb: 'Graphical designs/thumbs/Freshh Diwali Poster 02.jpg.jpg',
    mediaKind: 'image',
    items: [
      {
        title: 'Freshh Diwali Poster 02',
        type: 'view',
        meta: 'FESTIVAL',
        src: 'Graphical designs/web/Freshh Diwali Poster 02.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Freshh Diwali Poster 02.jpg.jpg',
        url: 'Graphical designs/Freshh Diwali Poster 02.jpg.jpeg'
      },
      {
        title: 'Freshh Ganesh Chaturthi Poster',
        type: 'view',
        meta: 'FESTIVAL',
        src: 'Graphical designs/web/Freshh Ganesh Chaturthi Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Freshh Ganesh Chaturthi Poster.jpg.jpg',
        url: 'Graphical designs/Freshh Ganesh Chaturthi Poster.jpg.jpeg'
      },
      {
        title: 'Freshh Krishna Jayanti Poster',
        type: 'view',
        meta: 'FESTIVAL',
        src: 'Graphical designs/web/Freshh Krishna Jeyanti Poster 03.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Freshh Krishna Jeyanti Poster 03.jpg.jpg',
        url: 'Graphical designs/Freshh Krishna Jeyanti Poster 03.jpg.jpeg'
      },
      {
        title: 'Freshh Ayudha Puja Poster',
        type: 'view',
        meta: 'FESTIVAL',
        src: 'Graphical designs/web/Freshh Ayudha Puja Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Freshh Ayudha Puja Poster.jpg.jpg',
        url: 'Graphical designs/Freshh Ayudha Puja Poster.jpg.jpeg'
      },
      {
        title: 'Shiphakala Panchamuga Vinayagar Poster',
        type: 'view',
        meta: 'DEVOTIONAL',
        src: 'Graphical designs/web/Shiphakala-Panchamuga Vinayagar Poster.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Shiphakala-Panchamuga Vinayagar Poster.jpg.jpg',
        url: 'Graphical designs/Shiphakala-Panchamuga Vinayagar Poster.jpg.jpeg'
      }
    ],
    media: {
      type: 'image',
      src: 'Graphical designs/web/Freshh Diwali Poster 02.jpg.jpg'
    },
    targetSlug: 'graphical-design'
  },
  {
    slug: 'cinema-stills',
    slot: 4,
    title: 'CINEMA STILLS',
    category: 'Video',
    short: 'Frame grabs and color study from cinematic projects.',
    description: 'A curated selection of high-resolution stills from 35mm and digital film shoots.',
    thumb: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      {
        title: "35mm Stills",
        type: "view",
        meta: "PNG",
        src: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
        thumb: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
        url: "#"
      }
    ]
  },
  {
    slug: 'interface-craft',
    slot: 23,
    title: 'INTERFACE CRAFT',
    category: 'UI/UX',
    short: 'Design system components and micro-interactions.',
    description: 'Comprehensive UI kit focusing on dynamic layout grids and interactive micro-animations.',
    thumb: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      {
        title: "UI Kit",
        type: "view",
        meta: "Figma",
        src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop",
        thumb: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop",
        url: "#"
      }
    ]
  },
  {
    slug: 'editorial-layout',
    slot: 26,
    title: 'GRAPHICAL DESIGN',
    category: 'Graphic Design',
    short: 'Commercial print banners, typography posters, event creatives, and branding signage.',
    description: 'Comprehensive showcase of professional graphic design work spanning medical clinic branding, corporate events, retail inaugurations, festival creatives, and large-format architectural signage.',
    thumb: 'Graphical designs/thumbs/RUKS-Magazine Quarter Page (2).jpg.jpg',
    mediaKind: 'image',
    items: [
      {
        title: 'RUKS Magazine Quarter Page Ad',
        type: 'view',
        meta: 'MAGAZINE',
        src: 'Graphical designs/web/RUKS-Magazine Quarter Page (2).jpg.jpg',
        thumb: 'Graphical designs/thumbs/RUKS-Magazine Quarter Page (2).jpg.jpg',
        url: 'Graphical designs/RUKS-Magazine Quarter Page (2).jpg.jpeg'
      },
      {
        title: 'IIACT Aesthetic Medicine Course (72x44)',
        type: 'view',
        meta: 'EDITORIAL',
        src: 'Graphical designs/web/IIACT 72X44 In Aesthetic Medicine Course 2.jpg.jpg',
        thumb: 'Graphical designs/thumbs/IIACT 72X44 In Aesthetic Medicine Course 2.jpg.jpg',
        url: 'Graphical designs/IIACT 72X44 In Aesthetic Medicine Course 2.jpg.jpeg'
      },
      {
        title: 'IIACT 6x4 ft Banner',
        type: 'view',
        meta: 'BANNER',
        src: 'Graphical designs/web/IIACT 6x4 ft Banner.jpg.jpg',
        thumb: 'Graphical designs/thumbs/IIACT 6x4 ft Banner.jpg.jpg',
        url: 'Graphical designs/IIACT 6x4 ft Banner.jpg.jpeg'
      },
      {
        title: 'Clinical Cosmetology Poster',
        type: 'view',
        meta: 'CLINICAL',
        src: 'Graphical designs/web/Clinical Cosmetology Poster 01.1.jpg',
        thumb: 'Graphical designs/thumbs/Clinical Cosmetology Poster 01.1.jpg',
        url: 'Graphical designs/Clinical Cosmetology Poster 01.1.png'
      },
      {
        title: 'Facial Aesthetics & Cosmetology',
        type: 'view',
        meta: 'CLINICAL',
        src: 'Graphical designs/web/Facial Aesthetics & Cosmetology 01.jpg',
        thumb: 'Graphical designs/thumbs/Facial Aesthetics & Cosmetology 01.jpg',
        url: 'Graphical designs/Facial Aesthetics & Cosmetology 01.png'
      },
      {
        title: 'Hydra Facial & Dermabrasion Poster',
        type: 'view',
        meta: 'POSTER',
        src: 'Graphical designs/web/Hydra Facial & Dermabrasion.jpg.jpg',
        thumb: 'Graphical designs/thumbs/Hydra Facial & Dermabrasion.jpg.jpg',
        url: 'Graphical designs/Hydra Facial & Dermabrasion.jpg.jpeg'
      }
    ],
    media: {
      type: 'image',
      src: 'Graphical designs/web/RUKS-Magazine Quarter Page (2).jpg.jpg'
    },
    targetSlug: 'graphical-design'
  },
  {
    slug: 'motion-graphics',
    slot: 6,
    title: 'MOTION GRAPHICS',
    category: 'Video',
    short: '3D title sequences and kinetic typography.',
    description: 'Kinetic title sequence and procedural motion design graphics.',
    thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    items: [
      {
        title: "Title Reel",
        type: "play",
        meta: "0:00",
        src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
        thumb: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
        url: "#"
      }
    ]
  },
  {
    slug: 'tne-guerrilla-cut',
    slot: 29,
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
    slot: 22,
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
    slot: 8,
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
    slot: 2,
    title: 'URBAN VELOCITY',
    category: 'Video',
    short: 'FPV drone tracking through narrow alleys and elevated highway lines.',
    description: 'High-speed FPV tracking cut focusing on spatial rhythm and kinetic motion.',
    thumb: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    targetSlug: 'graphical-design'
  },
  {
    slug: 'sound-design-lab',
    slot: 24,
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
    slot: 3,
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
    slot: 21,
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
    slot: 15,
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
    slot: 16,
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
    slot: 14,
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
    slot: 17,
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
    slot: 19,
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
    slot: 9,
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
    slot: 18,
    title: 'RAW VELOCITY',
    category: 'Motorcycle Stunt Collective',
    short: 'Uncut street riding audio track paired with raw, authentic visual pacing.',
    description: 'Raw engine notes, tire screech, and unfiltered visual velocity from Team Never Enough.',
    thumb: 'media/tne-poster.jpg?v=5241',
    mediaKind: 'image',
    targetSlug: 'team-never-enough'
  }
];
