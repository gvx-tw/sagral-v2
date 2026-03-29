import { signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'

type Props = {
    user?: {
        name?: string | null
        email?: string | null
        role?: string | null
    }
}

export function AdminHeader({ user }: Props) {
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : user?.email?.[0]?.toUpperCase() ?? 'A'

    return (
        <header className="h-16 flex items-center justify-end px-6 border-b border-zinc-800 bg-zinc-900 shrink-0">
            <div className="flex items-center gap-3">
                {user?.role && (
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                        {user.role}
                    </span>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-black border border-[#DDB43C] text-[#DDB43C] text-xs font-bold">
                                        SA
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        }
                    />
                    <DropdownMenuContent
                        className="w-56 bg-zinc-900 border-zinc-800 text-zinc-100"
                    >
                        <div className="px-3 py-2">
                            <p className="text-sm font-medium truncate">
                                {user?.name ?? 'Usuario'}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem className="p-0">
                            <form
                                action={async () => {
                                    'use server'
                                    await signOut({ redirectTo: '/login' })
                                }}
                                className="w-full"
                            >
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-zinc-300 hover:text-white cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Cerrar sesión
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}