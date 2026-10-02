import Header from './components/Header'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import CubeScroller from './components/CubeScroller'
import { SectionProvider } from './context/section-context'

export default function Home() {
  return (
    <SectionProvider total={4}>
      <Header />
      <CubeScroller>
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </CubeScroller>
    </SectionProvider>
  )
}
