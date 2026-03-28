'use client'

import { useEffect } from 'react'
import { useAnalytics } from '@/hooks/use-analytics'

export function AnalyticsTracker() {
  const { track } = useAnalytics()

  useEffect(() => {
    track('view')
    // Solo se ejecuta una vez al montar
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null // No renderiza nada
}