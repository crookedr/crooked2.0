'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { useLanguage } from '../context/language-context'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle',
  )
  const { language } = useLanguage()

  const translatedTexts = {
    sk: {
      title: 'Kontaktujte ma',
      description:
        'Máte projekt, nápad alebo otázku? Napíšte mi – ozvem sa vám čo najskôr a úprimne poviem, ako viem pomôcť.',
      successMessage: '✅ Ďakujem! Vaša správa bola úspešne odoslaná.',
      successDetails: 'Teší ma, že ste sa rozhodli ma kontaktovať.',
      namePlaceholder: 'Vaše meno',
      emailPlaceholder: 'Email',
      messagePlaceholder: 'Správa',
      submitButton: status === 'sending' ? 'Odosielam...' : 'Odoslať',
      errorMessage: 'Nastala chyba pri odosielaní 😕 Skúste to ešte raz.',
      prefLang: 'Ak preferujete komunikáciu v angličtine, je to úplne v poriadku.',
      privacy: 'GDPR',
      cookies: 'Cookies',
      consentLine: 'Odoslaním formulára súhlasíte s',
      and: 'a',
    },
    en: {
      title: 'Contact Me',
      description:
        'Have a project, idea or question? Feel free to reach out – I will get back to you as soon as I can and honestly say how I can help.',
      successMessage: '✅ Thank you! Your message has been successfully sent.',
      successDetails: 'I’m glad you decided to contact me.',
      namePlaceholder: 'Your Name',
      emailPlaceholder: 'Email',
      messagePlaceholder: 'Message',
      submitButton: status === 'sending' ? 'Sending...' : 'Send',
      errorMessage: 'An error occurred while sending 😕 Please try again.',
      prefLang: 'If you prefer communication in English, that’s totally fine.',
      privacy: 'Privacy',
      cookies: 'Cookies',
      consentLine: 'By submitting this form you agree to the',
      and: 'and',
    },
  } as const

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('https://formspree.io/f/xqaplpyg', {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-24 px-6 bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[11px] tracking-[0.35em] uppercase text-blue-300/80 mb-3">
            {language === 'sk' ? 'Kontakt' : 'Contact'}
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            {translatedTexts[language].title}
          </h2>
          <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto">
            {translatedTexts[language].description}
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5 bg-gray-900/80 rounded-2xl p-6 md:p-7 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
          >
            {status === 'success' && (
              <motion.div
                className="text-green-400 font-medium text-sm md:text-base mb-2 rounded-lg bg-green-500/10 border border-green-500/40 px-3 py-2"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-base mb-0.5">
                  {translatedTexts[language].successMessage}
                </p>
                <p className="text-sm text-green-200/80">
                  {translatedTexts[language].successDetails}
                </p>
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-gray-300">
                {translatedTexts[language].namePlaceholder}
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3.5 py-2.5 bg-gray-950/70 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/70 text-sm text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-300">
                {translatedTexts[language].emailPlaceholder}
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3.5 py-2.5 bg-gray-950/70 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/70 text-sm text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-300">
                {translatedTexts[language].messagePlaceholder}
              </label>
              <textarea
                name="message"
                rows={5}
                required
                className="w-full px-3.5 py-2.5 bg-gray-950/70 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/70 text-sm text-white resize-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-blue-600 hover:bg-blue-500 transition text-white px-6 py-2.5 rounded-full font-semibold disabled:opacity-60 text-sm"
              >
                {translatedTexts[language].submitButton}
              </button>
              {status === 'error' && (
                <motion.p
                  className="text-red-400 text-xs font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {translatedTexts[language].errorMessage}
                </motion.p>
              )}
            </div>
          </motion.form>

          <motion.div
            className="space-y-6 text-sm text-gray-300"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">
                {language === 'sk'
                  ? 'Preferovaný spôsob komunikácie'
                  : 'Preferred way to reach me'}
              </h3>
              <p className="text-gray-400">
                {language === 'sk'
                  ? 'Najrýchlejšie ma zastihnete emailom alebo cez Discord. Ostatné používam menej na rýchlu operatívnu komunikáciu.'
                  : 'Email and Discord are the most reliable ways to reach me. I use other platforms less for quick operational communication.'}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-[0.18em]">
                {language === 'sk' ? 'Sociálne siete' : 'Social'}
              </h4>
              <div className="flex flex-wrap gap-4 text-xl text-gray-400">
                <a
                  href="https://github.com/crookedr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>

                <a
                  href="https://www.linkedin.com/in/romanhatnan%C4%8D%C3%ADk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>

                <a
                  href="mailto:hatnancikroman@gmail.com"
                  className="hover:text-white transition"
                  aria-label="Email"
                >
                  <MdEmail />
                </a>

                <a
                  href="https://discord.com/users/667726014864162836"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                  aria-label="Discord"
                >
                  <FaDiscord />
                </a>
              </div>
            </div>

            {/* NOTE + MINI LINKS */}
            <div className="text-xs text-gray-500 space-y-2">
              <p>{translatedTexts[language].prefLang}</p>

              <p className="text-[10px] text-gray-600">
                {translatedTexts[language].consentLine}{' '}
                <a
                  href="/gdpr"
                  className="underline underline-offset-2 hover:text-gray-300 transition"
                >
                  {translatedTexts[language].privacy}
                </a>{' '}
                {translatedTexts[language].and}{' '}
                <a
                  href="/cookies"
                  className="underline underline-offset-2 hover:text-gray-300 transition"
                >
                  {translatedTexts[language].cookies}
                </a>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
