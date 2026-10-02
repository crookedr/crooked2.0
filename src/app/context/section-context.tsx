'use client'

import { createContext, useCallback, useContext, useState, ReactNode } from 'react'

type SectionCtx = {
  current: number
  direction: 1 | -1
  goTo: (i: number) => void
  total: number
}

const Ctx = createContext<SectionCtx | undefined>(undefined)

export function SectionProvider({ total, children }: { total: number; children: ReactNode }) {
  const [state, setState] = useState<{ current: number; direction: 1 | -1 }>({ current: 0, direction: 1 })
  const goTo = useCallback((i: number) => {
    setState((prev) => {
      if (i === prev.current || i < 0 || i >= total) return prev
      return { current: i, direction: i > prev.current ? 1 : -1 }
    })
  }, [total])
  return <Ctx.Provider value={{ current: state.current, direction: state.direction, goTo, total }}>{children}</Ctx.Provider>
}

export function useSectionCtx() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSectionCtx must be used within SectionProvider')
  return ctx
}
