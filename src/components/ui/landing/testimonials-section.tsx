import type { Testimonial } from '@/types/landing'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials.length) return null

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-[#DDB43C] text-sm font-semibold tracking-widest uppercase mb-3">
            Testimonios
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-[#DDB43C]/40" />
            <div className="w-12 h-1 bg-[#DDB43C] rounded-full" />
            <div className="w-8 h-px bg-[#DDB43C]/40" />
          </div>
          <p className="text-[#666666] max-w-xl mx-auto mt-5">
            Más de 10 años de confianza avalan nuestra trayectoria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group bg-white p-7 rounded-2xl border border-gray-100 hover:border-[#DDB43C]/30 shadow-sm hover:shadow-[0_8px_30px_rgba(221,180,60,0.08)] transition-all duration-300"
            >
              {/* Stars */}
              {t.rating && (
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-base ${i < t.rating! ? 'text-[#DDB43C]' : 'text-gray-200'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
              {/* Quote mark */}
              <p className="text-[#DDB43C] text-4xl font-serif leading-none mb-1 opacity-40">"</p>
              <p className="text-[#444444] text-sm leading-relaxed mb-5 italic">
                {t.content}
              </p>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-[#111111] text-sm">{t.author_name}</p>
                {t.author_role && (
                  <p className="text-xs text-[#999999] mt-0.5">{t.author_role}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}