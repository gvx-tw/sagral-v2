// src/types/vehicle-detail.ts

export interface VehicleImage {
  id: string
  vehicleId: string
  url: string
  publicId: string | null
  isCover: boolean
  order: number | null
  createdAt: Date | string | null
}

export interface VehicleDetail {
  id: string
  brand: string
  model: string
  year: number
  price: number
  currency?: string
  km: number
  fuelType: 'nafta' | 'diesel' | 'gnc' | 'hibrido' | 'electrico'
  transmission: 'manual' | 'automatica'
  condition: 'nuevo' | 'usado'
  color: string | null
  description: string | null
  isFeatured: boolean
  isSold: boolean
  createdAt: Date | string | null
  images: VehicleImage[]
}

export interface LeadFormData {
  vehicleId: string
  name: string
  phone: string
  email?: string
  message: string
}

export interface RelatedVehicle {
  id: string
  brand: string
  model: string
  year: number
  price: number
  km: number
  condition: 'nuevo' | 'usado'
  isSold: boolean
  images: VehicleImage[]
}