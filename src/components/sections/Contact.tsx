import { profile } from '../../data/profile'
import { DiscordIcon, FacebookIcon, GithubIcon, MailIcon } from '../../assets/icons'
import ContactForm from '../ContactForm'
import CopyButton from '../CopyButton'
import Section from '../Section'
import SectionTitle from '../SectionTitle'

const rowLink =
  'flex items-center gap-3 font-medium text-slate-800 hover:text-accent-600 dark:text-slate-200 dark:hover:text-accent-400'

export default function Contact() {
  return (
    <Section id="contact" labelledBy="contact-title">
      <SectionTitle
        id="contact-title"
        eyebrow="Let's talk"
        title="Contact"
        subtitle="I am open to OJT, internship, and entry-level opportunities. Send me a message and I will get back to you."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card space-y-6 p-6 sm:p-8">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email
            </p>
            <a href={`mailto:${profile.email}`} className={rowLink}>
              <MailIcon className="shrink-0 text-accent-600 dark:text-accent-400" />
              <span className="break-all">{profile.email}</span>
            </a>
            <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Alternate email
            </p>
            <a href={`mailto:${profile.secondaryEmail}`} className={rowLink}>
              <MailIcon className="shrink-0 text-accent-600 dark:text-accent-400" />
              <span className="break-all">{profile.secondaryEmail}</span>
            </a>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Discord
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <DiscordIcon className="shrink-0 text-accent-600 dark:text-accent-400" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{profile.discord}</span>
              <CopyButton text={profile.discord} label="Copy Discord username" />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Find me online
            </p>
            <div className="flex flex-col gap-3">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className={rowLink}>
                <GithubIcon className="shrink-0 text-accent-600 dark:text-accent-400" /> GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className={rowLink}>
                <FacebookIcon className="shrink-0 text-accent-600 dark:text-accent-400" /> Facebook
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </Section>
  )
}
