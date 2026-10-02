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
      currentRef.current = next
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
    let startX = 0
    let startY = 0
    let touchActive = false
    let touchStartedInLockedArea = false
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        touchActive = false
        return
      }
      touchActive = true
      touchStartedInLockedArea = isScrollLocked(e.target)
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchActive || !e.changedTouches[0]) return
      touchActive = false
      if (touchStartedInLockedArea) { touchStartedInLockedArea = false; return }
      const diffX = startX - e.changedTouches[0].clientX
      const diffY = startY - e.changedTouches[0].clientY
      if (Math.abs(diffY) >= 50 && Math.abs(diffY) > Math.abs(diffX) * 1.15) {
        jump(diffY > 0 ? 1 : -1)
      }
    }
    const onTouchCancel = () => {
      touchActive = false
      touchStartedInLockedArea = false
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchCancel, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchCancel)
    }
  }, [goTo, total])

  return (
    <div className="fixed inset-0 z-10 overflow-hidden">
      <AnimatePresence custom={direction} mode="sync">
        <motion.div key={current} custom={direction} variants={vars} initial="enter" animate="center" exit="exit" className="absolute inset-0 overflow-hidden" style={{ willChange: 'transform, opacity' }}>
          {sections[current]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
