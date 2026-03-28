import type { SiteConfig } from '@/types/landing'

interface ContactSectionProps {
  config: SiteConfig
}

export function ContactSection({ config }: ContactSectionProps) {
  const waLink = config.whatsapp
    ? `https://wa.me/${config.whatsapp.replace(/\D/g, '')}?text=Hola%2C%20quiero%20hacer%20una%20consulta`
    : null

  return (
    <section className="py-20 bg-white" id="contacto">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contacto
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Estamos para ayudarte. Comunicáte por el medio que prefieras.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info de contacto */}
          <div className="space-y-6">
            {config.phone && (
              <ContactItem
                icon="📞"
                label="Teléfono"
                value={config.phone}
                href={`tel:${config.phone}`}
              />
            )}
            {waLink && (
              <ContactItem
                icon="💬"
                label="WhatsApp"
                value={config.whatsapp!}
                href={waLink}
              />
            )}
            {config.email && (
              <ContactItem
                icon="✉️"
                label="Email"
                value={config.email}
                href={`mailto:${config.email}`}
              />
            )}
            {config.address && (
              <ContactItem
                icon="📍"
                label="Dirección"
                value={config.address}
              />
            )}
            {config.hours && (
              <ContactItem
                icon="🕐"
                label="Horarios"
                value={config.hours}
              />
            )}
          </div>

          {/* Mapa iframe */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 h-72 lg:h-auto bg-gray-100 flex items-center justify-center">
            {config.address ? (
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(config.address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '280px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Sagral Automotores"
              />
            ) : (
              <p className="text-gray-400 text-sm">Mapa no disponible</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: string
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-xl">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
        {content}
      </a>
    )
  }

  return <div>{content}</div>
}