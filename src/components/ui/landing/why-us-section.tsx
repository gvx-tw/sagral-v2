import { Award, ShieldCheck, MessageCircle, ClipboardCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Reason {
  icon: LucideIcon
  title: string
  description: string
}

const reasons: Reason[] = [
  {
    icon: Award,
    title: '+10 Años de Trayectoria',
    description: 'Somos referentes del mercado automotor en Chaco con más de una década de experiencia.',
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
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            No somos solo una concesionaria. Somos tu socio en cada paso.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.title} className="text-center group">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{r.title}</h3>
                <p className="text-gray-600 text-sm">{r.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}