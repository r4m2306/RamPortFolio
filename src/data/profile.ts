// EDIT ME: your personal details and links live here.
// Every component reads from this file, so you only change things once.

export const profile = {
  name: 'Rhammzthienne R. Tindoy',
  role: 'Full Stack Developer',
  pitch:
    'I build clean, useful web apps from the front end all the way to the database.',
  domain: 'rams.ninja',
  // Full address of the live site (used for links and SEO)
  siteUrl: 'https://www.rams.ninja/',
  school: 'Holy Cross of Davao College',
  location: 'Davao City, Philippines',

  // Place your photo at public/images/profile.jpg
  photo: '/images/profile.jpg',
  // Transparent cutout used on the hero ID card: public/images/id-photo.webp
  idPhoto: '/images/id-photo.webp?v=5',
  // Photo used in the About section: public/images/about.jpg
  aboutPhoto: '/images/about-cutout.webp?v=5',
  // Graphite (hover) and pencil-sketch (click) versions of the same cut-out
  aboutGraphite: '/images/about-graphite.webp?v=5',
  aboutSketch: '/images/about-sketch.webp?v=5',

  // EDIT ME: the text on the home page (hero).
  heroTitle: 'Welcome to',
  heroTitleAccent: 'My Portfolio',
  heroEyebrow: "Collection '26 · @rams",
  heroCity: 'Boulevard 8000',
  heroIntro:
    'Building full-stack web applications, mobile apps, and human-centered UI/UX experiences as an IT student and software builder.',
  // The subtitle types out each of these in turn.
  heroRoles: ['Fullstack Dev', 'Game Dev', 'BSIT Student'],
  // The paragraph under the subtitle: bold lead sentence, then supporting words.
  heroLead: 'I am a game developer. I implement what I imagine to play, from sketch to reality.',
  heroSupport:
    'Every game starts as a rough sketch and a spark of an idea. I design it, code it, test it, and polish it until it becomes something you can pick up and play. I build Minecraft Bedrock add-ons, and I bring the same problem-solving to clean, useful web apps, from the front end to the database.',

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

  // Resume: put your file at public/resume.pdf
  resumeUrl: '/resume.pdf',

  // Contact form: set your Formspree form ID (https://formspree.io) to send
  // messages without a backend. Leave it empty to use a mailto: link instead.
  formspreeId: '',
} as const
