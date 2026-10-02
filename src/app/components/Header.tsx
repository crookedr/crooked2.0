'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { useLanguage } from '../context/language-context'
import { useSectionCtx } from '../context/section-context'
import LanguageSwitcher from './LanguageSwitcher'

const navItems = [
  { sk: 'Domov',     en: 'Home' },
  { sk: 'Projekty',  en: 'Projects' },
  { sk: 'Skúsenosti', en: 'Experience' },
  { sk: 'Kontakt',   en: 'Contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useLanguage()
  const { current, goTo } = useSectionCtx()

  const navigate = (index: number) => {
    goTo(index)
    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  return (
    <motion.header
      className="site-header pointer-events-none fixed top-0 left-0 w-full z-50"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="relative z-50 max-w-7xl mx-auto px-6 h-[72px] flex justify-between items-center">

        {/* logo */}
        <button
          onClick={() => navigate(0)}
          className="pointer-events-auto font-mono text-[15px] text-white/75 hover:text-white transition-colors duration-200 tracking-wide cursor-pointer"
        >
          &lt;crookedr /&gt;
        </button>

        {/* desktop nav */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-2">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(i)}
              className={`relative px-3 py-2 text-[15px] transition-colors duration-200 ${
                current === i
                  ? 'text-sky-200 drop-shadow-[0_0_8px_rgba(125,211,252,0.45)]'
                  : 'text-gray-500 hover:text-gray-200'
              }`}
            >
              {language === 'sk' ? item.sk : item.en}
              {current === i && (
                <motion.span
                  layoutId="active-nav-light"
                  className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sky-300 shadow-[0_0_9px_2px_rgba(125,211,252,0.55)]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          ))}
          <div className="ml-3">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* mobile: lang + burger */}
        <div className="pointer-events-auto md:hidden flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            data-section-scroll-lock
            className="pointer-events-auto fixed inset-0 z-40 flex min-h-dvh flex-col bg-gray-950 px-6 pb-8 pt-24 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex flex-1 flex-col justify-center">
              {navItems.map((item, i) => (
                <motion.button
                  key={i}
                  onClick={() => navigate(i)}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, delay: 0.12 + i * 0.055 }}
                  className={`block w-full py-2.5 text-left text-4xl font-medium tracking-[-0.035em] transition-colors sm:text-5xl ${
                    current === i
                      ? 'text-sky-200'
                      : 'text-gray-600 hover:text-white'
                  }`}
                >
                  {language === 'sk' ? item.sk : item.en}
                </motion.button>
              ))}
            </div>

            <motion.a
              href="mailto:hatnancikroman@gmail.com"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.34 }}
              className="max-w-max text-sm text-gray-500 transition-colors hover:text-white"
            >
              hatnancikroman@gmail.com
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
