import { profile } from '../data/profile'
import { ArrowUpIcon, FacebookIcon, GithubIcon, MailIcon } from '../assets/icons'

const iconLink =
  'rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-accent-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-accent-400'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 text-center sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" className={iconLink}>
            <GithubIcon width={22} height={22} />
          </a>
          <a href={profile.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook (opens in a new tab)" className={iconLink}>
            <FacebookIcon width={22} height={22} />
          </a>
          <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} className={iconLink}>
            <MailIcon width={22} height={22} />
          </a>
        </div>

        <a
          href={`mailto:${profile.email}`}
          className="text-sm font-medium text-slate-700 hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
        >
          {profile.email}
        </a>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2026 {profile.name} | {profile.domain}
          </p>
          <a href="#home" className="btn-outline !px-4 !py-2">
            <ArrowUpIcon width={16} height={16} /> Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
