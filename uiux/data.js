/* ===========================================================
   UI / UX DESIGNER PORTFOLIO — content config
   =========================================================== */

window.SITE = {
  name: 'Sriram MJ',
  role: 'UI/UX Designer',

  heroWelcome: 'Welcome',
  heroLine: 'to Sriram\u2019s case studies in <em>product design</em>, dashboards, and systems thinking.',

  navLead1: 'THE', navWork: 'WORK', navLead2: 'AND', navAbout: 'ABOUT ME',
  navLead3: 'OR', navContact: 'CONTACT',
  workLabel: 'case studies', singularLabel: 'case study',

  soundBadgeText: 'VIEW THE PROTOTYPE \u2022 VIEW THE PROTOTYPE \u2022 ',

  aboutText: 'I design dashboards and workflow tools \u2014 research through high-fidelity prototypes in Figma.',

  contactText: 'For freelance UI/UX work or full case-study walkthroughs \u2014 reach out.',
  contactLinks: [
    { label: 'Instagram', href: 'https://www.instagram.com/delusional.efx?stkn=MW82b2ttZW9vdnNuaw==' },
    { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/sriram-m-j-5491a7322/' },
    { label: 'Email',     href: 'mailto:srirammj221@gmail.com' }
  ]
};

window.PROJECTS = [
  {
    slug: 'luminal-hr',
    title: 'LUMINAL HR',
    category: 'Case Study',
    short: 'An HRIS dashboard for a 500-person company \u2014 three personas, one system.',
    description: 'Luminal HR is a Human Resource Information System designed for a mid-sized company, covering Leave Management, Payroll, Performance Reviews, Recruitment, and the Employee Directory across three personas: HR Admin, Manager, and Employee.',
    moreInfo: 'Process: problem analysis \u2192 stakeholder + pain-point mapping \u2192 feature requirements \u2192 information architecture \u2192 user flows \u2192 wireframes \u2192 high-fidelity Figma UI \u2192 interactive prototype.',
    thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
    items: [
      { title: 'HR Admin Dashboard', type:'view', meta:'Figma' },
      { title: 'Manager Dashboard', type:'view', meta:'Figma' },
      { title: 'Employee Dashboard', type:'view', meta:'Figma' },
      { title: 'User Flows (all personas)', type:'view', meta:'PDF' }
    ]
  },
  {
    slug: 'hr-admin-flow',
    title: 'HR ADMIN FLOW',
    category: 'User Flow',
    short: 'How an HR admin manages policy, compliance, and headcount.',
    description: 'Comprehensive administrative UI workflow covering employee records and compliance.',
    thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
    items: [
      { title: 'Journey Map', type:'view', meta:'Figma' }
    ]
  },
  {
    slug: 'manager-flow',
    title: 'MANAGER FLOW',
    category: 'User Flow',
    short: 'Overseeing team performance, leave, and hiring in one view.',
    description: 'Clean manager overview portal balancing quick actions and team telemetry.',
    thumb: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
    items: [
      { title: 'Journey Map', type:'view', meta:'Figma' }
    ]
  },
  {
    slug: 'employee-flow',
    title: 'EMPLOYEE FLOW',
    category: 'User Flow',
    short: 'Self-service profile, leave requests, and career growth.',
    description: 'Mobile-first self service interface designed for seamless employee onboarding.',
    thumb: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop',
    media: null,
    mediaKind: 'image',
    items: [
      { title: 'Journey Map', type:'view', meta:'Figma' }
    ]
  }
];
