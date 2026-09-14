export interface ProjectItem {
  title: string;
  type: string;
  meta: string;
}

export interface ProjectMedia {
  src?: string;
  poster?: string;
  type?: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  short: string;
  description: string;
  moreInfo?: string;
  thumb: string;
  thumbType?: string;
  media?: ProjectMedia | null;
  mediaKind?: 'video' | 'image';
  items?: ProjectItem[];
}

export interface ContactLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface AboutSection {
  id: string;
  label: string;
  eyebrow: string;
  stepped?: string[];
  lead?: string;
  sub?: string;
  sublead?: string;
  text?: string;
  cards?: string[];
  socials?: SocialLink[];
}

export interface SiteConfig {
  name: string;
  role: string;
  splashText?: string;
  heroWelcome?: string;
  heroLine?: string;
  navLead1?: string;
  navWork?: string;
  navLead2?: string;
  navAbout?: string;
  navLead3?: string;
  navContact?: string;
  workLabel?: string;
  singularLabel?: string;
  soundBadgeText?: string;
  aboutHeadline?: string;
  aboutHeroSubtitle?: string;
  aboutIntro?: string;
  aboutBio?: string;
  aboutBg?: string;
  sections?: AboutSection[];
  contactText?: string;
  contactLinks: ContactLink[];
}

export interface TileLayout {
  x: number;
  y: number;
  w?: number;
  h?: number;
  zPx: number;
  rx?: number;
  ry?: number;
  rz?: number;
  sizeClass?: string;
}

export interface ComputedTile {
  project: Project;
  index: number;
  posX: number;
  posY: number;
  totalZ: number;
  cylRotX: number;
  cylRotY: number;
  cylRotZ: number;
  depthOpacity: number;
  uniqueStackIndex: number;
  width: number;
  height: number;
  sizeClass?: string;
}

export type ViewName = 'space' | 'index' | 'about' | 'contact' | 'project';
