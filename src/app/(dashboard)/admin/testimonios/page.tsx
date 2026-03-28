import { db } from '@/db'
import { testimonials } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { Badge } from '@/components/ui/badge'
import { TestimonialActions } from './testimonial-actions'

export default async function TestimonialsPage() {
  const list = await db
    .select()
    .from(testimonials)
    .orderBy(desc(testimonials.createdAt))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Testimonios</h1>
        <p className="text-zinc-400 text-sm">
          {list.length} testimonios · {list.filter(t => t.isVisible).length} visibles
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Autor</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Testimonio</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Rating</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Fecha</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Estado</th>
              <th className="text-right px-4 py-3 text-zinc-500 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-600">
                  No hay testimonios todavía
                </td>
              </tr>
            ) : (
              list.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-zinc-100 font-medium">{t.author}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs max-w-sm truncate">
                    {t.text}
                  </td>
                  <td className="px-4 py-3 text-zinc-300 text-xs">
                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {new Date(t.createdAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3">
                    {t.isVisible ? (
                      <Badge className="bg-emerald-900/50 text-emerald-400 border-emerald-800 text-xs">
                        Visible
                      </Badge>
                    ) : (
                      <Badge className="bg-zinc-700 text-zinc-400 text-xs">
                        Oculto
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <TestimonialActions id={t.id} isVisible={t.isVisible} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}