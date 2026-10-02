'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { useLanguage } from '../context/language-context'
import LanguageSwitcher from './LanguageSwitcher'

const navItems = [
  { id: 'hero', sk: 'Domov', en: 'Home' },
  { id: 'projects', sk: 'Projekty', en: 'Projects' },
  { id: 'about', sk: 'O mne', en: 'About' },
  { id: 'skills', sk: 'Zručnosti', en: 'Skills' },
  { id: 'contact', sk: 'Kontakt', en: 'Contact' },
]

const fullText = '<crookedr />'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [isTypingDone, setIsTypingDone] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    let i = 0
    const typing = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1))
      i++
      if (i === fullText.length) {
        clearInterval(typing)
        setIsTypingDone(true)
      }
    }, 100)

    return () => clearInterval(typing)
  }, [])

  const label = (item: (typeof navItems)[number]) =>
    language === 'sk' ? item.sk : item.en

  return (
    <motion.header
      className="fixed top-0 left-0 w-full z-50"
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-transparent backdrop-blur-md border-b border-white/10" />

      <div className="relative max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <a
          href="#hero"
          className="text-white text-lg md:text-xl font-mono tracking-wide relative group"
        >
          <span className="group-hover:text-blue-400 transition-colors">
            {typedText}
          </span>
          {!isTypingDone && (
            <span className="ml-1 animate-pulse text-blue-400 font-bold">
              █
            </span>
          )}
        </a>

        <nav className="hidden md:flex gap-6 items-center text-sm tracking-wide">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group relative text-gray-300 hover:text-white transition pb-1"
            >
              <span>{label(item)}</span>
              <span className="pointer-events-none absolute left-0 -bottom-0.5 h-0.5 w-full origin-left scale-x-0 bg-blue-500 group-hover:scale-x-100 transition-transform duration-300" />
            </a>
          ))}

          <LanguageSwitcher />
        </nav>

        <div className="md:hidden text-white text-2xl">
          <button onClick={() => setIsOpen((v) => !v)} aria-label="Toggle menu">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="md:hidden bg-black/95 backdrop-blur-md text-white px-6 pb-6 pt-2 space-y-3 text-center border-b border-white/10"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsOpen(false)}
                className="block text-base text-gray-300 hover:text-white transition py-1.5"
              >
                {label(item)}
              </a>
            ))}
            <div className="pt-2 flex justify-center">
              <LanguageSwitcher />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
