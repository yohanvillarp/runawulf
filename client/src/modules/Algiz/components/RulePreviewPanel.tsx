import type { FirewallFormRule } from "../types/FirewallFormRule";

type Props = {
  rule: FirewallFormRule;
  onSubmit: () => void;
};

export default function RulePreviewPanel({ onSubmit, rule }: Props) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-xl p-6 border border-gray-300 mt-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Regla generada</h2>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-gray-100 rounded-lg px-4 py-3 border border-gray-300 gap-4">
        <code className="text-sm text-gray-800 font-mono">
          {rule.action === "Permitir" && "Permitir el tráfico "}
          {rule.action === "Denegar" && "Denegar el tráfico "}
          {rule.action === "Rechazar" && "Rechazar el tráfico "}
          {rule.direction && `de ${rule.direction.toLowerCase()} `}

          {/* Diferenciamos Entrada vs Salida */}
          {rule.direction === "Entrada" && rule.from && `desde la dirección IP ${rule.from} `}
          {rule.direction === "Entrada" && rule.to &&
            `hacia ${rule.to === "todas las interfaces"
              ? "todas las interfaces de red"
              : `la interfaz ${rule.to}`
            } `}
          
          {rule.direction === "Salida" && rule.from &&
            `desde ${rule.from === "todas las interfaces"
              ? "todas las interfaces de red"
              : `la interfaz ${rule.from}`
            } `}
          {rule.direction === "Salida" && rule.to && `hacia la dirección IP ${rule.to} `}

          {rule.type === "Puerto" && rule.port > 0 && `mediante el puerto ${rule.port} `}
          {rule.type === "Servicio" && rule.service && `mediante el servicio ${rule.service} `}
          {rule.protocol &&
            (rule.protocol.toUpperCase() === "AUTO"
              ? "(el protocolo se determinará automáticamente según el puerto o servicio)"
              : rule.protocol.toUpperCase() === "TODOS"
                ? "utilizando todos los protocolos disponibles"
                : `utilizando el protocolo ${rule.protocol.toUpperCase()}`)}
          .
        </code>
        <button
          onClick={onSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Ejecutar
        </button>
      </div>
    </div>
  );
}
