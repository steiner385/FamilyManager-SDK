import { useMemo } from 'react'
import { LayoutManager } from '../core/layout/LayoutManager'

export function useLayout(layoutId: string) {
  const manager = LayoutManager.getInstance()
  
  const layout = useMemo(() => manager.getLayout(layoutId), [layoutId])

  return {
    layout,
    isRegistered: !!layout
  }
}
