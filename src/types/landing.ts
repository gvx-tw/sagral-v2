export interface FeaturedVehicle {
  id: string
  brand: string
  model: string
  year: number
  price: number
  currency: string
  mileage: number
  fuel_type: string
  transmission: string
  main_image: string | null
  condition: string
  is_featured: boolean
}

export interface Testimonial {
  id: number
  author_name: string
  author_role: string | null
  content: string
  rating: number | null
  is_visible: boolean
  created_at: Date
}

export interface SiteConfig {
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  hours?: string
  instagram?: string
  facebook?: string
  [key: string]: string | undefined
}

export interface LandingData {
  vehicles: FeaturedVehicle[]
  testimonials: Testimonial[]
  config: SiteConfig
}