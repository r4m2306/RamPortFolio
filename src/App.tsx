import { useCallback, useState } from 'react'
import { useTheme } from './hooks/useTheme'
import Intro from './components/Intro'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Experience from './components/sections/Experience'
import Certifications from './components/sections/Certifications'
import Resume from './components/sections/Resume'
import Contact from './components/sections/Contact'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [introDone, setIntroDone] = useState(false)
  const finishIntro = useCallback(() => setIntroDone(true), [])

  return (
    <>
      <Intro onDone={finishIntro} />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main id="main">
        <Hero ready={introDone} />
        <About />
        <Skills />
        <Projects />
        {/* Experience and Certifications render only when their data arrays have items */}
        <Experience />
        <Certifications />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
