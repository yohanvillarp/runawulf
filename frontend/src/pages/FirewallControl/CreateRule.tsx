import Dropdown from "../../components/Dropdown";
import Title from "../../components/Title";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import PortServicePanel from "../../components/FirewallControl/PortServicePanel";
import { DIRECTIONS, ACTIONS, SELECT_TYPES, PROTOCOLS } from "../../constants/ruleOptions";

export default function CreateRule() {
  const [rule, setRule] = useState({
    direction: "Entrada",
    action: "Permitir",
    from: "",
    to: "",
    type: "Servicio",
    service: "",
    port: 0,
    protocol: "Todos",
  });
  const getProtocolOptions = () => {
    const usingPortOrService = (
      (rule.type === "Puerto" && rule.port > 0) ||
      (rule.type === "Servicio" && rule.service.trim() !== "")
    );

    // Si ya se está usando puerto o servicio, no permitir "Todos"
    return usingPortOrService
      ? ["Auto", "TCP", "UDP"]
      : PROTOCOLS;
  };

  const [interfaces, setInterfaces] = useState([""]);

  const ip = localStorage.getItem('ipServer');

  useEffect(() => {
    const fetchInterfaces = async () => {
      try {
        const res = await fetch(`http://${ip}:4000/api/system/get?thing=interfaces`);
        if (!res.ok) throw new Error("Error obteniendo interfaces");

        const json = await res.json();
        setInterfaces([...json.data, "todas las interfaces"]);
      } catch (err) {
        console.error("Error al obtener interfaces:", err);
      }
    };

    fetchInterfaces();
  }, [ip]);

  const getFinalValue = () => {
    return rule.type === "Puerto" ? rule.port : rule.service;
  };

  const handleSubmit = async () => {
    // Validaciones previas
    if (
      rule.protocol === "Auto" &&
      (
        (rule.type === "Puerto" && (!rule.port || rule.port <= 0)) ||
        (rule.type === "Servicio" && !rule.service.trim())
      )
    ) {
      Swal.fire({
        icon: "warning",
        title: "Falta información",
        text: "Debes especificar un puerto o servicio si seleccionas protocolo 'Auto'.",
        confirmButtonText: "Entendido",
        customClass: {
          confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700',
        }
      });
      return;
    }

    try {
      const res = await fetch(`http://${ip}:4000/api/system/create/thing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thing: "iptables_rules",
          params: [
            rule.direction.toLowerCase(),
            getFinalValue(),
            rule.from,
            rule.to,
            rule.protocol.toLowerCase(),
            rule.action.toLowerCase(),
          ],
        }),
      });

      if (!res.ok) throw new Error("Error ejecutando script");

      const data = await res.json();
      console.log(data);
      if (data.status === "duplicated") {
        Swal.fire({
          title: `Regla duplicada`,
          text: `La regla que intentaste agregar ya existe.`,
          icon: 'warning',
          confirmButtonText: 'Entendido',
          customClass: {
            confirmButton: 'bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700',
          }
        });
      } else if (data.status === "ok") {
        Swal.fire({
          title: `Regla aplicada correctamente`,
          text: `La regla ${data.output} se ejecutó sin problemas.`,
          icon: 'success',
          confirmButtonText: 'Entendido',
          customClass: {
            confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700',
          }
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonText: 'Cerrar',
        customClass: {
          confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700',
        }
      });
    }
  };


  useEffect(() => {
    const usingPortOrService = (
      (rule.type === "Puerto" && rule.port > 0) ||
      (rule.type === "Servicio" && rule.service.trim() !== "")
    );

    if (usingPortOrService && rule.protocol === "Todos") {
      setRule(prev => ({ ...prev, protocol: "Auto" }));
    }
  }, [rule.port, rule.service, rule.type, rule.protocol]);


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title>
        Crear regla
      </Title>

      {/* Panel de acción y dirección */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-6">

          <div className="w-full">
            <label className="block mb-2 text-base font-semibold text-gray-700">
              Acción de la regla
            </label>
            <Dropdown
              backgroundColor="bg-red-700"
              options={ACTIONS}
              value={rule.action}
              onChange={(value) => setRule({ ...rule, action: value })}
            />
            <p className="text-sm text-gray-500 mt-1">
              <strong>Permitir:</strong> permite el tráfico. <br />
              <strong>Denegar:</strong> bloquea sin responder. <br />
              <strong>Rechazar:</strong> bloquea y responde al emisor.
            </p>
          </div>

          <div className="w-full">
            <label className="block mb-2 text-base font-semibold text-gray-700">
              Dirección de la regla
            </label>
            <Dropdown
              backgroundColor="bg-blue-700"
              options={DIRECTIONS}
              value={rule.direction}
              onChange={(value) => {
                setRule({
                  ...rule,
                  direction: value,
                  from: "",
                  to: "",
                });
              }}
            />
            <p className="text-sm text-gray-500 mt-1">
              <strong>Entrada:</strong> tráfico que llega al servidor. <br />
              <strong>Salida:</strong> tráfico que sale del servidor.
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Panel de Direcciones */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Direcciones</h3>

          <p className="text-sm text-gray-600 mb-4">
            Define el origen y destino del tráfico de red.
            {rule.direction === "Entrada" ? (
              <>
                {" "}
                Si la regla es de <strong>entrada</strong>, el <strong>origen</strong> corresponde a una dirección IP remota
                , y el <strong>destino</strong> es una interfaz local.
              </>
            ) : (
              <>
                {" "}
                Si la regla es de <strong>salida</strong>, el <strong>origen</strong> será la interfaz local
                , y el <strong>destino</strong> es la dirección IP remota.
              </>
            )}
          </p>

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

        {/* Panel de Puerto o Servicio */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Puerto o Servicio</h3>

          <label className="block">Tipo de selector</label>
          <Dropdown
            backgroundColor="bg-purple-700"
            options={SELECT_TYPES}
            value={rule.type}
            onChange={(value) => setRule({ ...rule, type: value })}
          />

          <label className="mt-4 block">Protocolo</label>
          <Dropdown
            backgroundColor="bg-indigo-700"
            options={getProtocolOptions()}
            value={rule.protocol}
            onChange={(value) => setRule({ ...rule, protocol: value })}
          />
          {rule.protocol === "Auto" && (
            <p className="text-sm text-gray-500 mt-1">
              El protocolo se detectará automáticamente según el puerto o servicio.
            </p>
          )}

          <label className="mt-4 block">{rule.type === "Puerto" ? "Puerto" : "Servicio"}</label>
          <PortServicePanel
            type={rule.type as "Puerto" | "Servicio"}
            port={rule.port}
            service={rule.service}
            onChange={(field, value) => setRule({ ...rule, [field]: value })}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-xl p-6 border border-gray-300 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Regla generada</h2>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-gray-100 rounded-lg px-4 py-3 border border-gray-300 gap-4">
          <code className="text-sm text-gray-800 font-mono">
            {rule.action === "Permitir" && "Permitir el tráfico "}
            {rule.action === "Denegar" && "Denegar el tráfico "}
            {rule.action === "Rechazar" && "Rechazar el tráfico "}
            {rule.direction && `de ${rule.direction.toLowerCase()} `}
            {rule.from && `desde la dirección IP ${rule.from} `}
            {rule.to &&
              `hacia ${rule.to === "todas las interfaces"
                ? "todas las interfaces de red"
                : `la interfaz ${rule.to}`
              } `}
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

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
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