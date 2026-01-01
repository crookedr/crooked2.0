'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/language-context'
import { supabase } from '../../lib/supabaseClient'

interface Bubble {
  size: number
  top: number
  left: number
  duration: number
  opacity: number
  key: number
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
  const isSk = language === 'sk'

  const nameText = '<Roman Hatnančík />'

  const positions = useMemo(
    () => ['Frontend Developer', 'Fullstack Developer', 'Creative Developer'],
    [],
  )

  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [showDescription, setShowDescription] = useState(false)
  const [positionIndex, setPositionIndex] = useState(0)

  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [score, setScore] = useState(0)

  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const [gameState, setGameState] = useState<GameState>('idle')
  const [timeLeft, setTimeLeft] = useState(60)
  const [playerName, setPlayerName] = useState('')
  const [hasSubmittedRun, setHasSubmittedRun] = useState(false)

  const [leaderboard, setLeaderboard] = useState<DbScore[]>([])
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)

  const [mobileLbOpen, setMobileLbOpen] = useState(false)

  const nameRef = useRef<HTMLHeadingElement | null>(null)
  const nameWrapRef = useRef<HTMLDivElement | null>(null)
  const [shrinkName, setShrinkName] = useState(false)

  const [popSound] = useState<HTMLAudioElement | null>(() => {
    if (typeof window === 'undefined') return null
    const audio = new Audio('/sounds/bubble-pop.mp3')
    audio.volume = 0.5
    return audio
  })

  const typeIntervalRef = useRef<number | null>(null)
  const typeNextTimeoutRef = useRef<number | null>(null)
  const showDescTimeoutRef = useRef<number | null>(null)

  const bubbleIntervalRef = useRef<number | null>(null)
  const bubbleRemoveTimeoutsRef = useRef<number[]>([])

  const clearTypingTimers = useCallback(() => {
    if (typeIntervalRef.current) {
      window.clearInterval(typeIntervalRef.current)
      typeIntervalRef.current = null
    }
    if (typeNextTimeoutRef.current) {
      window.clearTimeout(typeNextTimeoutRef.current)
      typeNextTimeoutRef.current = null
    }
    if (showDescTimeoutRef.current) {
      window.clearTimeout(showDescTimeoutRef.current)
      showDescTimeoutRef.current = null
    }
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
          if (typeIntervalRef.current) {
            window.clearInterval(typeIntervalRef.current)
            typeIntervalRef.current = null
          }

          showDescTimeoutRef.current = window.setTimeout(() => {
            setShowDescription(true)
          }, 800)

          typeNextTimeoutRef.current = window.setTimeout(() => {
            const nextIndex = (index + 1) % positions.length
            typePositionRef.current(positions[nextIndex], nextIndex)
          }, 2000)
        }
      }, 80)
    },
    [clearTypingTimers, positions],
  )

  useEffect(() => {
    typePositionRef.current = typePositionImpl
  }, [typePositionImpl])

  useEffect(() => {
    clearTypingTimers()
    setName('')
    setShowDescription(false)

    let i = 0
    const typing = window.setInterval(() => {
      i += 1
      setName(nameText.slice(0, i))

      if (i >= nameText.length) {
        window.clearInterval(typing)
        typePositionRef.current(positions[0], 0)
      }
    }, 120)

    return () => {
      window.clearInterval(typing)
      clearTypingTimers()
    }
  }, [clearTypingTimers, nameText, positions])

  useLayoutEffect(() => {
    const check = () => {
      if (!nameRef.current || !nameWrapRef.current) return
      const textW = nameRef.current.scrollWidth
      const wrapW = nameWrapRef.current.clientWidth
      setShrinkName(textW > wrapW)
    }

    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [name])

  const generateBubble = useCallback(() => {
    const newBubble: Bubble = {
      size: Math.random() * (50 - 24) + 24,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * (13 - 8) + 8,
      opacity: Math.random() * (0.5 - 0.18) + 0.18,
      key: Date.now() + Math.random(),
    }

    setBubbles((prev) => [...prev, newBubble])

    const t = window.setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.key !== newBubble.key))
      bubbleRemoveTimeoutsRef.current = bubbleRemoveTimeoutsRef.current.filter(
        (x) => x !== t,
      )
    }, newBubble.duration * 1000)

    bubbleRemoveTimeoutsRef.current.push(t)
  }, [])

  useEffect(() => {
    bubbleIntervalRef.current = window.setInterval(generateBubble, 900)

    return () => {
      if (bubbleIntervalRef.current) {
        window.clearInterval(bubbleIntervalRef.current)
        bubbleIntervalRef.current = null
      }
      bubbleRemoveTimeoutsRef.current.forEach((t) => window.clearTimeout(t))
      bubbleRemoveTimeoutsRef.current = []
    }
  }, [generateBubble])

  useEffect(() => {
    if (gameState !== 'playing') return

    setTimeLeft(60)
    setHasSubmittedRun(false)

    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id)
          setGameState('finished')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(id)
  }, [gameState])

  useEffect(() => {
    if (!showLeaderboard) return
    if (gameState === 'finished') {
      setMobileLbOpen(true)
    }
  }, [gameState, showLeaderboard])

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
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bubble_scores' },
        (payload) => {
          const newRow = payload.new as DbScore
          setLeaderboard((prev) => {
            const merged = [...prev, newRow]
            merged.sort(
              (a, b) => b.score - a.score || a.created_at.localeCompare(b.created_at),
            )
            return merged.slice(0, 10)
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleBubbleHit = (bubbleKey: number) => {
    if (gameState === 'finished') return

    if (gameState === 'idle') setGameState('playing')

    setBubbles((prev) => {
      const bubble = prev.find((b) => b.key === bubbleKey)
      if (!bubble || bubble.popped) return prev

      if (popSound) {
        popSound.currentTime = 0
        popSound.play().catch(() => {})
      }

      return prev.map((b) => (b.key === bubbleKey ? { ...b, popped: true } : b))
    })

    setScore((prev) => prev + 1)

    if (!showLeaderboard) setShowLeaderboard(true)

    window.setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.key !== bubbleKey))
    }, 220)
  }

  const basePlayers: DbScore[] = [
    { id: 'ghost', name: 'Ghost Dev', score: 12, created_at: '' },
    { id: 'pixel', name: 'Pixel Hunter', score: 9, created_at: '' },
    { id: 'bot', name: 'Training Bot', score: 4, created_at: '' },
  ]

  const leaderboardRows: DbScore[] = leaderboard.length > 0 ? leaderboard : basePlayers

  const handleSaveRun = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hasSubmittedRun || score === 0) return

    setHasSubmittedRun(true)

    const displayName =
      playerName.trim() || (isSk ? 'Anonymný hráč' : 'Anonymous player')

    await supabase.from('bubble_scores').insert({ name: displayName, score })

    window.setTimeout(() => {
      setScore(0)
      setTimeLeft(60)
      setGameState('idle')
      setPlayerName('')
      setMobileLbOpen(false)
    }, 400)
  }

  const LeaderboardCard = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={`bg-black/70 border border-white/10 rounded-2xl ${
        compact ? 'p-4' : 'p-5'
      } shadow-[0_18px_45px_rgba(0,0,0,0.9)] backdrop-blur-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">
            {isSk ? 'Leaderboard – Bubble Aim' : 'Leaderboard – Bubble Aim'}
          </h3>
          <p className="text-xs text-gray-400">
            {isSk
              ? 'Koľko bublín trafíš za 60 sekúnd od prvého zásahu.'
              : 'How many bubbles you hit in 60 seconds from your first hit.'}
          </p>
        </div>
        <span className="text-xs font-mono text-blue-300/90">
          {isSk ? 'Skóre:' : 'Score:'} {score}
        </span>
      </div>

      {loadingLeaderboard ? (
        <p className="text-xs text-gray-500 mb-2">
          {isSk ? 'Načítavam leaderboard...' : 'Loading leaderboard...'}
        </p>
      ) : null}

      <div className="space-y-1.5 mb-4">
        {leaderboardRows.map((row, idx) => (
          <div
            key={row.id}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs bg-white/5 border border-white/5"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 text-gray-400">{idx + 1}.</span>
              <span className="text-gray-200">
                {row.name || (isSk ? 'Neznámy hráč' : 'Unknown player')}
              </span>
            </div>
            <span className="font-mono text-gray-300">{row.score}</span>
          </div>
        ))}
      </div>

      {gameState === 'finished' && !hasSubmittedRun && (
        <form onSubmit={handleSaveRun} className="flex flex-col gap-2 text-xs">
          <label className="text-gray-300">
            {isSk
              ? 'Zadajte meno alebo nick (voliteľné):'
              : 'Enter your name or nickname (optional):'}
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs text-white"
            placeholder={isSk ? 'napr. crookedr' : 'e.g. crookedr'}
          />
          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition"
          >
            {isSk ? 'Uložiť skóre a začať znova' : 'Save score & play again'}
          </button>
        </form>
      )}

      {gameState !== 'finished' && (
        <p className="mt-2 text-[11px] text-gray-500">
          {isSk
            ? 'Prvý zásah spustí 60s kolo. Po skončení zadáš meno a skóre sa uloží do globálneho leaderboardu.'
            : 'Your first hit starts a 60s round. After it ends, enter your name and your score goes to the global leaderboard.'}
        </p>
      )}
    </div>
  )

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gray-950"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-80 w-[120%] -translate-x-1/2 bg-gradient-to-b from-blue-500/30 via-sky-500/15 to-transparent blur-3xl" />
      </div>

      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-auto">
        {bubbles.map((bubble) => (
          <div
            key={bubble.key}
            onPointerDown={() => handleBubbleHit(bubble.key)}
            className="bubble cursor-crosshair"
            style={{
              width: bubble.size,
              height: bubble.size,
              top: `${bubble.top}%`,
              left: `${bubble.left}%`,
              opacity: bubble.popped ? 0 : bubble.opacity,
              position: 'absolute',
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 30% 30%, rgba(56,189,248,0.85), rgba(15,23,42,0.25))',
              boxShadow: '0 0 16px rgba(56,189,248,0.5)',
              animationName: 'moveBubble',
              animationDuration: `${bubble.duration}s`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards',
              pointerEvents: bubble.popped ? 'none' : 'auto',
            }}
          >
            {bubble.popped && (
              <div className="pointer-events-none absolute inset-0 rounded-full pop-ring" />
            )}
          </div>
        ))}
      </div>

      <div className="relative z-20 max-w-6xl w-full grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-center pointer-events-none">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.img
            src="images/02.jpg"
            alt="Moja fotka"
            className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white/80 shadow-[0_18px_45px_rgba(0,0,0,0.75)] mb-6 object-cover pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />

          <div ref={nameWrapRef} className="w-full max-w-full">
            <h1
              ref={nameRef}
              className={`font-bold mb-2 text-white font-mono pointer-events-none whitespace-nowrap transition-[font-size] duration-150 ${
                shrinkName ? 'text-2xl sm:text-3xl md:text-5xl' : 'text-3xl md:text-5xl'
              }`}
            >
              {name}
              {name.length < nameText.length && (
                <span className="ml-1 animate-pulse text-blue-400 font-bold">█</span>
              )}
            </h1>
          </div>

          <h2 className="text-lg md:text-2xl text-sky-300/90 mb-4 font-mono pointer-events-none">
            {position}
            {position.length < positions[positionIndex].length && (
              <span className="ml-1 animate-pulse text-sky-300 font-bold">█</span>
            )}
          </h2>

          {showDescription && (
            <motion.p
              className="max-w-xl text-gray-300 leading-relaxed mb-6 text-sm md:text-base pointer-events-none"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isSk
                ? 'Stránka, na ktorej zhromažďujem svoju prácu aj menšie experimenty. Nájdeš tu prehľad vecí, na ktorých pracujem a ktoré postupne rozvíjam.'
                : 'I build modern web apps with a focus on clean code, UX and visual details. And sometimes a tiny game right in the hero section.'}
            </motion.p>
          )}

          <div className="flex items-center gap-3 mb-4 pointer-events-none">
            <span className="text-xs font-mono text-gray-400">
              {isSk ? 'Kolo:' : 'Round:'}{' '}
              {gameState === 'idle'
                ? isSk
                  ? 'Čaká na prvý zásah'
                  : 'Waiting for first hit'
                : gameState === 'playing'
                ? isSk
                  ? 'Prebieha'
                  : 'Running'
                : isSk
                ? 'Skončené'
                : 'Finished'}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/70 border border-blue-500/50 text-xs font-mono text-blue-100 pointer-events-none">
              {timeLeft}s
            </span>
          </div>

          <motion.div
            className="flex flex-wrap gap-4 justify-center md:justify-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a
              href="#projects"
              className="px-6 md:px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-sm md:text-base font-medium text-white shadow-lg shadow-blue-500/30 transition pointer-events-auto"
            >
              {isSk ? 'Pozrieť projekty' : 'View projects'}
            </a>
            <a
              href="#contact"
              className="px-6 md:px-7 py-3 rounded-full border border-white/20 hover:border-white/60 text-sm md:text-base font-medium text-gray-200 hover:bg-white/5 transition pointer-events-auto"
            >
              {isSk ? 'Kontaktovať ma' : 'Contact me'}
            </a>

            {showLeaderboard && (
              <button
                type="button"
                onClick={() => setMobileLbOpen(true)}
                className="md:hidden px-5 py-3 rounded-full border border-white/15 hover:border-white/40 text-sm font-medium text-gray-200 hover:bg-white/5 transition pointer-events-auto"
              >
                {isSk ? 'Leaderboard' : 'Leaderboard'}
              </button>
            )}
          </motion.div>

          <motion.div
            className="mt-8 md:mt-10 text-white text-2xl cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 2.5, duration: 0.6 }}
          >
            <a href="#projects" className="animate-bounce pointer-events-auto">
              ↓
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={showLeaderboard ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.4 }}
          className="hidden md:block pointer-events-none"
        >
          {showLeaderboard && <LeaderboardCard />}
          {!showLeaderboard && (
            <div className="hidden md:block text-xs text-gray-500 text-right pr-1">
              {isSk
                ? 'Tip: klikni na bublinu – spustíš mini hru a globálny leaderboard.'
                : 'Tip: click a bubble to start the mini game and the global leaderboard.'}
            </div>
          )}
        </motion.div>
      </div>

      {showLeaderboard && mobileLbOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm p-4 flex items-end"
          onClick={() => setMobileLbOpen(false)}
        >
          <div
            className="w-full max-w-xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-xs text-gray-300">
                {isSk ? 'Leaderboard' : 'Leaderboard'}
              </span>
              <button
                type="button"
                onClick={() => setMobileLbOpen(false)}
                className="text-xs text-gray-300 hover:text-white transition pointer-events-auto"
              >
                {isSk ? 'Zavrieť' : 'Close'}
              </button>
            </div>

            <div className="rounded-3xl overflow-hidden">
              <LeaderboardCard compact />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes moveBubble {
          to {
            transform: translateY(-100vh);
          }
        }

        @keyframes popRing {
          0% {
            transform: scale(0.6);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.9);
            opacity: 0;
          }
        }

        .bubble {
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }

        .pop-ring {
          border: 2px solid rgba(56, 189, 248, 0.9);
          background: radial-gradient(circle, rgba(56, 189, 248, 0.35), transparent 65%);
          animation: popRing 0.22s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
