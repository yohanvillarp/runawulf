import { ModuleCard } from "../components/ModuleCard"
import { PencilRuler, ScanEye, History } from 'lucide-react'
import Title from "../components/Title"

export default function AccessControl() {
  return (
    <div className="p-6">
      <Title>
        Control de Firewall
      </Title>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <ModuleCard
          title="Crear reglas"
          icon={PencilRuler}
          to="/firewall-control/create-rule"
          description="Define nuevas reglas para controlar el tráfico de red entrante y saliente."
        />

        <ModuleCard
          title="Visualizar reglas"
          icon={ScanEye}
          to="/firewall-control/view-rules"
          description="Consulta todas las reglas activas aplicadas al servidor."
        />

        <ModuleCard
          title="Historial de cambios"
          icon={History}
          to="/firewall-control/rule-history"
          description="Revisa las modificaciones realizadas en las reglas de acceso a lo largo del tiempo."
        />

      </div>
    </div>
  )
}
