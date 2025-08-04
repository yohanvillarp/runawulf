import { useEffect, useState } from "react"
import { useWebSocket } from "../../context/useWebSocket"
import UserCard from "../../components/UserCard"
import type { ConnectedUser } from "../../components/UserCard"

export default function Connected() {
  const { socket } = useWebSocket()
  const [users, setUsers] = useState<ConnectedUser[]>([])

  useEffect(() => {
    if (!socket) return

    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data !== "string" || !event.data.startsWith("{")) {
          console.warn("⚠️ Mensaje no JSON recibido:", event.data)
          return
        }

        const data = JSON.parse(event.data)

        if (data.type === "script-result" && typeof data.output === "string") {
          try {
            const parsed = JSON.parse(data.output)
            if (Array.isArray(parsed)) {
              setUsers(parsed)
              console.log("👥 Usuarios recibidos desde script:", parsed)
            }
          } catch (e) {
            console.error("❌ La salida del script no es JSON válido:", data.output)
            console.error(e);
          }
        }

      } catch (err) {
        console.error("❌ Error parsing socket message", err)
      }
    }

    const tryRequestUsers = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "exec-script",
          payload: {
            script: "get_user_connected_info" // nombre exacto del script en la carpeta /scripts
          }
        }))

        console.log("📡 Enviado: exec-script")
        socket.onmessage = handleMessage
        return true
      }
      return false
    }

    if (!tryRequestUsers()) {
      const interval = setInterval(() => {
        if (tryRequestUsers()) clearInterval(interval)
      }, 100)

      return () => {
        clearInterval(interval)
        socket.onmessage = null
      }
    }

    return () => {
      socket.onmessage = null
    }
  }, [socket])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios conectados</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u, i) => <UserCard key={i} user={u} />)}
      </div>
    </div>
  )
}
