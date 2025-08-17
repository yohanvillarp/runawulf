import type { FirewallFormRule } from "../../types/FirewallFormRule";
import PortServicePanel from "./PortServicePanel";
import Dropdown from "../../components/Dropdown";

type Props = {
  type: FirewallFormRule["type"];
  port: number;
  service: string;
  protocol: string;
  onChange: (field: keyof FirewallFormRule, value: string | number) => void;
  getProtocolOptions: () => string[];
};

export default function RulePortServicePanel({ type, port, service, protocol, onChange, getProtocolOptions }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-md font-semibold text-gray-800 mb-4">Puerto o Servicio</h3>

      <label>Tipo de selector</label>
      <Dropdown 
        backgroundColor="bg-purple-700"
        value={type} 
        options={["Puerto", "Servicio"]} 
        onChange={(v) => onChange("type", v)} />

      <label className="mt-4 block">Protocolo</label>
      <Dropdown 
        backgroundColor="bg-indigo-700"
        value={protocol} 
        options={getProtocolOptions()} 
        onChange={(v) => onChange("protocol", v)} />

      <label className="mt-4 block">{type === "Puerto" ? "Puerto" : "Servicio"}</label>
      <PortServicePanel 
        type={type} 
        port={port} 
        service={service} 
        onChange={(field, v) => onChange(field, v)} />
    </div>
  );
}
