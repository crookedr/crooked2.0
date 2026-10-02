'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../context/language-context'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="relative flex items-center rounded-full border border-white/15 bg-black/60 p-1 backdrop-blur">
      <motion.div
        layout
        className="absolute top-1 bottom-1 w-[44px] rounded-full bg-white/10"
        animate={{ x: language === 'sk' ? 0 : 44 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      />

      <button
        onClick={() => setLanguage('sk')}
        className={`relative z-10 w-[44px] py-1 text-xs font-medium transition-colors ${
          language === 'sk' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        SK
      </button>

      <button
        onClick={() => setLanguage('en')}
        className={`relative z-10 w-[44px] py-1 text-xs font-medium transition-colors ${
          language === 'en' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        EN
      </button>
    </div>
  )
}
