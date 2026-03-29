'use client'

import { useAnalytics } from '@/hooks/use-analytics'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'

interface HeroSectionProps {
  whatsapp?: string
}

export function HeroSection({ whatsapp }: HeroSectionProps) {
  const { track } = useAnalytics()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Hola%2C%20me%20interesa%20un%20veh%C3%ADculo`
    : '#'

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/95 backdrop-blur-lg border-b border-white/10 shadow-2xl shadow-black/40'
            : 'bg-black/80 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-512.png"
              alt="Sagral Automotores"
              className="h-9 w-9 transition-transform duration-200 group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col leading-tight ml-1">
              <span className="text-[#DDB43C] font-bold text-sm tracking-widest">SAGRAL</span>
              <span className="text-white/60 text-[10px] tracking-widest">AUTOMOTORES</span>
            </div>
          </Link>


          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link href="/"          className="text-white/70 hover:text-[#DDB43C] transition-colors duration-200">Inicio</Link>
            <Link href="/catalogo"  className="text-white/70 hover:text-[#DDB43C] transition-colors duration-200">Catálogo</Link>
            <Link href="/#contacto" className="text-white/70 hover:text-[#DDB43C] transition-colors duration-200">Contacto</Link>
            <Link
              href="/catalogo"
              className="px-5 py-2 bg-[#DDB43C] hover:bg-[#B8941F] text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-[#DDB43C]/20 hover:shadow-[#DDB43C]/40 hover:scale-105"
            >
              Ver autos
            </Link>
          </nav>

          {/* Mobile CTA */}
          <Link
            href="/catalogo"
            className="md:hidden px-4 py-2 bg-[#DDB43C] hover:bg-[#B8941F] text-black font-bold rounded-lg text-sm transition-all duration-200 shadow-lg shadow-[#DDB43C]/20"
          >
            Ver autos
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial gold glow — dramatic */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_55%,rgba(221,180,60,0.13)_0%,transparent_70%)]" />
          {/* Wide bottom glow */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-[#DDB43C]/5 to-transparent" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(#DDB43C 1px, transparent 1px), linear-gradient(90deg, #DDB43C 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />
          {/* Fade out bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent" />
        </div>

        {/* Glowing orb behind title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#DDB43C]/6 rounded-full blur-[120px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center pt-16">

          {/* Badge */}
          <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <span className="inline-flex items-center gap-2 mb-7 px-5 py-2 rounded-full border border-[#DDB43C]/40 text-[#DDB43C] text-sm font-medium bg-[#DDB43C]/5 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DDB43C] animate-pulse" />
              Concesionaria oficial en Bahía Blanca
            </span>
          </div>

          {/* Headline */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white mb-6 leading-[1.05] tracking-tight font-(family-name:--font-display)">
              Tu próximo auto,
              <br />
              <span className="text-[#DDB43C]">a un paso</span>
            </h1>
          </div>

          {/* Subtext */}
          <div className="animate-fade-in-up" style={{ animationDelay: '320ms' }}>
            <p className="text-base md:text-lg text-white/55 mb-10 max-w-lg mx-auto leading-relaxed">
              Venta de autos nuevos y usados, financiación y gestión documental.
              Más de 10 años en el mercado automotor.
            </p>
          </div>

          {/* CTAs */}
          <div
            className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: '440ms' }}
          >
            <Link
              href="/catalogo"
              className="px-9 py-4 bg-[#DDB43C] hover:bg-[#B8941F] text-black font-bold rounded-xl transition-all duration-200 hover:scale-105 shadow-xl shadow-[#DDB43C]/30 hover:shadow-[#DDB43C]/50 text-base"
            >
              Ver Catálogo
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { metadata: { source: 'hero' } })}
              className="px-9 py-4 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2.5 text-base backdrop-blur-sm"
            >
              <WhatsAppIcon />
              Consultar por WhatsApp
            </a>
          </div>

          {/* Stats strip */}
          <div
            className="animate-fade-in-up mt-16 pt-8 border-t border-white/8"
            style={{ animationDelay: '600ms' }}
          >
            <div className="flex justify-center items-center gap-6 md:gap-12 flex-wrap">
              <StatItem prefix="+" end={10} label="Años de trayectoria" />
              <div className="hidden md:block w-px h-8 bg-white/10" />
              <StatItem prefix="+" end={500} label="Vehículos vendidos" />
              <div className="hidden md:block w-px h-8 bg-white/10" />
              <StatItem end={100} suffix="%" label="Trámites en regla" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <ChevronDown className="w-6 h-6 text-[#DDB43C]" />
        </div>
      </section>
    </>
  )
}

function StatItem({ prefix, end, suffix, label }: { prefix?: string; end: number; suffix?: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-bold text-[#DDB43C]">
        <AnimatedCounter end={end} prefix={prefix} suffix={suffix} />
      </p>
      <p className="text-xs text-white/40 mt-1 tracking-wider uppercase">{label}</p>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}