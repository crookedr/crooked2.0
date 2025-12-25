'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../context/language-context'

type SkillGroup = 'core' | 'workflow' | 'creative'

type Skill = {
  name: string
  icon: string
  group: SkillGroup
}

const skills: Skill[] = [
  { name: 'TypeScript', icon: '/icons/typescript.svg', group: 'core' },
  { name: 'React', icon: '/icons/react.svg', group: 'core' },
  { name: 'Next.js', icon: '/icons/nextjs.svg', group: 'core' },
  { name: 'Tailwind CSS', icon: '/icons/tailwind.svg', group: 'core' },
  { name: 'JavaScript', icon: '/icons/javascript.svg', group: 'core' },

  { name: 'Git', icon: '/icons/git.svg', group: 'workflow' },
  { name: 'MySQL', icon: '/icons/mysql.svg', group: 'workflow' },

  { name: 'ChatGPT', icon: '/icons/openai.svg', group: 'creative' },
  { name: 'DaVinci Resolve', icon: '/icons/davinciresolve.svg', group: 'creative' },
]

function groupTitle(group: SkillGroup, isSk: boolean) {
  if (group === 'core') return isSk ? 'Core frontend stack' : 'Core frontend stack'
  if (group === 'workflow') return isSk ? 'Workflow okolo projektu' : 'Project workflow'
  return isSk ? 'Vizualita & AI' : 'Visuals & AI'
}

function groupDesc(group: SkillGroup, isSk: boolean) {
  if (group === 'core') {
    return isSk
      ? 'Technológie, v ktorých trávim najviac času pri tvorbe rozhraní a logiky.'
      : 'Technologies I spend most of my time in when building UI and logic.'
  }
  if (group === 'workflow') {
    return isSk
      ? 'Nástroje, ktoré držia projekt pokope – história, dáta a nasadenie.'
      : 'Tools that keep the project together – history, data and deployment.'
  }
  return isSk
    ? 'Doplnky, ktoré riešia vizuál, pohyb alebo nápady okolo projektu.'
    : 'Extras for visuals, motion and ideas around a project.'
}

function SkillPill({ skill }: { skill: Skill }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gray-900/80 px-3 py-1.5 text-xs text-gray-100 shadow-[0_0_0_1px_rgba(15,23,42,0.9)] hover:border-sky-400/70 hover:bg-gray-900 transition-all"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={skill.icon}
          alt={skill.name}
          className="h-3.5 w-3.5 invert opacity-90"
        />
      </div>
      <span className="whitespace-nowrap">{skill.name}</span>
    </motion.div>
  )
}

export default function Skills() {
  const { language } = useLanguage()
  const isSk = language === 'sk'

  const groups: SkillGroup[] = ['core', 'workflow', 'creative']

  return (
    <section
      id="skills"
      className="scroll-mt-24 w-full bg-gray-950 py-24 px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="max-w-xl space-y-6"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-sky-300/80">
            {isSk ? 'Skills & tools' : 'Skills & tools'}
          </p>

          <div className="space-y-3">
            <h2 className="text-3xl font-semibold md:text-4xl text-white">
              {isSk
                ? 'Technológie, s ktorými reálne pracujem'
                : 'Technologies I actually work with'}
            </h2>
            <p className="text-sm text-gray-300 md:text-base">
              {isSk
                ? 'Nejde mi o to mať čo najdlhší zoznam log. Skôr o to, aby spolu nástroje dávali zmysel a aby som v nich vedel postaviť reálne veci – od rozhrania až po nasadenie.'
                : 'I’m not trying to collect as many logos as possible. I care more about how well tools fit together and whether I can use them to build something real – from interface to deployment.'}
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs text-gray-300">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sky-400/60 bg-gray-900 text-[11px] font-mono text-sky-100">
                01
              </span>
              <p>
                {isSk
                  ? 'Frontend beriem vážne – nestačí, aby to fungovalo, musí to pôsobiť prirodzene pri používaní.'
                  : 'I care about frontend – it’s not enough that it works, it should feel natural to use.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="flex items-center gap-3"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sky-400/60 bg-gray-900 text-[11px] font-mono text-sky-100">
                02
              </span>
              <p>
                {isSk
                  ? 'TypeScript používam kvôli prehľadnosti a dlhodobej udržateľnosti projektov.'
                  : 'I use TypeScript for clarity and to keep projects maintainable over time.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.35, delay: 0.19 }}
              className="flex items-center gap-3"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sky-400/60 bg-gray-900 text-[11px] font-mono text-sky-100">
                03
              </span>
              <p>
                {isSk
                  ? 'AI a vizuálne nástroje beriem ako doplnok – spôsob, ako projekt posunúť o kúsok ďalej.'
                  : 'I treat AI and visual tools as an addition – not a shortcut, but a way to push a project a bit further.'}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative mt-6 overflow-hidden rounded-full border border-white/10 bg-gradient-to-r from-sky-500/10 via-transparent to-blue-500/10"
          >
            <motion.div
              aria-hidden="true"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}
              className="flex min-w-max gap-6 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-gray-300"
            >
              {Array.from({ length: 2 }).map((_, loopIndex) => (
                <span key={loopIndex} className="flex items-center gap-6">
                  <span>React</span>
                  <span className="h-[1px] w-10 bg-sky-500/60" />
                  <span>Next.js</span>
                  <span className="h-[1px] w-10 bg-sky-500/60" />
                  <span>TypeScript</span>
                  <span className="h-[1px] w-10 bg-sky-500/60" />
                  <span>Tailwind</span>
                  <span className="h-[1px] w-10 bg-sky-500/60" />
                  <span>Git workflow</span>
                  <span className="h-[1px] w-10 bg-sky-500/60" />
                  <span>MySQL</span>
                  <span className="h-[1px] w-10 bg-sky-500/60" />
                  <span>ChatGPT</span>
                  <span className="h-[1px] w-10 bg-sky-500/60" />
                  <span>DaVinci Resolve</span>
                </span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="relative flex-1 space-y-5"
        >
          <div className="pb-2 text-[11px] font-mono uppercase tracking-[0.22em] text-gray-400">
            {isSk ? 'Prehľad stacku podľa oblasti' : 'Stack overview by area'}
          </div>

          {groups.map((group, groupIndex) => {
            const groupSkills = skills.filter((s) => s.group === group)
            const title = groupTitle(group, isSk)
            const desc = groupDesc(group, isSk)

            return (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: groupIndex * 0.09 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/80 px-4 py-4 sm:px-5 sm:py-5"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400" />

                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    {title}
                  </h3>
                  <p className="text-[11px] text-gray-400 sm:max-w-xs sm:text-right">
                    {desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {groupSkills.map((skill) => (
                    <SkillPill key={skill.name} skill={skill} />
                  ))}
                </div>
              </motion.div>
            )
          })}

          <p className="mt-3 text-[11px] text-gray-500">
            {isSk
              ? 'Je to skôr mapa technológií, ktoré používam najčastejšie, než formálne „skill levely“.'
              : 'This is more of a map of the tools I use most often than a formal “skill level” list.'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
