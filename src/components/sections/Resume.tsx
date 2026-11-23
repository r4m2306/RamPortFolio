import { profile } from '../../data/profile'
import { DownloadIcon } from '../../assets/icons'
import Section from '../Section'
import SectionTitle from '../SectionTitle'

export default function Resume() {
  return (
    <Section id="resume" labelledBy="resume-title">
      <SectionTitle
        id="resume-title"
        eyebrow="Take a closer look"
        title="Resume"
        subtitle="Download my resume to see my education, skills, and projects in one place."
      />
      <div className="text-center">
        {/* Put your file at public/resume.pdf */}
        <a href={profile.resumeUrl} download="Rhammzthienne-Tindoy-Resume.pdf" className="btn-primary">
          <DownloadIcon width={18} height={18} /> Download Resume
        </a>
      </div>
    </Section>
  )
}
