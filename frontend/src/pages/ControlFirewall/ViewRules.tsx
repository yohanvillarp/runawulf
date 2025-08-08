import { useEffect, useState } from "react";
import RulesTable, { type Rule as TableRule } from "../../components/ControlFirewall/RulesTable";
import { useWebSocket } from "../../context/useWebSocket";
import { WEBSOCKET_MESSAGE_TYPES } from "../../constants/webSocketTypes";


type ScriptRulesResponse = {
  INPUT?: { num: string | number; description: string }[];
  OUTPUT?: { num: string | number; description: string }[];
};

export default function ViewRules() {
  const { socket, lastMessage } = useWebSocket();

  const [rulesInput, setRulesInput] = useState<TableRule[]>([]);
  const [rulesOutput, setRulesOutput] = useState<TableRule[]>([]);

  const handleDelete = (id: string, chain: "INPUT" | "OUTPUT") => {
    if (chain === "INPUT") {
      setRulesInput(prev => prev.filter(r => r.id !== id));
    } else {
      setRulesOutput(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleMove = (fromIndex: number, toIndex: number, chain: "INPUT" | "OUTPUT") => {
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
        script: "get_iptables_rules",
      }
    }));
  }, [socket]);

  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === WEBSOCKET_MESSAGE_TYPES.SCRIPT_RESULT &&
        lastMessage.script === "get_iptables_rules.sh") {
      try {
        const data: ScriptRulesResponse = JSON.parse(lastMessage.output as string);

        const makeRule = (num: string | number, description: string): TableRule => ({
          id: crypto.randomUUID(),
          num: String(num),
          description,
          active: true,
          createdAt: new Date(),
        });

        setRulesInput((data.INPUT ?? []).map(r => makeRule(r.num, r.description)));
        setRulesOutput((data.OUTPUT ?? []).map(r => makeRule(r.num, r.description)));

      } catch (error) {
        console.error("Error parsing iptables rules JSON", error);
      }
    }
  }, [lastMessage]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        Ver reglas de iptables
      </h1>
      <p className="mb-8 text-gray-700">
        Las reglas iptables se aplican en orden numérico. Aquí están separadas por tipo de cadena.
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
