import { sortedProjects } from '../../data/projects'
import ProjectCard from '../ProjectCard'
import Section from '../Section'
import SectionTitle from '../SectionTitle'

export default function Projects() {
  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionTitle
        id="projects-title"
        eyebrow="My work"
        title="Projects"
        subtitle="A few things I have built. Featured projects appear first."
      />
      <div className="grid gap-8 md:grid-cols-2">
        {sortedProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </Section>
  )
}
