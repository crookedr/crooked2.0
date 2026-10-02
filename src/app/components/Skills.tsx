'use client'

import Image from 'next/image'
import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '../context/language-context'

const jobs = [
  {
    periodSk: '2025 – dnes',
    periodEn: '2025 – present',
    roleSk: 'IT Support & Software Tester',
    roleEn: 'IT Support & Software Tester',
    company: 'TSS Group',
  },
  {
    periodSk: '2022',
    periodEn: '2022',
    roleSk: 'IT System Administrator',
    roleEn: 'IT System Administrator',
    company: 'LEONI',
  },
  {
    periodSk: '2021 – 2022',
    periodEn: '2021 – 2022',
    roleSk: 'IT Technician',
    roleEn: 'IT Technician',
    company: 'PJG',
  },
  {
    periodSk: '2020 – 2021',
    periodEn: '2020 – 2021',
    roleSk: 'Triáž',
    roleEn: 'Triage',
    company: 'Fakultná nemocnica Trenčín',
  },
]

const movingLogos = [
  { src: '/images/TSS.png', alt: 'TSS Group', left: '4%', width: 82, height: 82, duration: 8.2, delay: -1.4, drift: '38px', treatment: 'tss' },
  { src: '/images/LEONI.webp', alt: 'LEONI', left: '38%', width: 136, height: 58, duration: 9.4, delay: -6.2, drift: '-30px', treatment: 'mono' },
  { src: '/images/FNTN.png', alt: 'Fakultná nemocnica Trenčín', left: '11%', width: 148, height: 68, duration: 10.6, delay: -3.8, drift: '58px', treatment: 'mono' },
]

function LogoMotion({ fadeAtBottom = false }: { fadeAtBottom?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden"
      style={fadeAtBottom ? {
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 68%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 68%, transparent 100%)',
      } : undefined}
    >
      {movingLogos.map((logo, index) => (
        <div
          key={logo.src}
          className="experience-logo absolute top-0 flex items-center justify-center opacity-40"
          style={{
            left: logo.left,
            width: `${logo.width}px`,
            height: `${logo.height}px`,
            animationDuration: `${logo.duration}s`,
            animationDelay: `${logo.delay}s`,
            animationDirection: index % 2 === 0 ? 'normal' : 'reverse',
            '--logo-drift': logo.drift,
          } as CSSProperties}
        >
          <div className="relative h-full w-full">
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              sizes={`${logo.width}px`}
              className={`object-contain ${logo.treatment === 'tss' ? 'logo-tss' : 'logo-mono'}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Skills() {
  const { language } = useLanguage()
  const isSk = language === 'sk'
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="skills"
      className="flex h-[100dvh] min-h-0 w-full items-center overflow-hidden bg-gray-950 px-6 pb-4 pt-20 md:min-h-screen md:h-auto md:px-8 md:py-24"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-6xl"
      >
        <div className="hidden items-center gap-14 md:grid md:grid-cols-[minmax(17rem,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
          <div className="flex h-[510px] flex-col">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              {isSk ? 'Skúsenosti' : 'Experience'}
            </h2>
            <div className="mt-8 min-h-0 flex-1">
              <LogoMotion />
            </div>
          </div>

          <div className="flex min-h-[510px] flex-col justify-center gap-7 lg:gap-8">
            {jobs.map((job, index) => (
              <div
                key={job.company}
                className={`group transition-transform duration-300 hover:translate-x-1.5 ${
                  index === 0
                    ? 'ml-[28%]'
                    : index === 1
                      ? 'ml-[18%]'
                      : index === 2
                        ? 'ml-[9%]'
                        : 'ml-0'
                }`}
              >
                <ExperienceText job={job} isSk={isSk} current={index === 0} />
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden">
          <h2 className="text-3xl font-semibold text-white">
            {isSk ? 'Skúsenosti' : 'Experience'}
          </h2>
          <div className="h-[clamp(6rem,17dvh,9rem)]">
            <LogoMotion fadeAtBottom />
          </div>
          <div className="mt-2 space-y-2">
            {jobs.map((job, index) => (
              <div key={job.company} className={index === 0 ? 'text-white' : 'text-gray-300'}>
                <ExperienceText job={job} isSk={isSk} current={index === 0} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes logo-float {
          0% { transform: translate3d(0, 8px, 0) rotate(-3deg); }
          25% { transform: translate3d(var(--logo-drift), 62px, 0) rotate(2deg); }
          50% { transform: translate3d(8px, 148px, 0) rotate(4deg); }
          75% { transform: translate3d(var(--logo-drift), 78px, 0) rotate(-2deg); }
          100% { transform: translate3d(0, 8px, 0) rotate(-3deg); }
        }

        .experience-logo {
          animation-name: logo-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        .logo-mono {
          filter: brightness(0) invert(1);
        }

        .logo-tss {
          filter: invert(1) grayscale(1) contrast(8);
          mix-blend-mode: screen;
        }

        @media (prefers-reduced-motion: reduce) {
          .experience-logo { animation: none; }
        }
      `}</style>
    </section>
  )
}

function ExperienceText({
  job,
  isSk,
  current = false,
}: {
  job: (typeof jobs)[number]
  isSk: boolean
  current?: boolean
}) {
  return (
    <div>
      <p className="text-xs leading-4 text-gray-600 md:text-sm md:leading-6">
        {isSk ? job.periodSk : job.periodEn}
      </p>
      <h3 className={`${current ? 'mt-1 text-2xl md:text-[2.6rem]' : 'mt-1 text-xl md:text-[1.7rem]'} font-medium leading-tight tracking-[-0.025em] text-white`}>
        {job.company}
      </h3>
      <p className="mt-1 text-xs leading-4 text-gray-500 md:mt-1.5 md:text-base md:leading-6">
        {isSk ? job.roleSk : job.roleEn}
      </p>
    </div>
  )
}
