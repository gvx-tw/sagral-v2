import type { SiteConfig } from '@/types/landing'
import Link from 'next/link'

interface FooterProps {
  config: SiteConfig
}

export function Footer({ config }: FooterProps) {
  return (
    <footer className="bg-gray-950 dark:bg-black text-gray-400 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo y descripción */}
          <div>
            <h3 className="text-[#DDB43C] text-lg font-bold mb-2">Sagral Automotores</h3>
            <p className="text-sm">
              Concesionaria de autos nuevos y usados en Chaco, Argentina.
            </p>
            {/* Redes sociales */}
            <div className="flex gap-3 mt-4">
              {config.instagram && (
                <SocialLink href={config.instagram} label="Instagram">
                  <InstagramIcon />
                </SocialLink>
              )}
              {config.facebook && (
                <SocialLink href={config.facebook} label="Facebook">
                  <FacebookIcon />
                </SocialLink>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#DDB43C] transition-colors">Inicio</Link></li>
              <li><Link href="/catalogo" className="hover:text-[#DDB43C] transition-colors">Catálogo</Link></li>
              <li><Link href="/#contacto" className="hover:text-[#DDB43C] transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contacto rápido */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contacto rápido</h4>
            <ul className="space-y-2 text-sm">
              {config.phone && <li>📞 {config.phone}</li>}
              {config.email && <li>✉️ {config.email}</li>}
              {config.address && <li>📍 {config.address}</li>}
              {config.hours && <li>🕐 {config.hours}</li>}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Sagral Automotores. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-[#DDB43C] transition-colors"
    >
      {children}
    </a>
  )
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}