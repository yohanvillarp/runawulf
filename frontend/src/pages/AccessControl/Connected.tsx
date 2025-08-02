import { useEffect, useState } from "react"
import { useWebSocket } from "../../context/useWebSocket"
import UserCard from "../../components/UserCard"
import type { ConnectedUser } from "../../components/UserCard"
import MissingPackageModal from "../../components/MissingPackageModal"
import { useNavigate } from "react-router-dom"



const users: ConnectedUser[] = [
  {
    name: "Carlos López",
    ip: "172.16.0.23",
    mac: "00:1A:2B:3C:4D:5E",
    hostname: "carlos-laptop",
    os: "Windows 10",
    lastActive: "hace 3 minutos",
    status: "online",
  },
  {
    name: "María Ruiz",
    ip: "172.16.0.42",
    mac: "AC:DE:48:00:11:22",
    hostname: "maria-pc",
    os: "Ubuntu 22.04",
    lastActive: "hace 20 minutos",
    status: "idle",
  },
]


export default function Connected() {
  const { socket } = useWebSocket()
  const [missingPackage, setMissingPackage] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "check-packages" }))
      console.log("📦 Enviado: check-packages")
    } else {
      // Esperar a que se abra si aún no está listo
      const interval = setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(
            { type: "check-packages",
              payload: { package: "nmap" } 
             }
          ))
          clearInterval(interval)
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [socket])


  useEffect(() => {
    if (!socket) return

    const handleMessage = (event: MessageEvent) => {
      try {
        // Si empieza con "{" asumimos que es JSON, si no lo ignoramos
        if (!event.data.startsWith("{")) {
          console.warn("⚠️ Mensaje no JSON recibido:", event.data)
          return
        }

        const data = JSON.parse(event.data)

        if (data.type === "missing-package") {
          setMissingPackage(data.package)
        }

        if (data.type === "packages-ok") {
          console.log("✅ Todos los paquetes están instalados")
        }

      } catch (err) {
        console.error("❌ Error parsing socket message", err)
      }
    }



    // Asignar handler
    socket.onmessage = handleMessage

    return () => {
      // Limpiar handler si el componente se desmonta
      socket.onmessage = null
    }
  }, [socket])

  const handleInstall = (pkg: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "install-package",
        payload: { package: pkg } 
      }))
    }
    setMissingPackage(null)
  }

  const handleCancel = () => {
      setMissingPackage(null)
      navigate("/") // o a otro módulo como "/dashboard" o "/home"

  }

  return (
    <>
      {missingPackage && (
        <MissingPackageModal
          packageName={missingPackage}
          onInstall={handleInstall}
          onCancel={handleCancel}
        />
      )}

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Usuarios conectados</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u, i) => <UserCard key={i} user={u} />)}
        </div>
      </div>
    </>
  )
}
