import Dropdown from "../../components/Dropdown";
import Title from "../../components/Title";
import { useState } from "react";

export default function CreateRule() {
  const [rule, setRule] = useState({
    direction: "Entrada",
    action: "Permitir"
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
        <h2 className="text-lg font-bold text-gray-800 mb-4">Regla generada</h2>
        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3 border border-gray-300">
          <code className="text-sm text-gray-800 font-mono">
            ufw {rule.direction.toLowerCase()} {rule.action.toLowerCase()}
          </code>

          <button
            onClick={() => navigator.clipboard.writeText(`ufw ${rule.direction.toLowerCase()} ${rule.action.toLowerCase()}`)}
            className="text-sm text-blue-600 font-semibold hover:underline ml-4"
          >
            Copiar
          </button>
          
        </div>
      </div>

    </div>
  );
}