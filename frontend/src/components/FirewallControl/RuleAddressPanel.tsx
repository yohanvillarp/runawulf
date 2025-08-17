import Dropdown from "../../components/Dropdown";
import type { FirewallFormRule } from "../../types/FirewallFormRule";

type Props = {
  direction: FirewallFormRule["direction"];
  from: string;
  to: string;
  interfaces: string[];
  onChange: (field: "from" | "to", value: string) => void;
};

export default function RuleAddressPanel({ direction, from, to, interfaces, onChange }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-md font-semibold text-gray-800 mb-4">Direcciones</h3>

      <label>{direction === "Salida" ? "Origen (interfaz local)" : "Origen (IP remota)"}</label>
      {direction === "Salida" ? (
        <Dropdown
          backgroundColor="bg-green-700" 
          options={interfaces} 
          value={from} 
          onChange={(v) => onChange("from", v)} />
      ) : (
        <input
          type="text"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 mt-2"
          placeholder="192.168.1.4"
          value={from}
          onChange={(e) => onChange("from", e.target.value)}
        />
      )}

      <label className="mt-4 block">{direction === "Salida" ? "Destino (IP remota)" : "Destino (interfaz local)"}</label>
      {direction === "Salida" ? (
        <input 
        type="text"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 mt-2"
        placeholder="192.168.1.4"
        value={to} 
        onChange={(e) => onChange("to", e.target.value)} />
      ) : (
        <Dropdown 
        backgroundColor="bg-green-700"
        options={interfaces} 
        value={to} 
        onChange={(v) => onChange("to", v)} />
      )}
    </div>
  );
}
