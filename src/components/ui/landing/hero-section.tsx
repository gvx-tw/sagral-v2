'use client'

import { useAnalytics } from '@/hooks/use-analytics'
import Link from 'next/link'

interface HeroSectionProps {
  whatsapp?: string
}

export function HeroSection({ whatsapp }: HeroSectionProps) {
  const { track } = useAnalytics()

  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Hola%2C%20me%20interesa%20un%20veh%C3%ADculo`
    : '#'

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-gray-800 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm font-medium border border-blue-600/30">
          Concesionaria oficial en Bahía Blanca
        </span>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Tu próximo auto,{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">
            a un paso
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Venta de autos nuevos y usados, financiación y gestión de documentación.
          Más de 10 años en el mercado automotor del norte argentino.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalogo"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-600/25"
          >
            Ver Catálogo
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', { metadata: { source: 'hero' } })}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-green-600/25 flex items-center justify-center gap-2"
          >
            <WhatsAppIcon />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}