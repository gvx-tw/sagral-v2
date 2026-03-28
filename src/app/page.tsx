import { HeroSection } from '@/components/ui/landing/hero-section'
import { FeaturedVehicles } from '@/components/ui/landing/featured-vehicles'
import { ServicesSection } from '@/components/ui/landing/services-section'
import { WhyUsSection } from '@/components/ui/landing/why-us-section'
import { TestimonialsSection } from '@/components/ui/landing/testimonials-section'
import { ContactSection } from '@/components/ui/landing/contact-section'
import { Footer } from '@/components/ui/landing/footer'
import { WhatsAppFAB } from '@/components/ui/landing/whatsapp-fab'
import { AnalyticsTracker } from '@/components/ui/landing/analytics-tracker'
import type { LandingData } from '@/types/landing'

async function getLandingData(): Promise<LandingData> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/landing`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error('API error')
    return res.json()
  } catch {
    return { vehicles: [], testimonials: [], config: {} }
  }
}

export default async function HomePage() {
  const { vehicles, testimonials, config } = await getLandingData()

  return (
    <>
      <HeroSection whatsapp={config.whatsapp} />
      <FeaturedVehicles vehicles={vehicles} />
      <ServicesSection />
      <WhyUsSection />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection config={config} />
      <Footer config={config} />
      <WhatsAppFAB whatsapp={config.whatsapp} />
      <AnalyticsTracker />
    </>
  )
}