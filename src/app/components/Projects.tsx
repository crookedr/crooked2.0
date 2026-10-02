'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, PanInfo, useReducedMotion } from 'framer-motion'
import { useLanguage } from '../context/language-context'

type Lang = 'sk' | 'en'
type Project = {
  title: Record<Lang, string>
  description: Record<Lang, string>
  image: string
  images?: string[]
  github?: string
  demo: string
  isDemoAvailable: boolean
  format: 'landscape' | 'portrait' | 'square'
}

const projectTransition = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -90 : 90,
    opacity: 0,
  }),
}

export default function Projects() {
  const { language } = useLanguage()
  const lang = language as Lang
  const reduceMotion = useReducedMotion()
  const [[active, direction], setActive] = useState([0, 1])

  const projects = useMemo<Project[]>(() => [
    {
      title: { sk: 'OZ Hľadáme Dronom', en: 'OZ Hľadáme Dronom' },
      description: { sk: 'Webová prezentácia občianskeho združenia Hľadáme Dronom. Na jednom mieste približuje jeho príbeh, tím aj pomoc pri pátraní po nezvestných zvieratách a ochrane srnčej zveri pred kosbou.', en: 'The website of the Hľadáme Dronom civic association. It brings together its story, team and work helping to find missing animals and protect young deer before fields are mown.' },
      image: '/images/hladame-dronom.webp', demo: 'https://hladamedronom.sk/', isDemoAvailable: true, format: 'landscape',
    },
    {
      title: { sk: 'Hľadáme Dronom – aplikácia', en: 'Hľadáme Dronom – app' },
      description: { sk: 'Aplikácia pre pilotov, koordinátorov a dobrovoľníkov na jednoduchšiu koordináciu a efektívnejšiu prácu pri pátracích akciách. Momentálne je v review pre Google Play a App Store.', en: 'An app for pilots, coordinators and volunteers that makes coordination and search operations more efficient. It is currently in review for Google Play and the App Store.' },
      image: '/images/aplikacia.jpg', images: ['/images/aplikacia.jpg', '/images/apk2.jpg'], demo: '', isDemoAvailable: false, format: 'portrait',
    },
    {
      title: { sk: 'FRIO – Next.js Blog', en: 'FRIO – Next.js Blog' },
      description: { sk: 'Blog v Next.js a Tailwind CSS s prihlasovaním, diskusiami a dynamickými článkami.', en: 'A Next.js and Tailwind CSS blog with authentication, discussions and dynamic articles.' },
      image: '/images/frio-mockup.png', github: 'https://github.com/crookedr/frioblog', demo: '', isDemoAvailable: false, format: 'landscape',
    },
    {
      title: { sk: 'SmoothUp – CS2 app', en: 'SmoothUp – CS2 app' },
      description: { sk: 'Desktop aplikácia na optimalizáciu výkonu v Counter-Strike 2.', en: 'A desktop app for optimizing performance in Counter-Strike 2.' },
      image: '/images/smoothuplogo.png', demo: '', isDemoAvailable: false, format: 'square',
    },
  ], [])

  const changeProject = useCallback((step: -1 | 1) => {
    setActive(([current]) => [
      (current + step + projects.length) % projects.length,
      step,
    ])
  }, [projects.length])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const section = document.getElementById('projects')
      if (!section || !section.contains(document.activeElement)) return
      if (event.key === 'ArrowLeft') { event.preventDefault(); changeProject(-1) }
      if (event.key === 'ArrowRight') { event.preventDefault(); changeProject(1) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [changeProject])

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const intent = Math.abs(info.offset.x) + Math.abs(info.velocity.x) * 0.15
    if (intent < 70) return
    changeProject(info.offset.x < 0 ? 1 : -1)
  }

  const project = projects[active]
  const duration = reduceMotion ? 0 : 0.52

  return (
    <section
      id="projects"
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label={lang === 'sk' ? 'Projekty' : 'Projects'}
      className="min-h-screen w-full overflow-hidden bg-gray-950 px-5 py-20 outline-none md:px-8"
    >
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col justify-center">
        <h2 className="mb-8 text-3xl font-semibold text-white md:mb-10 md:text-4xl">{lang === 'sk' ? 'Projekty' : 'Projects'}</h2>

        <div className="relative">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.article
              key={project.title.en}
              custom={direction}
              variants={reduceMotion ? undefined : projectTransition}
              aria-live="off"
              drag={reduceMotion ? false : 'x'}
              dragConstraints={{ left: -180, right: 180 }}
              dragElastic={0.35}
              dragMomentum={false}
              onDragEnd={onDragEnd}
              initial={reduceMotion ? { opacity: 1 } : 'enter'}
              animate={reduceMotion ? { opacity: 1 } : 'center'}
              exit={reduceMotion ? { opacity: 1 } : 'exit'}
              transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
              className="cursor-grab select-none active:cursor-grabbing"
            >
              <motion.div
                initial={reduceMotion ? false : { scale: 0.965 }}
                animate={{ scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex w-full items-center justify-center overflow-hidden bg-black/20 ${
                  project.format === 'portrait'
                    ? 'h-[420px] md:h-[520px]'
                    : 'aspect-[16/10] max-h-[62vh] min-h-[260px] md:aspect-[16/8.5]'
                }`}
              >
                {project.images ? (
                  <div className="flex h-full w-full items-center justify-center gap-3 sm:gap-5 md:gap-7">
                    {project.images.map((image, index) => (
                      <motion.div
                        key={image}
                        animate={reduceMotion ? undefined : {
                          y: index === 0 ? [0, -7, 0] : [0, 7, 0],
                        }}
                        transition={reduceMotion ? undefined : {
                          duration: 6.5,
                          delay: index * 0.45,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="relative h-[78%] aspect-[9/20] md:h-[88%]"
                      >
                        <Image
                          src={image}
                          alt={`${project.title[lang]} – ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 150px, 220px"
                          className="pointer-events-none object-contain"
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    animate={reduceMotion ? undefined : {
                      scale: [1, 1.012, 1],
                      x: [0, -5, 0],
                    }}
                    transition={reduceMotion ? undefined : {
                      duration: 8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className={project.format === 'portrait' ? 'relative h-[82%] aspect-[9/20]' : project.format === 'square' ? 'relative h-[68%] aspect-square' : 'relative h-full w-full'}
                  >
                    <Image
                      src={project.image}
                      alt={project.title[lang]}
                      fill
                      sizes={project.format === 'portrait' ? '(max-width: 768px) 180px, 240px' : '(max-width: 768px) 100vw, 1152px'}
                      className="pointer-events-none object-contain"
                      priority={active === 0}
                    />
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: direction > 0 ? 28 : -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 grid gap-4 md:grid-cols-[minmax(0,0.75fr)_minmax(18rem,1fr)] md:gap-12"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <h3 className="text-xl font-medium leading-snug text-white md:text-2xl">{project.title[lang]}</h3>
                  {project.isDemoAvailable && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" onPointerDown={(event) => event.stopPropagation()} className="group/link relative py-1 text-sm text-gray-400 transition-colors hover:text-white">
                      {lang === 'sk' ? 'Navštíviť web' : 'Visit website'}
                      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-white/70 transition-transform duration-200 group-hover/link:scale-x-100" />
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" onPointerDown={(event) => event.stopPropagation()} className="group/link relative py-1 text-sm text-gray-400 transition-colors hover:text-white">
                      {lang === 'sk' ? 'Zdrojový kód' : 'Source code'}
                      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-white/70 transition-transform duration-200 group-hover/link:scale-x-100" />
                    </a>
                  )}
                </div>
                <div>
                  <p className="max-w-xl text-sm leading-6 text-gray-400 md:text-base md:leading-7">{project.description[lang]}</p>
                </div>
              </motion.div>
            </motion.article>
          </AnimatePresence>

          <button type="button" onClick={() => changeProject(-1)} aria-label={lang === 'sk' ? 'Predchádzajúci projekt' : 'Previous project'} className="absolute left-3 top-[42%] z-10 -translate-y-1/2 cursor-pointer px-3 py-4 text-2xl text-white/55 transition-colors hover:text-white md:-left-14">←</button>
          <button type="button" onClick={() => changeProject(1)} aria-label={lang === 'sk' ? 'Nasledujúci projekt' : 'Next project'} className="absolute right-3 top-[42%] z-10 -translate-y-1/2 cursor-pointer px-3 py-4 text-2xl text-white/55 transition-colors hover:text-white md:-right-14">→</button>
        </div>
      </div>
    </section>
  )
}
