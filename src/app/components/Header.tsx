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
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <motion.header
      className="fixed top-0 left-0 w-full z-50"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)]" />

      <div className="relative max-w-7xl mx-auto px-6 h-[72px] flex justify-between items-center">

        {/* logo */}
        <button
          onClick={() => navigate(0)}
          className="font-mono text-[15px] text-white/75 hover:text-white transition-colors duration-200 tracking-wide cursor-pointer"
        >
          &lt;crookedr /&gt;
        </button>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
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
        <div className="md:hidden flex items-center gap-3">
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
            className="md:hidden absolute top-[72px] left-0 right-0 bg-gray-950/98 backdrop-blur-xl shadow-xl px-6 py-4"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                className={`relative block w-full text-left py-3.5 text-base transition-colors ${
                  current === i
                    ? 'text-sky-200'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {language === 'sk' ? item.sk : item.en}
                {current === i && <span className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_8px_2px_rgba(125,211,252,0.55)]" />}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
