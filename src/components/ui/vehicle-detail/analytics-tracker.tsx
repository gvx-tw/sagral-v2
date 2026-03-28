'use client'

import { useEffect } from 'react'

interface AnalyticsTrackerProps {
  vehicleId: string
}

export function AnalyticsTracker({ vehicleId }: AnalyticsTrackerProps) {
  // Registrar el evento "view" cuando la página carga
  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'view', vehicleId }),
    }).catch(() => {})
  }, [vehicleId])

  // Registrar el evento "whatsapp_click" cuando se hace click en el botón
  useEffect(() => {
    const btn = document.getElementById('whatsapp-cta')
    if (!btn) return

    const handleClick = () => {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'whatsapp_click', vehicleId }),
      }).catch(() => {})
    }

    btn.addEventListener('click', handleClick)
    return () => btn.removeEventListener('click', handleClick)
  }, [vehicleId])

  return null
}
