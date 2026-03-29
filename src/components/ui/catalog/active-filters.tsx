// src/components/ui/catalog/active-filters.tsx
import Link from 'next/link'
import { X } from 'lucide-react'
import type { CatalogFilters } from '@/types/catalog'

const FILTER_LABELS: Record<string, string> = {
  brand: 'Marca',
  condition: 'Condición',
  fuel_type: 'Combustible',
  transmission: 'Transmisión',
  year_from: 'Año desde',
  year_to: 'Año hasta',
  price_from: 'Precio desde',
  price_to: 'Precio hasta',
  search: 'Búsqueda',
}

const ACTIVE_FILTER_KEYS = Object.keys(FILTER_LABELS) as Array<keyof CatalogFilters>

interface ActiveFiltersProps {
  filters: CatalogFilters
}

function buildUrl(filters: CatalogFilters, exclude: keyof CatalogFilters): string {
  const params = new URLSearchParams()
  for (const key of ACTIVE_FILTER_KEYS) {
    if (key !== exclude && filters[key]) {
      params.set(key, filters[key] as string)
    }
  }
  const q = params.toString()
  return `/catalogo${q ? `?${q}` : ''}`
}

function buildClearAllUrl(): string {
  return '/catalogo'
}

export function ActiveFilters({ filters }: ActiveFiltersProps) {
  const activeEntries = ACTIVE_FILTER_KEYS.filter(
    (key) => filters[key] && key !== 'page'
  )

  if (activeEntries.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      {activeEntries.map((key) => (
        <Link
          key={key}
          href={buildUrl(filters, key)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-[#DDB43C]/60 text-sm text-[#111111] rounded-full hover:bg-amber-100 hover:border-[#DDB43C] transition-colors duration-200 group"
          aria-label={`Quitar filtro ${FILTER_LABELS[key]}`}
        >
          <span className="text-[#666666] text-xs">{FILTER_LABELS[key]}:</span>
          <span className="font-medium">{filters[key]}</span>
          <X className="w-3 h-3 text-[#DDB43C] group-hover:text-black transition-colors" />
        </Link>
      ))}

      {activeEntries.length > 1 && (
        <Link
          href={buildClearAllUrl()}
          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 text-sm text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200"
        >
          Limpiar todo
          <X className="w-3 h-3" />
        </Link>
      )}
    </div>
  )
}
