'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../context/language-context'
import { motion } from 'framer-motion'

type Lang = 'sk' | 'en'

type Project = {
  title: Record<Lang, string>
  description: Record<Lang, string>
  image: string
  github?: string
  demo: Record<Lang, string>
  isDemoAvailable: boolean
}

export default function Projects() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const { language } = useLanguage()

  const [itemsPerPage, setItemsPerPage] = useState(2)

  useEffect(() => {
    const calc = () => setItemsPerPage(window.innerWidth < 768 ? 1 : 2)
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const translatedTitle = {
    sk: 'Projekty',
    en: 'Projects',
  } as const

  const projects = useMemo<Project[]>(
    () => [
      {
        title: { sk: 'OZ Hľadáme Dronom', en: 'OZ Hľadáme Dronom' },
        description: {
          sk: 'Web pre občianske združenie zamerané na dostupné pokrytie hľadania zvierat dronom, povedomie pokrytia a tímu združenia. Taktiež príbeh o vzniku.',
          en: 'Website for a civic association focused on affordable drone coverage for animal searches, awareness of coverage and the association team. Also the story of its origin.',
        },
        image: '/images/hladame-dronom.webp',
        demo: { sk: 'https://hladamedronom.sk/', en: 'https://hladamedronom.sk/' },
        isDemoAvailable: true,
      },
      {
        title: { sk: 'FRIO – Next.js Blog', en: 'FRIO – Next.js Blog' },
        description: {
          sk: 'Blog vytvorený v Next.js a Tailwind CSS. Obsahuje prihlasovanie, diskusie, dynamické články a čistý dizajn.',
          en: 'A blog created with Next.js and Tailwind CSS. It features authentication, discussions, dynamic articles, and clean design.',
        },
        image: '/images/frio-mockup.png',
        github: 'https://github.com/crookedr/frioblog',
        demo: { sk: 'Live demo zatiaľ nedostupné', en: 'Live demo not available yet' },
        isDemoAvailable: false,
      },
      {
        title: {
          sk: 'Crooked 2.0 – portfólio (nová verzia)',
          en: 'Crooked 2.0 – portfolio (new version)',
        },
        description: {
          sk: 'Nová verzia portfólia s lepším UX a čistejšou štruktúrou. Postupne ju vylepšujem a ladím do detailu.',
          en: 'A new portfolio version with improved UX and a cleaner structure. I’m iterating on it and polishing details over time.',
        },
        image: '/images/crooked2.png',
        demo: { sk: 'https://crookedr.com/', en: 'https://crookedr.com/' },
        isDemoAvailable: true,
      },
      {
        title: { sk: 'SmoothUp – CS2 app', en: 'SmoothUp – CS2 app' },
        description: {
          sk: 'Desktop appka zameraná na optimalizáciu výkonu v CS2.',
          en: 'A desktop app focused on optimizing performance in CS2.',
        },
        image: '/images/smoothuplogo.png',
        demo: { sk: 'Vo vývoji', en: 'In development' },
        isDemoAvailable: false,
      },
      {
        title: { sk: 'crookedr – portfólio stránka (1.0)', en: 'crookedr – portfolio page (1.0)' },
        description: {
          sk: 'Prvá verzia portfólia v Next.js.',
          en: 'The first portfolio version in Next.js.',
        },
        image: '/images/aboutme.png',
        github: 'https://github.com/crookedr/aboutme',
        demo: { sk: 'Už nedostupné', en: 'Offline' },
        isDemoAvailable: false,
      },              
    ],
    [],
  )

  const pages = useMemo(() => {
    const totalPages = Math.ceil(projects.length / itemsPerPage)
    return Array.from({ length: totalPages }, (_, pageIndex) =>
      projects.slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage),
    )
  }, [projects, itemsPerPage])

  const totalPages = pages.length

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, Math.max(0, totalPages - 1)))
  }, [totalPages])

  const handlePrev = () => setCurrentPage((p) => (p - 1 + totalPages) % totalPages)
  const handleNext = () => setCurrentPage((p) => (p + 1) % totalPages)

  const sectionV = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' as const },
    },
  }

  const gridV = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  }

  const cardV = {
    hidden: { opacity: 0, y: 14, scale: 0.995 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.42, ease: 'easeOut' as const },
    },
  }

  return (
    <motion.section
      id="projects"
      className="scroll-mt-24 px-4 sm:px-8 py-20 sm:py-24 bg-gray-950 text-white flex flex-col items-center"
      variants={sectionV}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="max-w-6xl w-full">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.35em] uppercase text-blue-300/80 mb-3">
            {language === 'sk' ? 'Výber projektov' : 'Selected work'}
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-3">
            {translatedTitle[language as Lang]}
          </h2>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 w-full overflow-hidden">
          <button
            onClick={handlePrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 hover:border-white/60 hover:bg-white/10 transition"
            aria-label="Previous projects"
          >
            ‹
          </button>

          <div className="overflow-hidden flex-1 min-w-0">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {pages.map((page, pageIndex) => (
                <motion.div
                  key={pageIndex}
                  variants={gridV}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.2 }}
                  className={`flex-shrink-0 w-full grid gap-6 ${
                    itemsPerPage === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
                  }`}
                >
                  {page.map((project, idx) => (
                    <motion.div
                      key={project.title.en + idx}
                      variants={cardV}
                      className="bg-gray-900/90 rounded-3xl overflow-hidden border border-white/10 flex flex-col"
                    >
                      <div
                        className="cursor-zoom-in bg-black"
                        onClick={() => setSelectedImage(project.image)}
                      >
                        <Image
                          src={project.image}
                          alt={project.title[language as Lang]}
                          width={900}
                          height={520}
                          className="w-full aspect-video object-contain"
                        />
                      </div>

                      <div className="p-5 sm:p-7 flex flex-col gap-4 flex-1">
                        <h3 className="text-xl sm:text-2xl font-semibold">
                          {project.title[language as Lang]}
                        </h3>

                        <p className="text-gray-300 text-sm md:text-base">
                          {project.description[language as Lang]}
                        </p>

                        <div className="mt-auto flex flex-wrap gap-3">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
                            >
                              GitHub
                            </a>
                          )}

                          {project.isDemoAvailable ? (
                            <a
                              href={project.demo[language as Lang]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 transition"
                            >
                              Live
                            </a>
                          ) : (
                            <span className="w-full sm:w-auto rounded-full bg-gray-800 px-5 py-2.5 text-sm text-gray-400 text-center">
                              {project.demo[language as Lang]}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 hover:border-white/60 hover:bg-white/10 transition"
            aria-label="Next projects"
          >
            ›
          </button>
        </div>

        <div className="flex gap-2 mt-6 justify-center">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === currentPage ? 'bg-white w-7' : 'bg-white/30 w-2.5 hover:bg-white/60'
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <Image
              src={selectedImage}
              alt={language === 'sk' ? 'Náhľad obrázka' : 'Image preview'}
              width={1400}
              height={900}
              className="max-h-[85vh] max-w-[95%] object-contain rounded-xl"
            />
          </div>
        )}
      </div>
    </motion.section>
  )
}
