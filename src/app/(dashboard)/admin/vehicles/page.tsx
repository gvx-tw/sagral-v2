import { db } from '@/db'
import { vehicles } from '@/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { VehicleActions } from './vehicle-actions'

export default async function VehiclesPage() {
    const list = await db
        .select()
        .from(vehicles)
        .orderBy(desc(vehicles.createdAt))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white mb-1">Vehículos</h1>
                    <p className="text-zinc-400 text-sm">{list.length} vehículos en total</p>
                </div>
                <Link href="/admin/vehicles/new">
                    <Button className="bg-white text-zinc-900 hover:bg-zinc-200 gap-2">
                        <Plus className="w-4 h-4" />
                        Nuevo vehículo
                    </Button>
                </Link>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            <th className="text-left px-4 py-3 text-zinc-500 font-medium">Vehículo</th>
                            <th className="text-left px-4 py-3 text-zinc-500 font-medium">Año</th>
                            <th className="text-left px-4 py-3 text-zinc-500 font-medium">Precio</th>
                            <th className="text-left px-4 py-3 text-zinc-500 font-medium">KM</th>
                            <th className="text-left px-4 py-3 text-zinc-500 font-medium">Estado</th>
                            <th className="text-right px-4 py-3 text-zinc-500 font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((vehicle) => (
                            <tr
                                key={vehicle.id}
                                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                            >
                                <td className="px-4 py-3">
                                    <p className="text-zinc-100 font-medium">{vehicle.title}</p>
                                    <p className="text-zinc-500 text-xs capitalize">
                                        {vehicle.fuelType} · {vehicle.transmission}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-zinc-300">{vehicle.year}</td>
                                <td className="px-4 py-3 text-zinc-300">
                                    {vehicle.currency ?? 'USD'} {vehicle.price.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-zinc-300">
                                    {vehicle.km.toLocaleString()} km
                                </td>
                                <td className="px-4 py-3">
                                    {vehicle.isSold ? (
                                        <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                                            Vendido
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-emerald-900/50 text-emerald-400 border-emerald-800">
                                            Disponible
                                        </Badge>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <VehicleActions id={vehicle.id} isSold={vehicle.isSold} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}