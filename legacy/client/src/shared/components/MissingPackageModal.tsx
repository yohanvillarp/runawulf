import { useState } from "react"
import { AlertTriangle, Terminal } from "lucide-react"

type MissingPackageModalProps = {
  packageName: string
  onInstall: (pkg: string) => void
  onCancel: () => void
}

export default function MissingPackageModal({ packageName, onInstall, onCancel }: MissingPackageModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleInstall = () => {
    setIsLoading(true)
    onInstall(packageName)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md text-center relative">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-yellow-500 w-10 h-10" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Falta un paquete necesario</h2>
        <p className="text-gray-600 mb-4">
          El sistema detectó que <span className="font-semibold text-red-600">{packageName}</span> no está instalado.
        </p>
        <div className="bg-gray-100 p-3 rounded text-sm text-gray-800 mb-4 flex items-center justify-center gap-2">
          <Terminal className="w-4 h-4 text-gray-500" />
          <code className="font-mono">sudo apt install {packageName}</code>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleInstall}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? "Instalando..." : "Instalar"}
          </button>
        </div>
      </div>
    </div>
  )
}
