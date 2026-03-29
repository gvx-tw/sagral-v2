'use client'

import { Award, ShieldCheck, MessageCircle, ClipboardCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

interface Reason {
  icon: LucideIcon
  title: string
  description: string
}

const reasons: Reason[] = [
  {
    icon: Award,
    title: '+10 Años de Trayectoria',
    description: 'Somos referentes del mercado automotor en la región con más de una década de experiencia.',
  },
  {
    icon: ShieldCheck,
    title: 'Vehículos Verificados',
    description: 'Cada auto pasa por revisión técnica antes de ser publicado en nuestro catálogo.',
  },
  {
    icon: MessageCircle,
    title: 'Atención Personalizada',
    description: 'Te asesoramos para encontrar el auto ideal según tu presupuesto y necesidades.',
  },
  {
    icon: ClipboardCheck,
    title: 'Trámites Sin Estrés',
    description: 'Nos encargamos de toda la documentación para que vos solo te preocupes de manejar.',
  },
]

export function WhyUsSection() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 bg-[#0a0a0a] transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Gold top border accent */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-[#DDB43C]/40 to-transparent" />

      <div className="container mx-auto px-4 pt-16 pb-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-[#DDB43C] text-sm font-semibold tracking-widest uppercase mb-3">
            Nuestra diferencia
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Por qué elegirnos?
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-[#DDB43C]/40" />
            <div className="w-12 h-1 bg-[#DDB43C] rounded-full" />
            <div className="w-8 h-px bg-[#DDB43C]/40" />
          </div>
          <p className="text-white/50 max-w-xl mx-auto mt-5">
            No somos solo una concesionaria. Somos tu socio en cada paso.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => {
            const Icon = r.icon
            return (
              <div
                key={r.title}
                className="group text-center p-8 rounded-2xl border border-white/5 hover:border-[#DDB43C]/30 bg-white/3 hover:bg-white/5 transition-all duration-300"
                style={{ transitionDelay: inView ? `${i * 100}ms` : '0ms' }}
              >
                {/* Icon ring */}
                <div className="relative w-16 h-16 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full border border-[#DDB43C]/20 group-hover:border-[#DDB43C]/60 transition-all duration-300 group-hover:scale-110" />
                  <div className="w-full h-full rounded-full bg-[#DDB43C]/8 group-hover:bg-[#DDB43C]/15 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-7 h-7 text-[#DDB43C]/70 group-hover:text-[#DDB43C] transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{r.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-300">{r.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Gold bottom border accent */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-[#DDB43C]/40 to-transparent mt-16" />
    </section>
  )
}