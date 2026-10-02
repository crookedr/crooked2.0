'use client'

import { useLanguage } from '@/app/context/language-context'

const content = {
  sk: {
    title: 'Zásady používania cookies',
    intro: 'Cookies sú malé textové súbory, ktoré pomáhajú webu fungovať a zlepšovať používateľský zážitok. Na tomto webe používam:',
    essentialTitle: 'Nevyhnutné cookies',
    essential: 'Tieto cookies sú potrebné pre základnú funkčnosť stránky (napr. uloženie voľby jazyka a súhlasu s cookies).',
    analyticsTitle: 'Analytické cookies (voliteľné)',
    analytics: 'Používajú sa na anonymné meranie návštevnosti a zlepšovanie stránky. Načítajú sa iba vtedy, ak udelíš súhlas.',
    changeTitle: 'Ako zmeniť súhlas',
    change: 'Súhlas môžeš kedykoľvek odvolať vymazaním dát prehliadača pre túto stránku, alebo ma kontaktuj priamo.',
    updated: 'Posledná aktualizácia: 25. 12. 2025',
  },
  en: {
    title: 'Cookie Policy',
    intro: 'Cookies are small text files that help the website function and improve the user experience. On this site I use:',
    essentialTitle: 'Essential cookies',
    essential: 'These cookies are required for the basic functionality of the site (e.g. saving your language preference and cookie consent choice).',
    analyticsTitle: 'Analytical cookies (optional)',
    analytics: 'Used for anonymous measurement of traffic and improving the site. They are only loaded if you give your consent.',
    changeTitle: 'How to change your consent',
    change: 'You can withdraw your consent at any time by clearing your browser data for this site, or contact me directly.',
    updated: 'Last updated: 25 December 2025',
  },
}

export default function CookiesPage() {
  const { language } = useLanguage()
  const t = content[language]

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold">{t.title}</h1>

        <p className="mt-6 text-gray-300 leading-relaxed">{t.intro}</p>

        <h2 className="mt-10 text-xl font-semibold">{t.essentialTitle}</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">{t.essential}</p>

        <h2 className="mt-10 text-xl font-semibold">{t.analyticsTitle}</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">{t.analytics}</p>

        <h2 className="mt-10 text-xl font-semibold">{t.changeTitle}</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">{t.change}</p>

        <p className="mt-10 text-[12px] text-gray-400">{t.updated}</p>
      </div>
    </main>
  )
}
