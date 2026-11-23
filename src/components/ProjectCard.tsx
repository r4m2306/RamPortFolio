import type { Project } from '../types'
import { ExternalIcon, GithubIcon } from '../assets/icons'

interface ProjectCardProps {
  project: Project
}

// Shows a placeholder image if the real screenshot has not been added yet.
const FALLBACK_IMAGE = '/images/project-placeholder.svg'

export default function ProjectCard({ project }: ProjectCardProps) {
  const {
    title,
    description,
    techStack,
    role,
    image,
    imageAlt,
    githubUrl,
    liveUrl,
    featured,
  } = project

  // Every card gets the same "View Project" button. It opens the live demo
  // if there is one, otherwise the GitHub repository.
  const projectUrl = liveUrl ?? githubUrl
  // If a project has BOTH a live demo and a repo, the repo gets a second button.
  const showGithubButton = Boolean(liveUrl && githubUrl)

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-video overflow-hidden bg-accent-50 dark:bg-slate-800">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          width={640}
          height={360}
          onError={(e) => {
            const img = e.currentTarget
            if (!img.src.endsWith(FALLBACK_IMAGE)) img.src = FALLBACK_IMAGE
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-600 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm font-medium text-accent-600 dark:text-accent-400">
          My role: {role}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
          {techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          {projectUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !px-4 !py-2"
              aria-label={`View Project: ${title} (opens in a new tab)`}
            >
              <ExternalIcon width={16} height={16} /> View Project
            </a>
          )}
          {showGithubButton && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline !px-4 !py-2"
              aria-label={`View ${title} on GitHub (opens in a new tab)`}
            >
              <GithubIcon width={16} height={16} /> GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
