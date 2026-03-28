import type { Vehicle as DbVehicle, VehicleImage } from '@/db/schema'

// Vehicle extendido con imágenes completas (que retorna la API de detalle)
export type VehicleWithImages = DbVehicle & { images: VehicleImage[] }

// Re-exportar el tipo base del schema para compatibilidad
export type { DbVehicle as Vehicle }

export interface CatalogFilters {
  brand?: string
  condition?: string          // 'nuevo' | 'usado'
  fuel_type?: string          // 'nafta' | 'diesel' | 'gnc' | 'hibrido' | 'electrico'
  transmission?: string       // 'manual' | 'automatica'
  year_from?: string
  year_to?: string
  price_from?: string
  price_to?: string
  search?: string
  page?: string
}

export interface CatalogData {
  vehicles: VehicleWithImages[]
  total: number
  page: number
  totalPages: number
  brands: string[]
}