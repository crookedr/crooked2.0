'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FaDiscord, FaGithub, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { useLanguage } from '../context/language-context'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const { language } = useLanguage()
  const isSk = language === 'sk'
  const reduceMotion = useReducedMotion()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')

    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch(
        `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`,
        { method: 'POST', body: data, headers: { Accept: 'application/json' } },
      )

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

  const fieldClass =
    'w-full border-0 border-b border-white/15 bg-transparent px-0 pb-3 text-base text-white outline-none transition-colors focus:border-white/65'

  return (
    <section
      id="contact"
      className="flex h-[100dvh] min-h-0 w-full items-center overflow-hidden bg-gray-950 px-5 pb-4 pt-20 md:min-h-screen md:h-auto md:px-8 md:py-24"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid w-full max-w-6xl gap-5 md:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.2fr)] md:gap-20 lg:gap-28"
      >
        <div>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            {isSk ? 'Kontakt' : 'Contact'}
          </h2>

          <a
            href="mailto:hatnancikroman@gmail.com"
            className="mt-4 block max-w-max text-base text-gray-300 underline decoration-white/20 underline-offset-8 transition-colors hover:text-white md:mt-9 md:text-xl"
          >
            hatnancikroman@gmail.com
          </a>

          <div className="mt-5 flex items-center gap-5 text-xl text-gray-500 md:mt-10">
            <a href="https://github.com/crookedr" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/romanhatnan%C4%8D%C3%ADk/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#0a66c2]" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="mailto:hatnancikroman@gmail.com" className="transition-colors hover:text-[#ea4335]" aria-label="Email">
              <MdEmail />
            </a>
            <a href="https://discord.com/users/667726014864162836" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#5865f2]" aria-label="Discord">
              <FaDiscord />
            </a>
          </div>
        </div>

        <div className="min-h-0 md:min-h-[430px]">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'success' ? (
              <SuccessAnimation
                key="success"
                isSk={isSk}
                reduceMotion={Boolean(reduceMotion)}
                onReset={() => setStatus('idle')}
              />
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0 : 0.3 }}
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-8 md:gap-y-8">
                  <label className="block">
                    <span className="mb-3 block text-sm text-gray-500">{isSk ? 'Vaše Meno' : 'Your Name'}</span>
                    <input type="text" name="name" required autoComplete="name" className={fieldClass} />
                  </label>

                  <label className="block">
                    <span className="mb-3 block text-sm text-gray-500">{isSk ? 'Váš Email' : 'Your Email'}</span>
                    <input type="email" name="email" required autoComplete="email" className={fieldClass} />
                  </label>

                  <label className="col-span-2 block">
                    <span className="mb-3 block text-sm text-gray-500">{isSk ? 'Správa' : 'Message'}</span>
                    <textarea name="message" rows={3} required className={`${fieldClass} resize-none md:min-h-32`} />
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-8">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="cursor-pointer rounded-md border border-white/20 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/[0.1] disabled:cursor-wait disabled:opacity-50"
                  >
                    {status === 'sending'
                      ? (isSk ? 'Odosielam…' : 'Sending…')
                      : (isSk ? 'Odoslať správu' : 'Send message')}
                  </button>

                  {status === 'error' && (
                    <p className="text-sm text-red-300">
                      {isSk ? 'Správu sa nepodarilo odoslať.' : 'The message could not be sent.'}
                    </p>
                  )}
                </div>

                <p className="mt-5 max-w-lg text-[10px] leading-4 text-gray-700 md:mt-9 md:text-xs md:leading-5">
                  {isSk ? 'Odoslaním formulára súhlasíte so spracovaním údajov podľa ' : 'By submitting this form, you agree to the processing of your data under the '}
                  <a href="/gdpr" className="underline underline-offset-2 transition-colors hover:text-gray-400">
                    {isSk ? 'zásad ochrany osobných údajov' : 'privacy policy'}
                  </a>
                  {' '}{isSk ? 'a používaním ' : 'and the use of '}
                  <a href="/cookies" className="underline underline-offset-2 transition-colors hover:text-gray-400">
                    cookies
                  </a>
                  .
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}

function SuccessAnimation({
  isSk,
  reduceMotion,
  onReset,
}: {
  isSk: boolean
  reduceMotion: boolean
  onReset: () => void
}) {
  const delay = reduceMotion ? 0 : 1.65

  useEffect(() => {
    const timeout = window.setTimeout(onReset, reduceMotion ? 1300 : 3000)
    return () => window.clearTimeout(timeout)
  }, [onReset, reduceMotion])

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-gray-950/60 px-6 backdrop-blur-xl"
    >
      <div className="w-full max-w-3xl text-center" role="status" aria-live="polite">
        <span className="sr-only">{isSk ? 'Správa bola úspešne odoslaná.' : 'Your message was sent successfully.'}</span>
        <div className="relative mx-auto h-64 max-w-xl overflow-visible">
          <motion.div
            initial={reduceMotion ? false : { y: -110, opacity: 0 }}
            animate={reduceMotion ? { opacity: 0 } : { y: [-110, -110, 70, 70], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.9, times: [0, 0.12, 0.82, 1], ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-3 z-0 h-28 w-36 -translate-x-1/2 border border-white/25 bg-gray-900 p-5"
          >
            <span className="block h-px w-16 bg-white/35" />
            <span className="mt-4 block h-px w-24 bg-white/20" />
            <span className="mt-3 block h-px w-20 bg-white/20" />
          </motion.div>

          <motion.div
            initial={false}
            animate={reduceMotion ? { opacity: 0 } : {
              x: [0, 0, 340],
              y: [0, 0, -170],
              rotate: [0, 0, 20],
              scale: [1, 1, 0.7],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.05, delay: 0.72, times: [0, 0.28, 1], ease: [0.65, 0, 0.35, 1] }}
            className="absolute left-1/2 top-28 z-10 h-24 w-44 -translate-x-1/2"
          >
            <svg viewBox="0 0 176 96" className="h-full w-full" aria-hidden="true">
              <rect x="1" y="1" width="174" height="94" fill="#030712" stroke="rgba(255,255,255,.55)" strokeWidth="2" />
              <path d="M2 3 88 60 174 3" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2" />
              <path d="m2 94 58-51M174 94l-58-51" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
            </svg>
            {[0, 1, 2].map((line) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={reduceMotion ? {} : { opacity: [0, 0, 0.5, 0], scaleX: [0, 0, 1, 1] }}
                transition={{ duration: 1, delay: 0.8 + line * 0.07, times: [0, 0.25, 0.45, 1] }}
                className="absolute right-full h-px w-24 origin-right bg-white/50"
                style={{ top: `${30 + line * 16}%`, marginRight: `${line * 10}px` }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 18, delay }}
            className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2"
          >
            <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
              <motion.circle
                cx="56"
                cy="56"
                r="48"
                fill="none"
                stroke="rgb(74 222 128)"
                strokeWidth="3"
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, delay }}
              />
              <motion.path
                d="m33 57 15 15 32-35"
                fill="none"
                stroke="rgb(74 222 128)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : delay + 0.35 }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
    ,
    document.body,
  )
}
