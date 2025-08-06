import Dropdown from "../../components/Dropdown";
import Title from "../../components/Title";
import { useState, useEffect } from "react";
import { useWebSocket } from "../../context/useWebSocket";
import { WEBSOCKET_MESSAGE_TYPES } from "../../constants/webSocketTypes";
import Swal from 'sweetalert2';

export default function CreateRule() {
  const [rule, setRule] = useState({
    direction: "Entrada",
    action: "Permitir",
    from: "",
    to: "",
    type: "Servicio", // Nuevo selector: Puerto o Servicio
    service: "ssh",
    port: 80,
  });
  const { socket, lastMessage } = useWebSocket();

  const [interfaces, setInterfaces] = useState([""]); // valor por defecto opcional

  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === WEBSOCKET_MESSAGE_TYPES.SCRIPT_RESULT) {
      if (lastMessage.script === "get_things.sh") {
        const lines = (lastMessage.output as string).trim().split('\n');
        setInterfaces([...lines, "Todas las interfaces"]);
      } else if (lastMessage.script === "iptables_rules.sh") {
        Swal.fire({
          title: `${lastMessage.type}`,
          text: `${lastMessage.output}`,
          icon: 'info',
          confirmButtonText: 'Confirmado',
          customClass: {
            confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700',
          }
        });
      }
    }

    if (lastMessage.type === WEBSOCKET_MESSAGE_TYPES.SCRIPT_ERROR) {
      alert("Error: " + String(lastMessage.output));
    }
  }, [lastMessage]);


  useEffect(() => {
    if (!socket) return;

    socket.send(JSON.stringify({
      type: "exec-script",
      payload: {
        script: "get_things", // asegúrate que el nombre sea correcto
        params: ["interfaces"]
      }
    }));
  }, [socket]);

  const renderPortOrService = () => {
    if (rule.type === "Puerto") {
      return (
        <input
          type="number"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 mt-2"
          placeholder="Ej: 80"
          value={rule.port}
          onChange={(e) => setRule({ ...rule, port: parseInt(e.target.value) })}
        />
      );
    } else {
      return (
        <input
          type="text"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 mt-2"
          placeholder="Ej: ssh, http"
          value={rule.service}
          onChange={(e) => setRule({ ...rule, service: e.target.value })}
        />
      );
    }
  };

  const getFinalValue = () => {
    return rule.type === "Puerto" ? rule.port : rule.service;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sección de origen y destino */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-4">Direcciones</h3>

            <label>{rule.direction === "Salida" ? "Origen (interfaz local)" : "Origen (IP remota)"}</label>
            {rule.direction === "Salida" ? (
              <Dropdown
                backgroundColor="bg-green-700"
                options={interfaces}
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
                options={interfaces}
                value={rule.to}
                onChange={(value) => setRule({ ...rule, to: value })}
              />

            )}
          </div>

          {/* Sección de puerto o servicio */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-4">Puerto o Servicio</h3>

            <label className="block">Tipo de selector</label>
            <Dropdown
              backgroundColor="bg-purple-700"
              options={["Puerto", "Servicio"]}
              value={rule.type}
              onChange={(value) => setRule({ ...rule, type: value })}
            />

            <label className="mt-4 block">{rule.type === "Puerto" ? "Puerto" : "Servicio"}</label>
            {renderPortOrService()}
          </div>
        </div>
      </div>


      <div className="bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-xl p-6 border border-gray-300 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Regla generada</h2>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-gray-100 rounded-lg px-4 py-3 border border-gray-300 gap-4">
          <code className="text-sm text-gray-800 font-mono">
            {rule.action.toLowerCase()} {rule.direction.toLowerCase()} de {rule.from} a {rule.to} usando {getFinalValue()}
          </code>

          <div className="flex gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(`${rule.action.toLowerCase()} ${rule.direction.toLowerCase()} de ${rule.from} a ${rule.to} usando ${getFinalValue()}`)}
              className="text-sm text-blue-600 font-semibold hover:underline"
            >
              Copiar
            </button>

            <button
              onClick={() => {
                if (!socket) {
                  alert("⚠️ No estás conectado al servidor WebSocket.");
                  return;
                }
                socket.send(JSON.stringify({
                  type: "exec-script",
                  payload: {
                    script: "iptables_rules",
                    params: [
                      rule.direction.toLowerCase(),
                      getFinalValue(),
                      rule.from,
                      rule.to,
                      rule.action.toLowerCase(),
                    ],
                  },
                }));
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Ejecutar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}