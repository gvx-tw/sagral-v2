import {
  Car,
  CarFront,
  CreditCard,
  ArrowLeftRight,
  DollarSign,
  FileText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Todo lo que necesitás para tu auto en un solo lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="bg-slate-50 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}