'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/language-context'
import { useSectionCtx } from '../context/section-context'
import { supabase } from '../../lib/supabaseClient'

interface Bubble {
  size: number
  top: number
  left: number
  duration: number
  opacity: number
  key: number
  bornAt: number
  popped?: boolean
}

type GameState = 'idle' | 'playing' | 'finished'

type DbScore = {
  id: string
  name: string | null
  score: number
  created_at: string
}

export default function Hero() {
  const { language } = useLanguage()
  const { goTo } = useSectionCtx()
  const isSk = language === 'sk'

  const nameText = 'Roman Hatnančík'
  const positions = useMemo(() => ['Software Support & Tester · Web Developer'], [])

  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [positionIndex, setPositionIndex] = useState(0)

  // crosshair
  const [crosshairPos, setCrosshairPos] = useState({ x: -200, y: -200 })
  const [crosshairVisible, setCrosshairVisible] = useState(false)

  // combo – use ref for always-current value, state for display
  const comboRef = useRef(0)
  const [comboDisplay, setComboDisplay] = useState(0)
  const lastHitTimeRef = useRef(0)

  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const bubblesRef = useRef<Bubble[]>([])
  useEffect(() => { bubblesRef.current = bubbles }, [bubbles])

  const [score, setScore] = useState(0)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const [gameState, setGameState] = useState<GameState>('idle')

  const [timeLeft, setTimeLeft] = useState(60)
  const [playerName, setPlayerName] = useState('')
  const [hasSubmittedRun, setHasSubmittedRun] = useState(false)
  const [isSavingRun, setIsSavingRun] = useState(false)
  const [runCompletion, setRunCompletion] = useState<'saved' | 'skipped' | null>(null)

  const [leaderboard, setLeaderboard] = useState<DbScore[]>([])
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)
  const [mobileLbOpen, setMobileLbOpen] = useState(false)

  useEffect(() => {
    const shouldHide = crosshairVisible && gameState !== 'finished'
    document.documentElement.classList.toggle('hero-cursor-hidden', shouldHide)
    return () => document.documentElement.classList.remove('hero-cursor-hidden')
  }, [crosshairVisible, gameState])

  const [pops, setPops] = useState<{ id: number; x: number; y: number; size: number }[]>([])

  const heroRef = useRef<HTMLElement | null>(null)
  const nameRef = useRef<HTMLHeadingElement | null>(null)
  const nameWrapRef = useRef<HTMLDivElement | null>(null)
  const [shrinkName, setShrinkName] = useState(false)
  const nameInputRef = useRef<HTMLInputElement | null>(null)

  const [popSound] = useState<HTMLAudioElement | null>(() => {
    if (typeof window === 'undefined') return null
    const audio = new Audio('/sounds/bubble-pop.mp3')
    audio.volume = 0.5
    return audio
  })

  const typeIntervalRef = useRef<number | null>(null)
  const typeNextTimeoutRef = useRef<number | null>(null)
  const bubbleIntervalRef = useRef<number | null>(null)
  const bubbleRemoveTimeoutsRef = useRef<number[]>([])

  const clearTypingTimers = useCallback(() => {
    if (typeIntervalRef.current) { window.clearInterval(typeIntervalRef.current); typeIntervalRef.current = null }
    if (typeNextTimeoutRef.current) { window.clearTimeout(typeNextTimeoutRef.current); typeNextTimeoutRef.current = null }
  }, [])

  const typePositionRef = useRef<(text: string, index: number) => void>(() => {})

  const typePositionImpl = useCallback(
    (text: string, index: number) => {
      clearTypingTimers()
      setPosition('')
      setPositionIndex(index)
      let i = 0
      typeIntervalRef.current = window.setInterval(() => {
        i += 1
        setPosition(text.slice(0, i))
        if (i >= text.length) {
          if (typeIntervalRef.current) { window.clearInterval(typeIntervalRef.current); typeIntervalRef.current = null }
typeNextTimeoutRef.current = window.setTimeout(() => {
            const nextIndex = (index + 1) % positions.length
            typePositionRef.current(positions[nextIndex], nextIndex)
          }, 2000)
        }
      }, 80)
    },
    [clearTypingTimers, positions],
  )

  useEffect(() => { typePositionRef.current = typePositionImpl }, [typePositionImpl])

  useEffect(() => {
    clearTypingTimers()
    setName('')
    let i = 0
    const typing = window.setInterval(() => {
      i += 1
      setName(nameText.slice(0, i))
      if (i >= nameText.length) {
        window.clearInterval(typing)
        typePositionRef.current(positions[0], 0)
      }
    }, 120)
    return () => { window.clearInterval(typing); clearTypingTimers() }
  }, [clearTypingTimers, nameText, positions])

  useLayoutEffect(() => {
    const check = () => {
      if (!nameRef.current || !nameWrapRef.current) return
      setShrinkName(nameRef.current.scrollWidth > nameWrapRef.current.clientWidth)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [name])

  const generateBubble = useCallback(() => {
    const newBubble: Bubble = {
      size: Math.random() * 26 + 24,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 5 + 8,
      opacity: Math.random() * 0.32 + 0.18,
      key: Date.now() + Math.random(),
      bornAt: performance.now(),
    }
    setBubbles((prev) => [...prev, newBubble])
    const t = window.setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.key !== newBubble.key))
      bubbleRemoveTimeoutsRef.current = bubbleRemoveTimeoutsRef.current.filter((x) => x !== t)
    }, newBubble.duration * 1000)
    bubbleRemoveTimeoutsRef.current.push(t)
  }, [])

  useEffect(() => {
    if (gameState === 'finished') return
    bubbleIntervalRef.current = window.setInterval(generateBubble, 800)
    return () => {
      if (bubbleIntervalRef.current) { window.clearInterval(bubbleIntervalRef.current); bubbleIntervalRef.current = null }
      bubbleRemoveTimeoutsRef.current.forEach((t) => window.clearTimeout(t))
      bubbleRemoveTimeoutsRef.current = []
    }
  }, [generateBubble, gameState])

  useEffect(() => {
    if (gameState !== 'playing') return
    setTimeLeft(60)
    setHasSubmittedRun(false)
    setRunCompletion(null)
    comboRef.current = 0
    setComboDisplay(0)
    lastHitTimeRef.current = 0
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { window.clearInterval(id); setGameState('finished'); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [gameState])

  useEffect(() => {
    if (gameState !== 'finished') return
    setMobileLbOpen(true)
    const t = window.setTimeout(() => nameInputRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [gameState])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true)
      const { data, error } = await supabase
        .from('bubble_scores')
        .select('id, name, score, created_at')
        .order('score', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(10)
      if (!error && data) setLeaderboard(data)
      setLoadingLeaderboard(false)
    }
    fetchLeaderboard()
    const channel = supabase
      .channel('public:bubble_scores')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bubble_scores' }, (payload) => {
        const newRow = payload.new as DbScore
        setLeaderboard((prev) => {
          const merged = [...prev.filter((row) => row.id !== newRow.id), newRow]
          merged.sort((a, b) => b.score - a.score || a.created_at.localeCompare(b.created_at))
          return merged.slice(0, 10)
        })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const popBubbleByKey = useCallback(
    (bubbleKey: number, hitX?: number, hitY?: number, hitSize?: number) => {
      if (gameState === 'finished') return
      if (gameState === 'idle') setGameState('playing')

      const now = Date.now()
      const newCombo = (now - lastHitTimeRef.current) < 700 ? comboRef.current + 1 : 1
      comboRef.current = newCombo
      setComboDisplay(newCombo)
      lastHitTimeRef.current = now

      setBubbles((prev) => {
        const bubble = prev.find((b) => b.key === bubbleKey)
        if (!bubble || bubble.popped) return prev
        if (popSound) { popSound.currentTime = 0; popSound.play().catch(() => {}) }
        return prev.map((b) => b.key === bubbleKey ? { ...b, popped: true } : b)
      })

      setScore((prev) => prev + 1)
      if (!showLeaderboard) setShowLeaderboard(true)

      if (hitX !== undefined && hitY !== undefined) {
        const id = Date.now() + Math.random()
        setPops((prev) => [...prev, { id, x: hitX, y: hitY, size: hitSize ?? 32 }])
        window.setTimeout(() => setPops((prev) => prev.filter((p) => p.id !== id)), 650)
      }

      window.setTimeout(() => setBubbles((prev) => prev.filter((b) => b.key !== bubbleKey)), 220)
    },
    [gameState, popSound, showLeaderboard],
  )

  const tryHitAt = useCallback(
    (clientX: number, clientY: number) => {
      const hero = heroRef.current
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return

      const list = bubblesRef.current
      const now = performance.now()
      const vh = window.innerHeight

      let bestKey: number | null = null
      let bestDist = Infinity
      let bestCX = 0, bestCY = 0, bestSize = 32

      for (const b of list) {
        if (b.popped) continue
        const r = b.size / 2
        const baseX = (b.left / 100) * rect.width
        const baseY = (b.top / 100) * rect.height
        const progress = Math.min(1, Math.max(0, (now - b.bornAt) / (b.duration * 1000)))
        const cx = baseX + r
        const cy = baseY + r - progress * vh
        const dx = x - cx, dy = y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= r && dist < bestDist) {
          bestDist = dist
          bestKey = b.key
          bestCX = rect.left + cx
          bestCY = rect.top + cy
          bestSize = b.size
        }
      }

      if (bestKey != null) {
        popBubbleByKey(bestKey, bestCX, bestCY, bestSize)
      }
    },
    [popBubbleByKey],
  )

  const onHeroPointerDownCapture = (e: React.PointerEvent<HTMLElement>) => {
    if (gameState === 'finished') return
    tryHitAt(e.clientX, e.clientY)
  }

  const onHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (gameState === 'finished') return
    setCrosshairPos({ x: e.clientX, y: e.clientY })
  }, [gameState])

  const basePlayers: DbScore[] = [
    { id: 'ghost', name: 'Ghost Dev', score: 12, created_at: '' },
    { id: 'pixel', name: 'Pixel Hunter', score: 9, created_at: '' },
    { id: 'bot', name: 'Training Bot', score: 4, created_at: '' },
  ]

  const leaderboardRows = (leaderboard.length > 0 ? leaderboard : basePlayers).filter(
    (row, index, rows) => rows.findIndex((candidate) => candidate.id === row.id) === index,
  )

  const closeLeaderboard = () => {
    setScore(0)
    setTimeLeft(60)
    setGameState('idle')
    setPlayerName('')
    setMobileLbOpen(false)
    setHasSubmittedRun(false)
    setIsSavingRun(false)
    setRunCompletion(null)
    comboRef.current = 0
    setComboDisplay(0)
  }

  const handleSaveRun = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hasSubmittedRun || isSavingRun || score === 0) return
    setIsSavingRun(true)
    const displayName = playerName.trim() || (isSk ? 'Anonymný hráč' : 'Anonymous player')

    const { data: existing } = await supabase
      .from('bubble_scores')
      .select('id, score')
      .eq('name', displayName)
      .order('score', { ascending: false })
      .limit(1)

    const best = existing?.[0]
    if (best) {
      if (score > best.score) {
        await supabase.from('bubble_scores').update({ score }).eq('id', best.id)
      }
    } else {
      await supabase.from('bubble_scores').insert({ name: displayName, score })
    }

    // refetch since UPDATE doesn't fire the realtime INSERT listener
    const { data: fresh } = await supabase
      .from('bubble_scores')
      .select('id, name, score, created_at')
      .order('score', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(10)
    if (fresh) setLeaderboard(fresh)

    setIsSavingRun(false)
    setRunCompletion('saved')
    setHasSubmittedRun(true)
  }

  const handleSkipSave = () => {
    if (isSavingRun) return
    setRunCompletion('skipped')
    setHasSubmittedRun(true)
  }

  const renderLeaderboardCard = (compact = false) => (
    <div
      data-section-scroll-lock
      className={`w-full min-w-0 bg-black/70 border border-white/10 rounded-xl ${compact ? 'p-4' : 'p-5'} shadow-[0_18px_45px_rgba(0,0,0,0.9)] backdrop-blur-md`}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerDownCapture={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">Leaderboard – Bubble Aim</h3>
          <p className="text-xs text-gray-400">
            {isSk ? 'Koľko bublín trafíš za 60s od prvého zásahu.' : 'How many bubbles you hit in 60s from your first hit.'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="whitespace-nowrap text-xs font-mono text-blue-300/90">{isSk ? 'Skóre:' : 'Score:'} {score}</span>
          {gameState === 'finished' && (
            <button
              type="button"
              onClick={closeLeaderboard}
              aria-label={isSk ? 'Zavrieť leaderboard' : 'Close leaderboard'}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-white/10 text-base leading-none text-gray-500 transition-colors hover:border-white/25 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {loadingLeaderboard && <p className="text-xs text-gray-500 mb-2">{isSk ? 'Načítavam...' : 'Loading...'}</p>}

      <div className="leaderboard-scroll mb-4 max-h-[220px] space-y-1.5 overflow-y-auto pr-2">
        {leaderboardRows.map((row, idx) => (
          <div key={row.id} className="grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)_2.5rem] items-center gap-2 border-b border-white/[0.06] px-1 py-2 text-xs last:border-b-0">
            <span className="text-gray-500">{idx + 1}.</span>
            <span className="truncate text-gray-200">{row.name || (isSk ? 'Neznámy hráč' : 'Unknown player')}</span>
            <span className="text-right font-mono text-gray-300">{row.score}</span>
          </div>
        ))}
      </div>

      <AnimatePresence initial={false} mode="wait">
      {gameState === 'finished' && !hasSubmittedRun && (
        <motion.form
          key="score-form"
          onSubmit={handleSaveRun}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-2 text-xs"
        >
          <label className="text-gray-300">
            {isSk ? 'Zadajte meno alebo nick (voliteľné):' : 'Enter your name or nickname (optional):'}
          </label>
          <input
            ref={nameInputRef}
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs text-white cursor-text"
            placeholder={isSk ? 'napr. crookedr' : 'e.g. crookedr'}
            autoComplete="off" autoCorrect="off" spellCheck={false}
          />
          <div className="flex gap-2 mt-1">
            <button disabled={isSavingRun} type="submit" className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60 text-white font-medium text-xs transition cursor-pointer">
              {isSavingRun
                ? (isSk ? 'Ukladám…' : 'Saving…')
                : (isSk ? 'Uložiť a hrať znova' : 'Save & play again')}
            </button>
            <button disabled={isSavingRun} type="button" onClick={handleSkipSave} className="px-3 py-2 rounded-md border border-white/10 text-gray-500 hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-40 font-medium text-xs transition cursor-pointer">
              {isSk ? 'Neuložiť' : "Don't save"}
            </button>
          </div>
        </motion.form>
      )}
      {gameState === 'finished' && hasSubmittedRun && runCompletion && (
        <motion.div
          key="score-complete"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="flex min-h-[104px] items-center text-xs text-gray-400"
        >
          {runCompletion === 'saved'
            ? (isSk ? 'Skóre bolo uložené.' : 'Score saved.')
            : (isSk ? 'Pokračujem bez uloženia.' : 'Continuing without saving.')}
        </motion.div>
      )}
      </AnimatePresence>

      {gameState !== 'finished' && (
        <p className="mt-2 text-[11px] text-gray-500">
          {isSk ? 'Prvý zásah spustí 60s kolo.' : 'Your first hit starts a 60s round.'}
        </p>
      )}
    </div>
  )

  const crosshairLine = 'rgba(255,255,255,0.92)'
  const crosshairOutline = 'rgba(0,0,0,0.55)'

  return (
    <section
      ref={heroRef}
      id="hero"
      className={`min-h-screen flex items-center px-6 relative overflow-hidden bg-gray-950 ${gameState === 'finished' ? 'cursor-default' : 'hero-crosshair-active cursor-none'}`}
      onPointerDownCapture={onHeroPointerDownCapture}
      onMouseMove={onHeroMouseMove}
      onMouseEnter={() => setCrosshairVisible(true)}
      onMouseLeave={() => setCrosshairVisible(false)}
    >
      {/* background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-48 left-1/4 w-[520px] h-[520px] bg-blue-600/[0.08] rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-[360px] h-[360px] bg-sky-400/[0.05] rounded-full blur-3xl" />
      </div>

      {/* timer bar */}
      {gameState === 'playing' && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-white/5 z-30">
          <div
            className="h-full bg-blue-400/80 transition-[width] duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          />
        </div>
      )}

      {/* custom crosshair — CS style */}
      {gameState !== 'finished' && crosshairVisible && (
        <svg
          width="40" height="40" viewBox="-20 -20 40 40"
          className="pointer-events-none fixed z-[70]"
          style={{ left: crosshairPos.x - 20, top: crosshairPos.y - 20, transition: 'none' }}
        >
          {/* outline for contrast on any background */}
          <line x1="0" y1="-15" x2="0" y2="-5" stroke={crosshairOutline} strokeWidth="3" strokeLinecap="square" style={{ transition: 'stroke 0.1s' }} />
          <line x1="0" y1="5" x2="0" y2="15" stroke={crosshairOutline} strokeWidth="3" strokeLinecap="square" style={{ transition: 'stroke 0.1s' }} />
          <line x1="-15" y1="0" x2="-5" y2="0" stroke={crosshairOutline} strokeWidth="3" strokeLinecap="square" style={{ transition: 'stroke 0.1s' }} />
          <line x1="5" y1="0" x2="15" y2="0" stroke={crosshairOutline} strokeWidth="3" strokeLinecap="square" style={{ transition: 'stroke 0.1s' }} />
          {/* main lines */}
          <line x1="0" y1="-15" x2="0" y2="-5" stroke={crosshairLine} strokeWidth="1.5" strokeLinecap="square" style={{ transition: 'stroke 0.1s' }} />
          <line x1="0" y1="5" x2="0" y2="15" stroke={crosshairLine} strokeWidth="1.5" strokeLinecap="square" style={{ transition: 'stroke 0.1s' }} />
          <line x1="-15" y1="0" x2="-5" y2="0" stroke={crosshairLine} strokeWidth="1.5" strokeLinecap="square" style={{ transition: 'stroke 0.1s' }} />
          <line x1="5" y1="0" x2="15" y2="0" stroke={crosshairLine} strokeWidth="1.5" strokeLinecap="square" style={{ transition: 'stroke 0.1s' }} />
        </svg>
      )}

      {/* pop effects */}
      {pops.map((pop) => {
        const angles = [0, 45, 90, 135, 180, 225, 270, 315]
        return (
          <div key={pop.id} className="pointer-events-none fixed z-40" style={{ left: pop.x, top: pop.y }}>
            <motion.div
              initial={{ scale: 0.35, opacity: 0.95 }} animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              className="absolute rounded-full border-[1.5px]"
              style={{ borderColor: 'rgba(147,210,255,0.85)', width: pop.size, height: pop.size, marginLeft: -pop.size / 2, marginTop: -pop.size / 2 }}
            />
            <motion.div
              initial={{ scale: 0.55, opacity: 0.6 }} animate={{ scale: 1.95, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
              className="absolute rounded-full border"
              style={{ borderColor: 'rgba(96,165,250,0.5)', width: pop.size, height: pop.size, marginLeft: -pop.size / 2, marginTop: -pop.size / 2 }}
            />
            <motion.div
              initial={{ scale: 0.7, opacity: 0.75 }} animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute rounded-full bg-white/25"
              style={{ width: pop.size * 0.55, height: pop.size * 0.55, marginLeft: -(pop.size * 0.55) / 2, marginTop: -(pop.size * 0.55) / 2 }}
            />
            {angles.map((angle) => {
              const rad = (angle * Math.PI) / 180
              const d = pop.size * 0.9
              return (
                <motion.div
                  key={angle}
                  initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
                  animate={{ x: Math.cos(rad) * d, y: Math.sin(rad) * d, opacity: 0, scale: 0 }}
                  transition={{ duration: 0.4, ease: [0.2, 0, 0.8, 1] }}
                  className="absolute w-[5px] h-[5px] rounded-full bg-sky-300/90"
                  style={{ marginLeft: -2.5, marginTop: -2.5 }}
                />
              )
            })}
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 1 }} animate={{ opacity: 0, y: -52, scale: 1.1 }}
              transition={{ duration: 0.58, ease: 'easeOut' }}
              className="absolute text-sm font-bold font-mono text-blue-200 select-none whitespace-nowrap"
              style={{ left: '50%', transform: 'translateX(-50%)', top: -pop.size / 2 - 8 }}
            >
              +1
            </motion.div>
          </div>
        )
      })}

      {/* bubbles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
        {bubbles.map((bubble) => (
          <div
            key={bubble.key}
            className="bubble"
            style={{
              width: bubble.size,
              height: bubble.size,
              top: `${bubble.top}%`,
              left: `${bubble.left}%`,
              opacity: bubble.popped ? 0 : bubble.opacity,
              position: 'absolute',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 32% 26%, rgba(255,255,255,0.5) 0%, rgba(147,210,255,0.18) 28%, rgba(56,189,248,0.12) 55%, rgba(15,23,42,0.08) 100%)',
              border: '1px solid rgba(147,220,255,0.35)',
              boxShadow: 'inset -2px -2px 6px rgba(56,189,248,0.2), inset 2px 2px 8px rgba(255,255,255,0.12), 0 2px 18px rgba(56,189,248,0.18)',
              backdropFilter: 'blur(2px)',
              animationName: 'moveBubble',
              animationDuration: `${bubble.duration}s`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards',
            }}
          />
        ))}
      </div>

      {/* main content */}
      <div className={`relative z-20 max-w-6xl w-full mx-auto grid gap-10 lg:gap-16 items-center transition-[grid-template-columns] duration-500 ease-out ${
        gameState === 'finished'
          ? 'md:grid-cols-[minmax(0,1fr)_20rem] lg:grid-cols-[minmax(0,1fr)_23rem]'
          : 'md:grid-cols-[minmax(0,1fr)_176px]'
      }`}>

        {/* left — text */}
        <div className="pointer-events-none flex flex-col items-center md:items-start text-center md:text-left">

          {/* mobile photo */}
          <AnimatePresence initial={false}>
            {gameState !== 'playing' && (
              <motion.div
                key="mobile-photo"
                className="md:hidden relative w-16 h-16 rounded-lg overflow-hidden mb-5 ring-1 ring-white/10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Image src="/images/me.jpg" alt="Roman Hatnančík" fill className="object-cover" priority />
              </motion.div>
            )}
          </AnimatePresence>

          {/* name */}
          <AnimatePresence initial={false}>
            {gameState !== 'playing' && (
              <motion.div
                key="hero-name"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28 }}
                className="w-full max-w-full"
              >
                <div ref={nameWrapRef} className="w-full max-w-full mb-2">
                  <h1
                    ref={nameRef}
                    className={`font-bold text-white whitespace-nowrap transition-[font-size] duration-150 ${
                      shrinkName ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl md:text-6xl'
                    }`}
                  >
                    {name}
                    {name.length < nameText.length && (
                      <span className="ml-1 animate-pulse text-blue-400 font-bold">█</span>
                    )}
                  </h1>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* position + description — slide out during play */}
          <AnimatePresence initial={false}>
            {gameState !== 'playing' && (
              <motion.div
                key="hero-meta"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-lg md:text-xl text-sky-300/80 mb-5 font-mono min-h-[1.75rem]">
                  {position}
                  {position.length < positions[positionIndex].length && (
                    <span className="ml-1 animate-pulse text-sky-300 font-bold">█</span>
                  )}
                </h2>

              </motion.div>
            )}
          </AnimatePresence>

          {/* game status — appears only after the first hit */}
          {gameState !== 'idle' && (
          <div className="flex items-center gap-2 mb-6">
            <span className={`text-xs font-mono ${gameState === 'playing' ? 'text-sky-300/70' : 'text-gray-500'}`}>
              {gameState === 'playing' ? `${timeLeft}s`
                : gameState === 'finished' ? (isSk ? 'kolo skončilo' : 'round finished')
                : ''}
            </span>
            <span className="text-xs font-mono text-blue-300/70 ml-1">
              {score} {isSk ? 'zásahov' : 'hits'}
            </span>
            <AnimatePresence>
              {comboDisplay >= 2 && gameState === 'playing' && (
                <motion.span
                  key={comboDisplay}
                  initial={{ opacity: 0, scale: 0.6, x: -4 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.14 }}
                  className="text-[10px] font-mono text-yellow-400 ml-1"
                >
                  ×{comboDisplay}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          )}

          {/* buttons — fade out when playing */}
          <motion.div
            className="pointer-events-auto flex flex-wrap gap-3 justify-center md:justify-start cursor-default"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: gameState === 'playing' ? 0 : 1, y: gameState === 'playing' ? 6 : 0 }}
            transition={{ duration: 0.35 }}
            style={{ pointerEvents: gameState === 'playing' ? 'none' : 'auto' }}
          >
            <button
              onClick={() => goTo(1)}
              className="px-6 py-2.5 rounded-md border border-white bg-white text-gray-950 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {isSk ? 'Moje projekty' : 'My work'}
            </button>
            <button
              onClick={() => goTo(3)}
              className="px-6 py-2.5 rounded-md border border-white/20 text-sm font-medium text-gray-300 hover:border-white/50 hover:text-white transition-colors cursor-pointer"
            >
              {isSk ? 'Kontaktujte ma' : 'Say hello'}
            </button>
            {gameState === 'finished' && (
              <button
                type="button"
                onClick={() => setMobileLbOpen(true)}
                className="md:hidden px-5 py-2.5 rounded-md border border-white/15 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Leaderboard
              </button>
            )}
          </motion.div>
        </div>

        {/* right — photo (idle) or leaderboard (finished) */}
        <AnimatePresence mode="wait">
          {gameState === 'idle' && (
            <motion.div
              key="photo"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block"
            >
              <div className="relative h-44 w-44 rounded-xl overflow-hidden ring-1 ring-white/[0.08]">
                <Image src="/images/me.jpg" alt="Roman Hatnančík" fill className="object-cover" priority />
              </div>
            </motion.div>
          )}
          {gameState === 'finished' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 30, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:block cursor-default pointer-events-auto"
            >
              {renderLeaderboardCard()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* mobile leaderboard overlay */}
      {mobileLbOpen && gameState === 'finished' && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm p-4 flex items-center cursor-default"
        >
          <div
            className="w-full max-w-xl mx-auto pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerDownCapture={(e) => e.stopPropagation()}
          >
            <div className="max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl">
              {renderLeaderboardCard(true)}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes moveBubble {
          to { transform: translateY(-100vh); }
        }
        .bubble {
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        :global(.leaderboard-scroll) {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.22) transparent;
        }
        :global(.leaderboard-scroll::-webkit-scrollbar) {
          display: block;
          width: 4px;
        }
        :global(.leaderboard-scroll::-webkit-scrollbar-track) {
          background: transparent;
        }
        :global(.leaderboard-scroll::-webkit-scrollbar-thumb) {
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.22);
        }
      `}</style>
    </section>
  )
}
