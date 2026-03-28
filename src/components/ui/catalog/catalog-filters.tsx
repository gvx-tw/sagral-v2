'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface Props {
  brands: string[]
}

export function CatalogFilters({ brands }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Helper para actualizar un param y resetear a página 1
  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // siempre volver a página 1 al filtrar
    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, router, pathname])

  const currentValue = (key: string) => searchParams.get(key) || ''

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-5">
        <h2 className="font-semibold text-gray-900">Filtros</h2>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          <select
            value={currentValue('brand')}
            onChange={e => updateFilter('brand', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Condición */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condición
          </label>
          <select
            value={currentValue('condition')}
            onChange={e => updateFilter('condition', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            <option value="nuevo">Nuevo</option>
<option value="usado">Usado</option>
          </select>
        </div>

        {/* Combustible */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Combustible
          </label>
          <select
            value={currentValue('fuel_type')}
            onChange={e => updateFilter('fuel_type', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            <option value="nafta">Nafta</option>
            <option value="diesel">Diésel</option>
            <option value="electrico">Eléctrico</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>

        {/* Transmisión */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transmisión
          </label>
          <select
            value={currentValue('transmission')}
            onChange={e => updateFilter('transmission', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            <option value="manual">Manual</option>
            <option value="automatica">Automática</option>
          </select>
        </div>

        {/* Año */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Desde"
              value={currentValue('year_from')}
              onChange={e => updateFilter('year_from', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Hasta"
              value={currentValue('year_to')}
              onChange={e => updateFilter('year_to', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio (USD)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Desde"
              value={currentValue('price_from')}
              onChange={e => updateFilter('price_from', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Hasta"
              value={currentValue('price_to')}
              onChange={e => updateFilter('price_to', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Limpiar filtros */}
        <button
          onClick={() => router.push(pathname)}
          className="w-full text-sm text-gray-500 hover:text-red-500 underline"
        >
          Limpiar filtros
        </button>
      </div>
    </aside>
  )
}