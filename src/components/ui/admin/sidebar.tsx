'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Car,
    MessageSquare,
    BarChart2,
    ScrollText,
    Star,
    Users,
    Settings,
} from 'lucide-react'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
    { href: '/admin/vehicles', label: 'Vehículos', icon: Car, adminOnly: false },
    { href: '/admin/leads', label: 'Leads', icon: MessageSquare, adminOnly: false },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart2, adminOnly: false },
    { href: '/admin/logs', label: 'Historial', icon: ScrollText, adminOnly: false },
    { href: '/admin/testimonios', label: 'Testimonios', icon: Star, adminOnly: false },
    { href: '/admin/users', label: 'Usuarios', icon: Users, adminOnly: true },
    { href: '/admin/config', label: 'Configuración', icon: Settings, adminOnly: true },
]

export function AdminSidebar({ role }: { role: string }) {
    const pathname = usePathname()
    const isAdmin = role === 'admin'

    const visible = navItems.filter(item => !item.adminOnly || isAdmin)

    return (
        <aside className="w-56 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="h-16 flex items-center px-5 border-b border-zinc-800">
                <span className="text-sm font-semibold tracking-widest uppercase text-zinc-100">
                    Sagral
                </span>
                <span className="ml-1 text-xs text-zinc-500 tracking-widest uppercase">
                    Admin
                </span>
            </div>

            <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
                {visible.map(({ href, label, icon: Icon, adminOnly }) => {
                    const active =
                        href === '/admin'
                            ? pathname === '/admin'
                            : pathname.startsWith(href)

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                                active
                                    ? 'bg-zinc-800 text-white'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                            )}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{label}</span>
                            {adminOnly && (
                                <span className="ml-auto text-[10px] text-zinc-600">
                                    admin
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-3 border-t border-zinc-800">
                <p className="text-[11px] text-zinc-600 text-center">
                    Sagral Automotores
                </p>
            </div>
        </aside>
    )
}