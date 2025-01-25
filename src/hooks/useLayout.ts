import { useMemo } from 'react';
import { LayoutManager } from '../core/layout/LayoutManager';
import type { LayoutConfig } from '../core/layout/types';

interface UseLayoutResult {
  layout: LayoutConfig | undefined;
  isRegistered: boolean;
}

export function useLayout(layoutId: string): UseLayoutResult {
  const manager = LayoutManager.getInstance()
  
  const layout = useMemo(() => manager.getLayout(layoutId), [layoutId])

  return {
    layout,
    isRegistered: !!layout
  }
}
