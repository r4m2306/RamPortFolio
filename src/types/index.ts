// Shared TypeScript types for the portfolio data.

export interface Project {
  title: string
  description: string
  /** Technology tags shown on the card */
  techStack: string[]
  /** Your role on the project */
  role: string
  /** Path inside /public, e.g. /images/project-1.png */
  image: string
  /** Alt text for the screenshot */
  imageAlt: string
  /** Repository link. The "View Project" button uses it when there is no liveUrl. */
  githubUrl?: string
  /** Optional live/published link. The "View Project" button prefers this one. */
  liveUrl?: string
  featured: boolean
}

export type SkillCategory =
  | 'Languages'
  | 'Styling'
  | 'Frameworks and Libraries'
  | 'Databases'
  | 'Tools'
  | 'Backend'

export interface Skill {
  name: string
  category: SkillCategory
  /** Icon image (import an .svg from src/assets/skill-icons). If omitted, the name is shown as text. */
  icon?: string
}

export interface Certification {
  title: string
  issuer: string
  /** e.g. "March 2026" */
  date: string
  /** Optional link to the credential */
  url?: string
}

export interface Experience {
  role: string
  organization: string
  /** e.g. "June 2026 - August 2026" */
  period: string
  description: string
}
