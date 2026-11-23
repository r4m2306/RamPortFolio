import { useTheme } from './hooks/useTheme'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Experience from './components/sections/Experience'
import Education from './components/sections/Education'
import Certifications from './components/sections/Certifications'
import Resume from './components/sections/Resume'
import Contact from './components/sections/Contact'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        {/* Experience and Certifications render only when their data arrays have items */}
        <Experience />
        <Education />
        <Certifications />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
