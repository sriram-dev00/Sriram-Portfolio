/* ===========================================================
   UI / UX DESIGNER PORTFOLIO — content config
   Replace the placeholder text/media paths below with your own.
   - thumb: small image shown on the home wall (leave blank for
     a dashed placeholder box)
   - media: the featured screen/prototype image on the case-study
     page
   - items: the row list under the featured media (each screen,
     flow, or deliverable in the case study) \u2014 type:'view' shows
     a "View" pill instead of a play button
   =========================================================== */

window.SITE = {
  name: 'Sriram MJ',
  role: 'Multidisciplinary Designer',

  heroWelcome: 'Welcome',
  heroLine: 'to Sriram\u2019s case studies in <em>product design</em>, dashboards, and systems thinking.',

  navLead1: 'the', navWork: 'Work', navLead2: 'and', navAbout: 'About Me',
  navLead3: 'or', navContact: 'Contact',
  workLabel: 'case studies', singularLabel: 'case study',

  soundBadgeText: 'VIEW THE PROTOTYPE \u2022 VIEW THE PROTOTYPE \u2022 ',

  aboutText: 'I design dashboards and workflow tools \u2014 research through high-fidelity prototypes in Figma. This page is a placeholder: swap in your own bio, headshot, and process summary.',

  contactText: 'For freelance UI/UX work or full case-study walkthroughs \u2014 reach out.',
  contactLinks: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/your-handle' },
    { label: 'Email', href: 'mailto:you@example.com' }
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
    thumb: '',
    media: null, // e.g. { type:'image', src:'media/luminal-hr-admin.png' }
    mediaKind: 'screen',
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
    description: 'Placeholder \u2014 describe the HR Admin persona\u2019s journey through Luminal HR: goals, pain points, and the flow you designed.',
    thumb: '',
    media: null,
    mediaKind: 'screen',
    items: [
      { title: 'Journey Map', type:'view', meta:'Figma' }
    ]
  },
  {
    slug: 'manager-flow',
    title: 'MANAGER FLOW',
    category: 'User Flow',
    short: 'Overseeing team performance, leave, and hiring in one view.',
    description: 'Placeholder \u2014 describe the Manager persona\u2019s journey and key screens.',
    thumb: '',
    media: null,
    mediaKind: 'screen',
    items: [
      { title: 'Journey Map', type:'view', meta:'Figma' }
    ]
  },
  {
    slug: 'employee-flow',
    title: 'EMPLOYEE FLOW',
    category: 'User Flow',
    short: 'Self-service profile, leave requests, and career growth.',
    description: 'Placeholder \u2014 describe the Employee persona\u2019s journey and key screens.',
    thumb: '',
    media: null,
    mediaKind: 'screen',
    items: [
      { title: 'Journey Map', type:'view', meta:'Figma' }
    ]
  }
];
