import { certifications } from './certifications'
import { experience } from './experience'

export interface NavItem {
  id: string
  label: string
}

// Sections in page order. Certifications and Experience are included
// only when their data arrays have items, so the navbar never links
// to a section that is not rendered.
export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skill Stack' },
  { id: 'projects', label: 'Projects' },
  ...(experience.length > 0 ? [{ id: 'experience', label: 'Experience' }] : []),
  ...(certifications.length > 0
    ? [{ id: 'certifications', label: 'Certifications' }]
    : []),
  { id: 'resume', label: 'Resume' },
]

// The floating pill menu in the navbar (tablet and desktop).
// "Portfolio" scrolls to the Projects section. The phone menu lists every section.
export const pillItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skill Stack' },
  { id: 'projects', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
]
