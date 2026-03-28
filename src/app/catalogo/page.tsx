import { Suspense } from 'react'
import { CatalogFilters } from '@/components/ui/catalog/catalog-filters'
import { CatalogSearch } from '@/components/ui/catalog/catalog-search'
import { VehicleCard } from '@/components/ui/catalog/vehicle-card'
import { CatalogPagination } from '@/components/ui/catalog/catalog-pagination'
import { CatalogData, CatalogFilters as FilterType } from '@/types/catalog'

interface PageProps {
  searchParams: Promise<FilterType>
}

async function getCatalogData(filters: FilterType): Promise<CatalogData> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/catalog?${params.toString()}`, {
    cache: 'no-store', // filtros cambian → no cachear
  })

  if (!res.ok) throw new Error('Error al cargar el catálogo')
  return res.json()
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const filters = await searchParams
  const data = await getCatalogData(filters)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Catálogo de Vehículos
          </h1>
          <p className="text-gray-500 mt-1">
            {data.total} {data.total === 1 ? 'vehículo encontrado' : 'vehículos encontrados'}
          </p>
        </div>

        {/* Buscador — Suspense necesario porque useSearchParams es async */}
        <div className="mb-6">
          <Suspense fallback={<div className="h-12 bg-gray-200 rounded-xl animate-pulse" />}>
            <CatalogSearch />
          </Suspense>
        </div>

        {/* Layout: filtros sidebar + grilla */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar filtros */}
          <Suspense fallback={null}>
            <CatalogFilters brands={data.brands} />
          </Suspense>

          {/* Grilla de vehículos */}
          <div className="flex-1">
            {data.vehicles.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-5xl mb-4">🚗</p>
                <p className="text-lg font-medium">No se encontraron vehículos</p>
                <p className="text-sm mt-1">Probá ajustando los filtros</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.vehicles.map(vehicle => (
                  <Suspense key={vehicle.id} fallback={
                    <div className="aspect-4/3 bg-gray-200 rounded-xl animate-pulse" />
                  }>
                    <VehicleCard vehicle={vehicle} />
                  </Suspense>
                ))}
              </div>
            )}

            {/* Paginación */}
            <Suspense fallback={null}>
              <CatalogPagination
                currentPage={data.page}
                totalPages={data.totalPages}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}