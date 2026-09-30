import { User, Wifi, Monitor, ShieldCheck, Clock, MoreVertical } from "lucide-react"

export interface ConnectedUser {
  name: string
  ip: string
  mac: string
  hostname?: string
  os?: string
  lastActive?: string
  status?: "online" | "idle" | "offline"
}

export default function UserCard({ user }: { user: ConnectedUser }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow hover:shadow-md border border-gray-200 transition">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <User className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
        </div>
        <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
      </div>

      <div className="text-sm text-gray-600 space-y-1 mt-2">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-gray-400" />
          <span className="font-medium">IP:</span> {user.ip}
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gray-400" />
          <span className="font-medium">MAC:</span> {user.mac}
        </div>

        {user.hostname && (
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Equipo:</span> {user.hostname}
          </div>
        )}

        {user.os && (
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Sistema:</span> {user.os}
          </div>
        )}

        {user.lastActive && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Última actividad:</span> {user.lastActive}
          </div>
        )}

        {user.status && (
          <div className="mt-2">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full
              ${user.status === "online" ? "bg-green-100 text-green-600" :
                user.status === "idle" ? "bg-yellow-100 text-yellow-600" :
                "bg-gray-100 text-gray-500"}`}>
              {user.status === "online" ? "En línea" :
               user.status === "idle" ? "Inactivo" :
               "Desconectado"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
