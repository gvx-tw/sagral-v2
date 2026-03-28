'use client'

export function useAnalytics() {
  const track = async (
    event_type: string,
    payload?: {
      vehicle_id?: number
      search_query?: string
      metadata?: Record<string, unknown>
    }
  ) => {
    try {
      // Fire and forget — no await en el caller
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type, ...payload }),
      })
    } catch {
      // Silencioso — analytics no debe romper la UI
    }
  }

  return { track }
}