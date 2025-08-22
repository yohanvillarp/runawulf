import { useEffect, useState } from "react";
import RulesTable, { type Rule as TableRule } from "../components/RulesTable";
import { useWebSocket } from "../../../context/useWebSocket";
import { WEBSOCKET_MESSAGE_TYPES } from "../../../shared/constants/webSocketTypes";
import Swal from 'sweetalert2';

type BackendRule = {
  num: string | number;
  direction: "Entrada" | "Salida";
  action: "Permitir" | "Denegar" | "Rechazar";
  from: string;
  to: string;
  type: "Puerto" | "Servicio";
  port?: number | null;
  service?: string;
  protocol: string;
  active: boolean;
};


export default function ViewRules() {
  const { socket, lastMessage } = useWebSocket();
  const ip = localStorage.getItem('ipServer');

  const [rulesInput, setRulesInput] = useState<TableRule[]>([]);

  const [rulesOutput, setRulesOutput] = useState<TableRule[]>([]);

  const script = "get/get_iptables_rules.sh";

  const handleDelete = async (id: string, chain: "INPUT" | "OUTPUT") => {
    // Encuentra la regla que se va a eliminar
    const ruleToDelete = (chain === "INPUT" ? rulesInput : rulesOutput).find(r => r.id === id);
    if (!ruleToDelete) return;

    try {
      // Llamada al backend para eliminar la regla
      const res = await fetch(`http://${ip}:4000/api/system/delete/thing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thing: "iptables_rules",
          params: [chain, ruleToDelete.num], // pasar cadena y número de regla
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error eliminando regla");
      }

      const data = await res.json();
      console.log("Regla eliminada:", data.output);

      // Actualizar estado local
      if (chain === "INPUT") {
        setRulesInput(prev => prev.filter(r => r.id !== id));
      } else {
        setRulesOutput(prev => prev.filter(r => r.id !== id));
      }

    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) {
        message = error.message;
      }
      console.error("Error eliminando regla:", message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo eliminar la regla: ${message}`,
      });
    }
  };


  const handleMove = async (fromIndex: number, toIndex: number, chain: "INPUT" | "OUTPUT") => {
    try {
      const res = await fetch(`http://${ip}:4000/api/system/update/thing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thing: "move_iptables_rules",
          params: [chain, (fromIndex+1), (toIndex+1)], // pasar cadena y números de regla
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error moviendo regla");
      }

      const data = await res.json();
      console.log("Regla movida:", data.output);

      // Actualiza estado local
      const moveItem = (arr: TableRule[]) => {
        const copy = [...arr];
        const [moved] = copy.splice(fromIndex, 1);
        copy.splice(toIndex, 0, moved);
        return copy;
      };

      if (chain === "INPUT") {
        setRulesInput(prev => moveItem(prev));
      } else {
        setRulesOutput(prev => moveItem(prev));
      }

    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) {
        message = error.message;
      }
      console.error("Error actualizando regla:", message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo actualizar la regla: ${message}`,
      });
    }
  };

  const handleToggleActive = (id: string, active: boolean, chain: "INPUT" | "OUTPUT") => {
    const toggle = (arr: TableRule[]) =>
      arr.map(r => (r.id === id ? { ...r, active } : r));

    if (chain === "INPUT") {
      setRulesInput(prev => toggle(prev));
    } else {
      setRulesOutput(prev => toggle(prev));
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.send(JSON.stringify({
      type: "exec-script",
      payload: {
        script: script,
      }
    }));
  }, [socket]);

  useEffect(() => {
    if (!lastMessage) return;

    if (
      lastMessage.type === WEBSOCKET_MESSAGE_TYPES.SCRIPT_RESULT &&
      lastMessage.script === script
    ) {
      try {
        // Parseamos la salida del backend
        const data: { INPUT?: BackendRule[]; OUTPUT?: BackendRule[] } =
          JSON.parse(lastMessage.output as string);

        // Mapear BackendRule -> TableRule (Rule del frontend)
        const mapRule = (r: BackendRule): TableRule => ({
          id: crypto.randomUUID(),
          num: String(r.num),
          direction: r.direction,
          action: r.action,
          from: r.from,
          to: r.to,
          port: r.port ?? undefined,
          service: r.service ?? "",
          protocol: r.protocol,
          active: r.active,
        });

        setRulesInput((data.INPUT ?? []).map(mapRule));
        setRulesOutput((data.OUTPUT ?? []).map(mapRule));

      } catch (error) {
        console.error("Error parsing iptables rules JSON", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo procesar la respuesta del servidor",
        });
      }
    }
  }, [lastMessage]);



  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        Ver reglas
      </h1>
      <p className="mb-8 text-gray-700">
        Las reglas iptables se aplican en orden numérico.
      </p>

      {/* Tabla INPUT */}
      <section className="mb-12 bg-white border border-gray-300 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Reglas de Entrada (INPUT)
        </h2>
        <RulesTable
          data={rulesInput}
          onDelete={(id) => handleDelete(id, "INPUT")}
          onMove={(from, to) => handleMove(from, to, "INPUT")}
          onToggleActive={(id, active) => handleToggleActive(id, active, "INPUT")}
        />
      </section>

      {/* Tabla OUTPUT */}
      <section className="mb-12 bg-white border border-gray-300 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          Reglas de Salida (OUTPUT)
        </h2>
        <RulesTable
          data={rulesOutput} // <-- ahora sí correcto
          onDelete={(id) => handleDelete(id, "OUTPUT")}
          onMove={(from, to) => handleMove(from, to, "OUTPUT")}
          onToggleActive={(id, active) => handleToggleActive(id, active, "OUTPUT")}
        />
      </section>
    </div>
  );
}
