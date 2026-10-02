'use client'

import { useLanguage } from '@/app/context/language-context'

const content = {
  sk: {
    title: 'GDPR – Ochrana osobných údajov',
    intro: 'Táto stránka vysvetľuje, ako spracúvam osobné údaje na webe crookedr.com. Tento web je portfólio a slúži primárne na prezentáciu práce.',
    operatorTitle: 'Prevádzkovateľ',
    operator: 'Prevádzkovateľ:',
    operatorName: 'Roman Hatnančík',
    contact: 'Kontakt:',
    contactValue: 'uvedený v sekcii Contact',
    dataTitle: 'Aké údaje môžem spracúvať',
    data: [
      'Údaje z kontaktného formulára (ak ho používaš): meno alebo email a obsah správy.',
      'Technické údaje o návšteve webu (iba ak je povolená analytika): anonymizované metriky návštevnosti.',
    ],
    purposeTitle: 'Účel spracovania',
    purpose: [
      'Odpoveď na správu od návštevníka.',
      'Zlepšovanie webu na základe anonymných štatistík (voliteľné).',
    ],
    legalTitle: 'Právny základ',
    legal: [
      'Oprávnený záujem (bezpečnosť a prevádzka webu).',
      'Súhlas (analytické cookies, ak ich používaš).',
      'Plnenie zmluvy / predzmluvné vzťahy (odpoveď na dopyt).',
    ],
    retentionTitle: 'Doba uchovávania',
    retention: 'Správy z formulára uchovávam len počas nevyhnutnej doby na komunikáciu. Analytické údaje (ak sú povolené) sa riadia nastaveniami analytického nástroja.',
    rightsTitle: 'Práva dotknutej osoby',
    rights: 'Máš právo na prístup k údajom, opravu, vymazanie, obmedzenie spracovania, prenositeľnosť a namietať spracovanie. Ak spracovanie prebieha na základe súhlasu, súhlas môžeš kedykoľvek odvolať.',
    updated: 'Posledná aktualizácia: 25. 12. 2025',
  },
  en: {
    title: 'GDPR – Privacy Policy',
    intro: 'This page explains how I process personal data on crookedr.com. This website is a portfolio and serves primarily to showcase my work.',
    operatorTitle: 'Controller',
    operator: 'Controller:',
    operatorName: 'Roman Hatnančík',
    contact: 'Contact:',
    contactValue: 'listed in the Contact section',
    dataTitle: 'What data I may process',
    data: [
      'Data from the contact form (if you use it): your name or email and the message content.',
      'Technical data about your visit (only if analytics is enabled): anonymised traffic metrics.',
    ],
    purposeTitle: 'Purpose of processing',
    purpose: [
      'Responding to a message from a visitor.',
      'Improving the site based on anonymous statistics (optional).',
    ],
    legalTitle: 'Legal basis',
    legal: [
      'Legitimate interest (security and operation of the website).',
      'Consent (analytical cookies, if you use them).',
      'Performance of a contract / pre-contractual relations (response to enquiry).',
    ],
    retentionTitle: 'Retention period',
    retention: 'Messages from the contact form are kept only for the minimum time necessary for communication. Analytics data (if enabled) is governed by the settings of the analytics tool.',
    rightsTitle: 'Rights of the data subject',
    rights: 'You have the right to access, rectify, erase, restrict processing, data portability, and to object to processing. Where processing is based on consent, you may withdraw it at any time.',
    updated: 'Last updated: 25 December 2025',
  },
}

export default function GdprPage() {
  const { language } = useLanguage()
  const t = content[language]

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold">{t.title}</h1>

        <p className="mt-6 text-gray-300 leading-relaxed">{t.intro}</p>

        <h2 className="mt-10 text-xl font-semibold">{t.operatorTitle}</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">
          {t.operator} <span className="text-white">{t.operatorName}</span>
          <br />
          {t.contact} <span className="text-white">{t.contactValue}</span>
        </p>

        <h2 className="mt-10 text-xl font-semibold">{t.dataTitle}</h2>
        <ul className="mt-3 list-disc pl-6 text-gray-300 space-y-2">
          {t.data.map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h2 className="mt-10 text-xl font-semibold">{t.purposeTitle}</h2>
        <ul className="mt-3 list-disc pl-6 text-gray-300 space-y-2">
          {t.purpose.map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h2 className="mt-10 text-xl font-semibold">{t.legalTitle}</h2>
        <ul className="mt-3 list-disc pl-6 text-gray-300 space-y-2">
          {t.legal.map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h2 className="mt-10 text-xl font-semibold">{t.retentionTitle}</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">{t.retention}</p>

        <h2 className="mt-10 text-xl font-semibold">{t.rightsTitle}</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">{t.rights}</p>

        <p className="mt-10 text-[12px] text-gray-400">{t.updated}</p>
      </div>
    </main>
  )
}
