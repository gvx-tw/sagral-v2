'use client'

import {
  Car,
  CarFront,
  CreditCard,
  ArrowLeftRight,
  DollarSign,
  FileText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

interface Service {
  icon: LucideIcon
  title: string
  description: string
}

const services: Service[] = [
  {
    icon: Car,
    title: 'Venta de Autos Nuevos',
    description: 'Las últimas versiones de las principales marcas, con garantía de fábrica.',
  },
  {
    icon: CarFront,
    title: 'Autos Usados',
    description: 'Stock variado de autos usados revisados y certificados por nuestros técnicos.',
  },
  {
    icon: CreditCard,
    title: 'Financiación',
    description: 'Planes en cuotas fijas y variables. Tramitamos el crédito por vos.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Tomamos Tu Usado',
    description: 'Recibimos tu vehículo como parte de pago con tasación justa.',
  },
  {
    icon: DollarSign,
    title: 'Vendé Tu Auto',
    description: 'Te ayudamos a vender tu vehículo al mejor precio del mercado.',
  },
  {
    icon: FileText,
    title: 'Gestión Documental',
    description: 'Transferencias, patentamiento y trámites de A a Z. Sin vueltas.',
  },
]

export function ServicesSection() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 bg-white transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-[#DDB43C] text-sm font-semibold tracking-widest uppercase mb-3">
            Todo en un lugar
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">
            Nuestros Servicios
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-[#DDB43C]/40" />
            <div className="w-12 h-1 bg-[#DDB43C] rounded-full" />
            <div className="w-8 h-px bg-[#DDB43C]/40" />
          </div>
          <p className="text-[#666666] max-w-xl mx-auto mt-5">
            Todo lo que necesitás para tu auto en un solo lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="group bg-white p-7 rounded-2xl border border-gray-100 hover:border-[#DDB43C]/35 hover:shadow-[0_8px_32px_rgba(221,180,60,0.10)] transition-all duration-300 cursor-default"
                style={{ transitionDelay: inView ? `${i * 80}ms` : '0ms' }}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-[#DDB43C]/12 flex items-center justify-center mb-5 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-amber-600 group-hover:text-[#DDB43C] transition-colors duration-300" />
                </div>
                <h3 className="text-base font-bold text-[#111111] mb-2">{s.title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed">{s.description}</p>
                {/* Gold bottom accent */}
                <div className="mt-5 h-0.5 w-0 group-hover:w-10 bg-[#DDB43C] rounded-full transition-all duration-500" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}