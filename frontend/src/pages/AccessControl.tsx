import { ModuleCard } from "../components/ModuleCard"
import { Monitor, UserCheck, UserPlus, UserX, Users } from 'lucide-react'

export default function AccessControl() {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold text-gray-900">Control de acceso</h1>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">
                    Configuraciones
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <ModuleCard title="Conectados" icon={Monitor} to="/access-control/connected" />
                <ModuleCard title="Con acceso" icon={UserCheck} to="/access-control/with-access" />
                <ModuleCard title="Solicitudes" icon={UserPlus} to="/access-control/requests" />
                <ModuleCard title="Bloqueados" icon={UserX} to="/access-control/blocked" />
                <ModuleCard title="Visitantes" icon={Users} to="/access-control/visitors" />
            </div>
        </div>
    )
}