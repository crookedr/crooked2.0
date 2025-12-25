'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../context/language-context'
import { useEffect, useState } from 'react'

const wordsSk = [
  'sa dajú používať bez návodu',
  'pôsobia upratane',
  'by som sa nebál podpísať',
]

const wordsEn = [
  'can be used without a manual',
  'feel clean and uncluttered',
  'I’d proudly sign my name',
]

export default function About() {
  const { language } = useLanguage()
  const isSk = language === 'sk'

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % (isSk ? wordsSk.length : wordsEn.length))
    }, 2600)
    return () => clearInterval(id)
  }, [isSk])

  const currentWord = isSk ? wordsSk[index] : wordsEn[index]

  return (
    <section
      id="about"
      className="scroll-mt-24 py-24 px-6 bg-gray-950"
    >
      <div className="max-w-5xl mx-auto">
        <div className="max-w-3xl">
          <motion.p
            className="text-[11px] tracking-[0.35em] uppercase text-blue-300/80 mb-4"
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            {isSk ? 'O mne' : 'About me'}
          </motion.p>

          <motion.h2
            className="text-3xl md:text-5xl font-semibold text-white leading-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
          >
            {isSk ? 'Rád robím veci, ktoré' : 'I like building things that'}{' '}
            <span className="inline-block relative">
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-sky-300"
              >
                {currentWord}
              </motion.span>
              <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
            </span>
            .
          </motion.h2>

          <motion.p
            className="mt-5 text-sm md:text-base text-gray-300 max-w-xl"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            {isSk
              ? 'Záleží mi na tom, aby veci pôsobili prirodzene, mali jasnú myšlienku a dali sa bez problémov používať.'
              : 'I focus on building things that make sense, feel natural and stand the test of time.'}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
