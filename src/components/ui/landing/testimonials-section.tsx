import type { Testimonial } from '@/types/landing'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials.length) return null

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Más de 10 años de confianza avalan nuestra trayectoria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              {t.rating && (
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < t.rating! ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-700 text-sm mb-4 italic">
                &quot;{t.content}&quot;
              </p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.author_name}</p>
                {t.author_role && (
                  <p className="text-xs text-gray-500">{t.author_role}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}