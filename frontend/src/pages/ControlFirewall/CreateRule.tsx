import Dropdown from "../../components/Dropdown";
import Title from "../../components/Title";
import { useState } from "react";

export default function CreateRule() {
  const [rule, setRule] = useState({
    direction: "Entrada",
    action: "Permitir",
    from: "192.168.0.1",
    to: "eth01"
  });

  return (
    <div className="p-6 max-w-3xl">
      <Title>
        Crear regla
      </Title>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full">
            <label className="block mb-2 text-base font-semibold text-gray-700">
              Dirección de la regla
            </label>
            <Dropdown
              backgroundColor="bg-blue-700"
              options={["Entrada", "Salida"]}
              value={rule.direction}
              onChange={(value) => setRule({ ...rule, direction: value })}
            />
          </div>

          <div className="w-full">
            <label className="block mb-2 text-base font-semibold text-gray-700">
              Acción de la regla
            </label>
            <Dropdown
              backgroundColor="bg-red-700"
              options={["Permitir", "Denegar", "Rechazar", "Limitar"]}
              value={rule.action}
              onChange={(value) => setRule({ ...rule, action: value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-xl p-6 border border-gray-300 mt-6">
        <label>{rule.direction === "Salida" ? "Origen (interfaz local)" : "Origen (IP remota)"}</label>
        {rule.direction === "Salida" ? (
          <Dropdown
            backgroundColor="bg-green-700"
            options={["eth0", "eth02", "Todas las interfaces"]}
            value={rule.from}
            onChange={(value) => setRule({ ...rule, from: value })}
          />
        ) : (
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 mt-2"
            placeholder="192.168.1.4"
            value={rule.from}
            onChange={(e) => setRule({ ...rule, from: e.target.value })}
          />
        )}

        <label className="mt-4 block">{rule.direction === "Salida" ? "Destino (IP remota)" : "Destino (interfaz local)"}</label>
        {rule.direction === "Salida" ? (
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 mt-2"
            placeholder="192.168.1.5"
            value={rule.to}
            onChange={(e) => setRule({ ...rule, to: e.target.value })}
          />
        ) : (
          <Dropdown
            backgroundColor="bg-green-700"
            options={["eth0", "eth02", "Todas las interfaces"]}
            value={rule.to}
            onChange={(value) => setRule({ ...rule, to: value })}
          />
        )}
      </div>


      <div className="bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-xl p-6 border border-gray-300 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Regla generada</h2>
        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3 border border-gray-300">
          <code className="text-sm text-gray-800 font-mono">
            {rule.action.toLowerCase()} {rule.direction.toLowerCase()} de {rule.from} a {rule.to}
          </code>

          <button
            onClick={() => navigator.clipboard.writeText(`${rule.action.toLowerCase()} ${rule.direction.toLowerCase()} `)}
            className="text-sm text-blue-600 font-semibold hover:underline ml-4"
          >
            Copiar
          </button>

        </div>
      </div>

    </div>
  );
}