# rams.ninja: Personal Portfolio

Portfolio website for **Rhammzthienne R. Tindoy**, Full Stack Developer and 3rd year BSIT student at Holy Cross of Davao College.

Built with **React, TypeScript, Tailwind CSS, and Vite**. There is no backend.

## 1. Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
cd F:\Ram_Portfolio
npm install
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

Other commands:

```bash
npm run build     # type-check and create the production build in /dist
npm run preview   # preview the production build locally
```

## 2. Edit your content

Almost everything is edited in the `src/data/` folder. Look for `EDIT ME` comments.

| What you want to change | File |
| --- | --- |
| Name, bio, emails, Discord, GitHub, Facebook, Formspree ID | `src/data/profile.ts` |
| Projects (title, description, tech tags, role, image, GitHub, live demo, featured) | `src/data/projects.ts` |
| Skills (add Git/GitHub, Node.js, and more) | `src/data/skills.ts` |
| Certifications (section appears when you add the first item) | `src/data/certifications.ts` |
| Experience (section appears when you add the first item) | `src/data/experience.ts` |
| Page title, meta description, Open Graph tags | `index.html` |
| Accent color | `tailwind.config.js` (the `accent` colors) |

### Add your photos and resume

Put these files in the `public/` folder using the exact names:

- `public/images/profile.jpg`: your photo for the first page (square, at least 400 x 400 px)
- `public/images/about.jpg`: your photo for the About Me section (portrait, 4:5, for example 960 x 1200 px)
- `public/images/project-1.png`: screenshot for Physical Health Monitoring
- `public/images/project-2.png`: screenshot for Multi-Page Student Directory
- `public/images/og-image.png`: preview image for social sharing (1200 x 630 px)
- `public/resume.pdf`: your resume (a placeholder file is included, replace it)

Until you add your own images, labeled placeholder images are shown automatically.

### Update project details

In `src/data/projects.ts`:

1. Replace the `EDIT ME` tech tags with the technologies you used.
2. Replace each `githubUrl` with the exact repository URL.
3. Every project card has one "View Project" button. It opens `liveUrl` if you set one, otherwise `githubUrl`. If a project has both, a second "GitHub" button also appears.
4. Set `featured: true` to list a project first.

### Add skills

In `src/data/skills.ts`, add a line such as:

```ts
{ name: 'Git and GitHub', category: 'Tools' },
{ name: 'Node.js', category: 'Backend' },
```

### Contact form

By default, the form opens the visitor's email app with a pre-filled message to your primary email (`mailto:`).

To receive messages directly instead:

1. Create a free form at [formspree.io](https://formspree.io).
2. Copy the form ID (the part after `/f/` in your endpoint).
3. Paste it into `formspreeId` in `src/data/profile.ts`.

## 3. Deploy for free

First, push the project to GitHub:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/r4m2306/YOUR-REPO-NAME.git
git push -u origin main
```

### Option A: Vercel

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. Click **Add New > Project** and import your repository.
3. Vercel detects Vite automatically. Click **Deploy**.

### Option B: Netlify

1. Sign in at [netlify.com](https://www.netlify.com) with GitHub.
2. Click **Add new site > Import an existing project** and pick your repository.
3. Build command: `npm run build`. Publish directory: `dist`. Click **Deploy**.

## 4. Your domain (rams.ninja) and automatic updates

The live site is at https://www.rams.ninja/.

**Automatic updates.** Vercel and Netlify both rebuild and publish your site every time you push to the `main` branch of your GitHub repository, so you never upload files by hand. Your update routine is:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Wait about a minute, then refresh https://www.rams.ninja/ (press Ctrl + F5 if you still see the old version).

**Check it is connected to your repository.** On the host's dashboard:

- **Vercel:** open the project, then **Settings > Git**. It should show `r4m2306/RamPortFolio` and the branch `main`.
- **Netlify:** open the site, then **Site configuration > Build and deploy > Continuous deployment**. It should show the same repository and branch.

If it is not connected, import the repository again (see section 3). Settings for both hosts: build command `npm run build`, output folder `dist`.

**Domain settings.** In **Settings > Domains** (Vercel) or **Domain management** (Netlify), make sure both `rams.ninja` and `www.rams.ninja` are added, and pick one as the main address. The site's SEO tags use `https://www.rams.ninja/`, so make `www.rams.ninja` the main one and redirect `rams.ninja` to it.

If the domain ever stops working, check the DNS records at your registrar against the ones the host shows:

- an **A record** for `@` pointing to the IP address your host gives you, and
- a **CNAME record** for `www` pointing to your host's address.

## Project structure

```
Ram_Portfolio/
  index.html              SEO, Open Graph, favicon, fonts
  public/                 favicon, resume.pdf, images/
  src/
    assets/               icons
    components/           Navbar, SectionTitle, ProjectCard, SkillBadge,
                          ContactForm, Footer, and more
      sections/           Hero, About, Skills, Projects, Experience,
                          Certifications, Resume, Contact
    data/                 profile, projects, skills, certifications, experience
    hooks/                theme, active section, scroll reveal
    types/                TypeScript types
```
