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
      cards: ['team-never-enough', 'ui-and-ux-design', 'burnout', 'graphical-design', 'behind-the-lens', 'reel-2026']
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
    slug: 'team-never-enough',
    slot: 1,
    title: 'TEAM NEVER ENOUGH',
    category: 'Motorcycle Stunt Collective',
    short: 'I’ve been a fan of Team Never Enough and their unique approach to motorcycle stunt performances. I create and edit videos of their work out of genuine passion, not as a paid project. For me, it’s a way to combine my love for their work with my passion for editing and visual storytelling.',
    description: 'I’ve been a fan of Team Never Enough and their unique approach to motorcycle stunt performances. I create and edit videos of their work out of genuine passion, not as a paid project. For me, it’s a way to combine my love for their work with my passion for editing and visual storytelling.',
    moreInfo: 'Royal Enfield Guerrilla 450 edition. Precision street riding, vertical balance acrobatics, and raw visual velocity.',
    thumb: 'Team Never Enough/3d space tne/tne 1 img.jpg',
    indexThumb: 'Team Never Enough/3d space tne/tne 1 img.jpg',
    mediaKind: 'image',
    media: {
      type: 'image',
      src: 'Team Never Enough/3d space tne/tne 1 img.jpg'
    },
    items: [
      {
        title: "Guerrilla 450 Cut",
        type: "play",
        meta: "0:00",
        src: "Team Never Enough/3d space tne/tne 1 img.jpg",
        thumb: "Team Never Enough/3d space tne/tne 1 img.jpg",
        url: "#"
      },
      {
        title: "Slow-Mo Vertical Stunt Reel",
        type: "play",
        meta: "0:00",
        src: "Team Never Enough/3d space tne/tne 2.jpeg",
        thumb: "Team Never Enough/3d space tne/tne 2.jpeg",
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
    thumb: 'Graphical designs/3d space GD/graphical typo.png',
    indexThumb: 'Graphical designs/graphical design thumbnail/sriram_mj_index.jpeg',
    mediaKind: 'image',
    media: {
      type: 'image',
      src: 'Graphical designs/3d space GD/graphical typo.png'
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
        thumb: 'Graphical designs/3d space GD/Freshh Ayudha Puja Poster.jpg.jpeg',
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
        thumb: 'Graphical designs/3d space GD/Freshh Ganesh Chaturthi Poster.jpg.jpeg',
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
        thumb: 'Graphical designs/3d space GD/4x1.5 Vinyl Consultation Room (2).jpg.jpeg',
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
        thumb: 'Graphical designs/3d space GD/4x3 Vinyl Glass.jpg.jpeg',
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
    slug: 'ui-and-ux-design',
    slot: 27,
    title: 'UI AND UX DESIGN',
    category: 'UI/UX',
    short: 'Interactive systems, digital product design, and cohesive user experience flows.',
    description: 'Comprehensive UI/UX design showcase featuring the Luminal HR ecosystem and digital product design — covering interactive prototypes, company management, and responsive systems.',
    moreInfo: 'Process: problem analysis → user flows → wireframes → high-fidelity Figma UI → interactive prototypes.',
    thumb: 'Ui and ux design/ui & ux thumb/index hover image/sriram_mj_login_signup_monochrome_4k_16x9.png',
    indexThumb: 'Ui and ux design/ui & ux thumb/index hover image/sriram_mj_login_signup_monochrome_4k_16x9.png',
    mediaKind: 'video',
    media: {
      type: 'video',
      src: 'Ui and ux design/ui & ux design videos/people flow(Company Management) design/people flow(Company Management).mp4',
      poster: 'Ui and ux design/ui & ux thumb/index hover image/sriram_mj_login_signup_monochrome_4k_16x9.png'
    },
    items: [
      {
        title: "People Flow (Company Management)",
        type: "play",
        meta: "Video",
        src: "Ui and ux design/ui & ux design videos/people flow(Company Management) design/people flow(Company Management).mp4",
        thumb: "Ui and ux design/ui & ux thumb/index hover image/sriram_mj_login_signup_monochrome_4k_16x9.png",
        url: "Ui and ux design/ui & ux design videos/people flow(Company Management) design/people flow(Company Management).mp4"
      },
      {
        title: "Portfolio Preview",
        type: "play",
        meta: "Video",
        src: "Ui and ux design/ui & ux design videos/portfolio design/Portfolio Preview.mp4",
        thumb: "Ui and ux design/ui & ux thumb/index hover image/sriram_mj_login_signup_monochrome_4k_16x9.png",
        url: "Ui and ux design/ui & ux design videos/portfolio design/Portfolio Preview.mp4"
      }
    ]
  },
  {
    slug: 'motion-graphics',
    slot: 6,
    title: 'MOTION GRAPHICS',
    category: 'Video',
    short: '3D title sequences, procedural animations, and kinetic typography.',
    description: 'Dynamic motion graphics and procedural 3D animation cut focusing on kinetic typography, brand reveals, and spatial visual pacing.',
    thumb: 'Motion Graphics/motion-graphics-upscaled-16x9.jpg',
    indexThumb: 'Motion Graphics/motion-graphics-upscaled-16x9.jpg',
    mediaKind: 'video',
    media: {
      type: 'video',
      src: 'Motion Graphics/motion graphics videos/Og Instagram in animation.mp4',
      poster: 'Motion Graphics/motion-graphics-upscaled-16x9.jpg'
    },
    items: [
      {
        title: "Instagram In Animation",
        type: "play",
        meta: "0:12",
        src: "Motion Graphics/motion graphics videos/Og Instagram in animation.mp4",
        thumb: "Motion Graphics/motion-graphic-16x9.jpg",
        url: "Motion Graphics/motion graphics videos/Og Instagram in animation.mp4"
      },
      {
        title: "Cross Slide Animation",
        type: "play",
        meta: "0:08",
        src: "Motion Graphics/motion graphics videos/cross slide animation.mp4",
        thumb: "Motion Graphics/motion-graphics-upscaled-16x9.jpg",
        url: "Motion Graphics/motion graphics videos/cross slide animation.mp4"
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
    slug: 'hr-admin-flow',
    slot: 7,
    title: 'UI AND UX DESIGN',
    category: 'UI/UX',
    short: 'How an HR admin manages policy, compliance, and headcount.',
    description: 'Comprehensive administrative UI workflow covering employee records and compliance.',
    thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
    },
    targetSlug: 'ui-and-ux-design'
  },
  {
    slug: 'manager-flow',
    slot: 28,
    title: 'UI AND UX DESIGN',
    category: 'UI/UX',
    short: 'Overseeing team performance, leave, and hiring in one view.',
    description: 'Clean manager overview portal balancing quick actions and team telemetry.',
    thumb: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop'
    },
    targetSlug: 'ui-and-ux-design'
  },
  {
    slug: 'employee-flow',
    slot: 20,
    title: 'UI AND UX DESIGN',
    category: 'UI/UX',
    short: 'Self-service profile, leave requests, and career growth.',
    description: 'Mobile-first self service interface designed for seamless employee onboarding.',
    thumb: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop',
    mediaKind: 'image',
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop'
    },
    targetSlug: 'ui-and-ux-design'
  },
  {
    slug: 'poster-series',
    slot: 10,
    title: 'GRAPHICAL DESIGN',
    category: 'Graphic Design',
    short: 'Commercial print banners, typography posters, event creatives, and branding signage.',
    description: 'Comprehensive showcase of professional graphic design work spanning medical clinic branding, corporate events, retail inaugurations, festival creatives, and large-format architectural signage.',
    thumb: 'Graphical designs/3d space GD/4x3 Vinyl Glass.jpg.jpeg',
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
    thumb: 'Graphical designs/3d space GD/Freshh Ganesh Chaturthi Poster.jpg.jpeg',
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
    thumb: 'Graphical designs/3d space GD/Freshh Ayudha Puja Poster.jpg.jpeg',
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
    thumb: 'Graphical designs/3d space GD/4x1.5 Vinyl Consultation Room (2).jpg.jpeg',
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
    slug: 'tne-guerrilla-cut',
    slot: 29,
    title: 'TNE — GUERRILLA 450 CUT',
    category: 'Motorcycle Stunt Collective',
    short: 'Action still from the vertical balance acrobatic series on the Royal Enfield Guerrilla 450.',
    description: 'High-speed street precision stunts and balance acrobatics by Team Never Enough.',
    thumb: 'Team Never Enough/3d space tne/tne 2.jpeg',
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
    category: 'Motorcycle Stunt Collective',
    short: 'Real-time telemetry HUD overlay for high-velocity stunt analytics.',
    description: 'Telemetry dashboard capturing lean angle, velocity curves, and vertical balance points.',
    thumb: 'Team Never Enough/3d space tne/tne 1 img.jpg',
    mediaKind: 'image',
    targetSlug: 'team-never-enough'
  },
  {
    slug: 'urban-velocity',
    slot: 2,
    title: 'GRAPHICAL DESIGN',
    category: 'Graphic Design',
    short: 'Commercial print banners, typography posters, event creatives, and branding signage.',
    description: 'Comprehensive showcase of professional graphic design work spanning medical clinic branding, corporate events, retail inaugurations, festival creatives, and large-format architectural signage.',
    thumb: 'Graphical designs/3d space GD/New Year Poster 02 With.F.jpg.jpeg',
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
    thumb: 'Team Never Enough/3d space tne/Tne 3.jpeg',
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
    targetSlug: 'ui-and-ux-design'
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
    thumb: 'Motion Graphics/motion graphics thumb 1.png',
    mediaKind: 'video',
    media: {
      type: 'video',
      src: 'Motion Graphics/motion graphics videos/cross slide animation.mp4',
      poster: 'Motion Graphics/motion graphics thumb 1.png'
    },
    targetSlug: 'motion-graphics'
  },
  {
    slug: 'raw-velocity',
    slot: 18,
    title: 'RAW VELOCITY',
    category: 'Motorcycle Stunt Collective',
    short: 'Uncut street riding audio track paired with raw, authentic visual pacing.',
    description: 'Raw engine notes, tire screech, and unfiltered visual velocity from Team Never Enough.',
    thumb: 'Team Never Enough/3d space tne/tne 4.png',
    mediaKind: 'image',
    targetSlug: 'team-never-enough'
  }
];

export const TILE_LAYOUTS: TileLayout[] = [
  // Slot 1 (TNE Hero Portrait — Right Flank, like Pig in Michael Gatt reference)
  { x: 310,   y: 60,   w: 265, h: 410, zPx: 80,   rx: 0.6,  ry: 0,   rz: -0.8, sizeClass: 'large' },
  // Slot 2 (Wheelie City — Far Upper-Left edge still, like Shark in reference)
  { x: -880,  y: -260, w: 290, h: 190, zPx: 20,   rx: -1.6, ry: 0,   rz: 0.8,  sizeClass: 'medium' },
  // Slot 3 (Burnout — Far Upper-Right edge still, like Car in reference right view)
  { x: 880,   y: -210, w: 290, h: 190, zPx: 30,   rx: -1.8, ry: 0,   rz: -0.8, sizeClass: 'medium' },
  // Slot 4 (Behind The Lens — Lower-Left feature still, like Batman in reference)
  { x: -460,  y: 260,  w: 310, h: 205, zPx: 60,   rx: 1.5,  ry: 0,   rz: 0.8,  sizeClass: 'medium' },
  // Slot 5 (Reel 2026 — Mid-Right lower flank)
  { x: 1120,  y: 220,  w: 280, h: 185, zPx: 40,   rx: 1.5,  ry: 0,   rz: -0.8, sizeClass: 'medium' },
  // Slot 6 (Luminal HR — Upper-Right peeking accent, tucked behind Pig like Joker in reference)
  { x: 450,   y: -150, w: 185, h: 135, zPx: -50,  rx: 0.8,  ry: 0,   rz: -0.8, sizeClass: 'small' },
  // Slot 7 (HR Admin Flow — Mid-Right upper flank)
  { x: 1360,  y: -300, w: 240, h: 160, zPx: -70,  rx: -1.8, ry: 0,   rz: 0.8,  sizeClass: 'small' },
  // Slot 8 (Manager Flow — Mid-Left flank)
  { x: -1220, y: 170,  w: 240, h: 160, zPx: -50,  rx: 1.2,  ry: 0,   rz: -1.0, sizeClass: 'small' },
  // Slot 9 (Employee Flow — Mid-Left upper flank)
  { x: -1350, y: -240, w: 230, h: 155, zPx: -80,  rx: -1.5, ry: 0,   rz: -0.8, sizeClass: 'small' },
  // Slot 10 (Hero Portrait Left / Poster Series)
  { x: -1620, y: -20,  w: 260, h: 420, zPx: 70,   rx: 0.8,  ry: 0,   rz: -1.0, sizeClass: 'large' },
  // Slot 11 (Brand Identity — Top-Center distant accent, like Building in reference)
  { x: -140,  y: -390, w: 220, h: 150, zPx: -190, rx: -1.5, ry: 0,   rz: 0.5,  sizeClass: 'small' },
  // Slot 12 (Illustration Set — Mid-Left outer upper)
  { x: -1880, y: -320, w: 230, h: 155, zPx: -120, rx: -1.5, ry: 0,   rz: 1.0,  sizeClass: 'small' },
  // Slot 13 (Cinema Stills — Far-Left lower wing)
  { x: -2100, y: 280,  w: 230, h: 155, zPx: -140, rx: 1.8,  ry: 0,   rz: -1.0, sizeClass: 'small' },
  // Slot 14 (Interface Craft — Far-Left mid wing)
  { x: -2340, y: -50,  w: 220, h: 150, zPx: -180, rx: 0.0,  ry: 0,   rz: 1.0,  sizeClass: 'small' },
  // Slot 15 (Editorial Layout — Far-Left upper wing)
  { x: -2560, y: -320, w: 220, h: 150, zPx: -210, rx: -1.8, ry: 0,   rz: 0.8,  sizeClass: 'small' },
  // Slot 16 (Motion Graphics — Under-Center dark still, like Dragon in reference)
  { x: -30,   y: 360,  w: 310, h: 200, zPx: 10,   rx: 1.6,  ry: 0,   rz: -0.5, sizeClass: 'medium' },
  // Slot 17 (Hero Right Still / TNE Precision Cut)
  { x: 1520,  y: -10,  w: 270, h: 180, zPx: 40,   rx: 0.6,  ry: 0,   rz: -0.8, sizeClass: 'medium' },
  // Slot 18 (Night Drift — Upper-Right mid flank)
  { x: 1640,  y: -280, w: 260, h: 175, zPx: -40,  rx: -1.6, ry: 0,   rz: -1.0, sizeClass: 'medium' },
  // Slot 19 (Stunt Telemetry HUD — Mid-Left peeking still, like Darkseid in reference)
  { x: -620,  y: -70,  w: 260, h: 175, zPx: 30,   rx: 0.5,  ry: 0,   rz: 0.8,  sizeClass: 'small' },
  // Slot 20 (Urban Velocity — Far-Left deep ceiling)
  { x: -1500, y: -440, w: 210, h: 140, zPx: -150, rx: -2.0, ry: 0,   rz: -0.8, sizeClass: 'small' },
  // Slot 21 (Sound Design Lab — Mid-Right mid flank)
  { x: 1860,  y: 110,  w: 240, h: 160, zPx: -60,  rx: -0.5, ry: 0,   rz: -0.8, sizeClass: 'small' },
  // Slot 22 (Aperture Study — Far-Right upper wing)
  { x: 2080,  y: -300, w: 230, h: 155, zPx: -130, rx: -1.8, ry: 0,   rz: 1.0,  sizeClass: 'small' },
  // Slot 23 (Chromatic Flow — Far-Right lower wing)
  { x: 2180,  y: 320,  w: 230, h: 155, zPx: -140, rx: 1.8,  ry: 0,   rz: -1.0, sizeClass: 'small' },
  // Slot 24 (Slow-Mo Mechanics — Under-Center delicate accent, like Minion in reference)
  { x: -45,   y: 165,  w: 90,   h: 125, zPx: -90,  rx: 0.5,  ry: 0,   rz: 0.5,  sizeClass: 'small' },
  // Slot 25 (Telemetry Dashboard — Mid-Right outer lower)
  { x: 2420,  y: 170,  w: 220, h: 150, zPx: -170, rx: 1.2,  ry: 0,   rz: -0.8, sizeClass: 'small' },
  // Slot 26 (Atmospheric Foley — Far-Right mid wing)
  { x: 2640,  y: -60,  w: 210, h: 140, zPx: -200, rx: 0.0,  ry: 0,   rz: -1.0, sizeClass: 'small' },
  // Slot 27 (Street Optics — Far-Left deep horizon)
  { x: -2780, y: 140,  w: 200, h: 135, zPx: -240, rx: 1.0,  ry: 0,   rz: 0.5,  sizeClass: 'small' },
  // Slot 28 (Lighting Architecture — Far-Right deep ceiling)
  { x: 2850,  y: -240, w: 200, h: 135, zPx: -230, rx: -1.5, ry: 0,   rz: 0.8,  sizeClass: 'small' },
  // Slot 29 (Kinetic Titles — Far-Right deep floor)
  { x: 3050,  y: 210,  w: 190, h: 130, zPx: -250, rx: 1.5,  ry: 0,   rz: -0.8, sizeClass: 'small' },
  // Slot 30 (Raw Velocity — Mid-Right foreground accent)
  { x: 1680,  y: 250,  w: 260, h: 175, zPx: 50,   rx: 1.0,  ry: 0,   rz: -0.8, sizeClass: 'medium' }
];

export const SPACE_CONFIG = {
  REF_WIDTH: 5760,
  REF_HEIGHT: 3100,
  REF_ASPECT: 5760 / 3100,
  REF_MOBILE_WIDTH: 2137,
  REF_MOBILE_HEIGHT: 1644,
  REF_MOBILE_ASPECT: 2137 / 1644,
  CONCAVE_CURVE_STRENGTH: 160,
  PITCH_COEFF: 5.5,
  YAW_COEFF: -14.0,
  HOVER_INTENT_DELAY: 25,
  HOVER_EXIT_DELAY: 60,
  TILE_REST_BRIGHTNESS: 0.92,
  TILE_REST_SATURATE: 1.00,
  CAMERA_LERP: 0.048
};
