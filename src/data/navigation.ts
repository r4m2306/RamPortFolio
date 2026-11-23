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
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  ...(experience.length > 0 ? [{ id: 'experience', label: 'Experience' }] : []),
  { id: 'education', label: 'Education' },
  ...(certifications.length > 0
    ? [{ id: 'certifications', label: 'Certifications' }]
    : []),
  { id: 'resume', label: 'Resume' },
]
