'use client'

import { useLanguage } from '../context/language-context'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      {(['sk', 'en'] as const).map((lang, i) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-1.5 py-1 text-xs font-semibold tracking-wide transition-colors ${
            language === lang
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {i > 0 && <span aria-hidden="true" className="mr-2 text-gray-700">/</span>}
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
