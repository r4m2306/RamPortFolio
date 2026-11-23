import type { Project } from '../types'

// EDIT ME: all of your projects live in this one file.
// - Featured projects are sorted first (see sortedProjects below).
// - Every card shows one "View Project" button. It opens `liveUrl` if set, otherwise `githubUrl`.
// - Put screenshots in public/images/ and update the `image` paths.

export const projects: Project[] = [
  {
    title: 'Physical Health Monitoring (3-Day Track Program)',
    description:
      'A program for tracking a person\'s physical health activity across a 3-day period. It focuses on logging daily health data and viewing progress over the tracking window so users can see how they are doing at a glance.',
    // EDIT ME: replace these placeholder tags with the exact technologies you used.
    techStack: ['EDIT ME', 'Tech 1', 'Tech 2'],
    role: 'Developer',
    image: '/images/project-1.png',
    imageAlt: 'Screenshot of the Physical Health Monitoring (3-Day Track Program) project',
    // EDIT ME: replace with the exact repository URL.
    githubUrl: 'https://github.com/r4m2306',
    featured: true,
  },
  {
    title: 'Multi-Page Student Directory',
    description:
      'A multi-page web app for browsing and managing student records. It has separate pages for listing students and for viewing the details of each student.',
    // EDIT ME: replace these placeholder tags with the exact technologies you used.
    techStack: ['EDIT ME', 'Tech 1', 'Tech 2'],
    role: 'Developer',
    image: '/images/project-2.png',
    imageAlt: 'Screenshot of the Multi-Page Student Directory project',
    // EDIT ME: replace with the exact repository URL.
    githubUrl: 'https://github.com/r4m2306',
    featured: true,
  },
  {
    title: 'Origins PE (Minecraft Bedrock Add-On)',
    description:
      'A Minecraft Bedrock add-on by r4isen1920 that brings the Origins mod to Bedrock Edition. Players pick an Origin and a Class at the start of a world, each with its own passive abilities. I contributed as a developer, building and debugging origin powers such as the Vampire and Zeus origins.',
    techStack: ['TypeScript', '@minecraft/server API', 'Regolith'],
    // EDIT ME: adjust your role if it should be described differently.
    role: 'Contributing Developer',
    image: '/images/project-3.png',
    imageAlt: 'Origins PE add-on artwork showing the Human and Nitwit origin banners',
    // "View Project" opens this CurseForge page. Add a githubUrl if you have a repo link
    // (then a second GitHub button appears).
    liveUrl: 'https://www.curseforge.com/minecraft-bedrock/addons/originspe-be-add-on-1-2',
    featured: true,
  },
]

// Featured projects first, otherwise keep the order written above.
export const sortedProjects: Project[] = [...projects].sort(
  (a, b) => Number(b.featured) - Number(a.featured),
)
