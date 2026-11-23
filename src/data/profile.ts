// EDIT ME: your personal details and links live here.
// Every component reads from this file, so you only change things once.

export const profile = {
  name: 'Rhammzthienne R. Tindoy',
  role: 'Full Stack Developer',
  pitch:
    'I build clean, useful web apps from the front end all the way to the database.',
  domain: 'ram.dev',
  school: 'Holy Cross of Davao College',
  location: 'Davao City, Philippines',

  // Place your photo at public/images/profile.jpg
  photo: '/images/profile.jpg',
  // Photo used in the About section: public/images/about.jpg
  aboutPhoto: '/images/about.jpg',

  // EDIT ME: keep the bio at 3 to 4 sentences.
  bio: [
    "I'm a 3rd year BSIT student at Holy Cross of Davao College in Davao City, Philippines.",
    "I'm also a game developer with experience building Minecraft Bedrock add-ons, and I enjoy building web apps and working with databases.",
    'I am looking for an OJT or internship and entry-level opportunities as a Full Stack Developer.',
    'I am eager to learn from a real team, ship real features, and keep growing every day.',
  ],

  // Contact details
  email: 'rhammzthienne12@gmail.com',
  secondaryEmail: 'rhammz2006@gmail.com',
  discord: 'ssob01',
  github: 'https://github.com/r4m2306',
  facebook: 'https://www.facebook.com/ramreturn0',

  // Education
  degree: 'Bachelor of Science in Information Technology',
  yearLevel: '3rd Year',
  // EDIT ME: replace YEAR with your real graduation year.
  expectedGraduation: 'Expected graduation: YEAR',

  // Resume: put your file at public/resume.pdf
  resumeUrl: '/resume.pdf',

  // Contact form: set your Formspree form ID (https://formspree.io) to send
  // messages without a backend. Leave it empty to use a mailto: link instead.
  formspreeId: '',
} as const
