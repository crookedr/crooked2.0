'use client'

import { Children, ReactNode, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSectionCtx } from '../context/section-context'

const COOLDOWN = 750
const ease = [0.76, 0, 0.24, 1] as const
const vars = {
  enter: (d: number) => ({ y: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { y: '0%', opacity: 1, transition: { y: { duration: 0.52, ease }, opacity: { duration: 0.18 } } },
  exit: (d: number) => ({ y: d > 0 ? '-100%' : '100%', opacity: 0, transition: { y: { duration: 0.42, ease }, opacity: { duration: 0.14 } } }),
}

export default function CubeScroller({ children }: { children: ReactNode }) {
  const { current, direction, goTo, total } = useSectionCtx()
  const sections = Children.toArray(children)
  const cooldown = useRef(false)
  const currentRef = useRef(current)
  useEffect(() => { currentRef.current = current }, [current])

  useEffect(() => {
    const isScrollLocked = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('[data-section-scroll-lock]'))

    const jump = (dir: 1 | -1) => {
      if (cooldown.current) return
      const next = currentRef.current + dir
      if (next < 0 || next >= total) return
      cooldown.current = true
      goTo(next)
      setTimeout(() => (cooldown.current = false), COOLDOWN)
    }
    const onWheel = (e: WheelEvent) => {
      if (isScrollLocked(e.target)) return
      if (Math.abs(e.deltaY) >= 3) { e.preventDefault(); jump(e.deltaY > 0 ? 1 : -1) }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') jump(1)
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') jump(-1)
    }
    let startY = 0
    let touchStartedInLockedArea = false
    const onTouchStart = (e: TouchEvent) => {
      touchStartedInLockedArea = isScrollLocked(e.target)
      startY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartedInLockedArea) { touchStartedInLockedArea = false; return }
      const diff = startY - e.changedTouches[0].clientY
      if (Math.abs(diff) >= 50) jump(diff > 0 ? 1 : -1)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [goTo, total])

  return (
    <div className="fixed inset-0 z-10 overflow-hidden">
      <AnimatePresence custom={direction} mode="sync">
        <motion.div key={current} custom={direction} variants={vars} initial="enter" animate="center" exit="exit" className="absolute inset-0 overflow-y-auto overflow-x-hidden" style={{ willChange: 'transform, opacity' }}>
          {sections[current]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
