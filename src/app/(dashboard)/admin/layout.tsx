import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/ui/admin/sidebar'
import { AdminHeader } from '@/components/ui/admin/header'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    if (!session) redirect('/login')

    return (
        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
            <AdminSidebar role={session.user?.role ?? 'vendedor'} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <AdminHeader user={session.user} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}