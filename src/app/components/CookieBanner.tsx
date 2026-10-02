'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'cookie_consent_v1'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-[80]">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/70 px-4 py-2.5 backdrop-blur-md shadow-lg">
        <p className="text-[11px] text-gray-300 leading-tight">
          Tento web používa iba nevyhnutné cookies.
          <a
            href="/cookies"
            className="ml-1 underline hover:text-white transition"
          >
            Viac info
          </a>
        </p>

        <button
          onClick={accept}
          className="rounded-full bg-white text-gray-900 px-3 py-1 text-[11px] font-medium hover:bg-gray-100 transition"
        >
          OK
        </button>
      </div>
    </div>
  )
}
