import type { FirewallFormRule } from "../../types/FirewallFormRule";
import Dropdown from "../../components/Dropdown";

type Props = {
  action: FirewallFormRule["action"];
  direction: FirewallFormRule["direction"];
  onChange: (field: "action" | "direction", value: string) => void;
};

export default function RuleActionDirectionPanel({ action, direction, onChange }: Props) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Acción */}
        <div className="w-full">
          <label className="block mb-2 text-base font-semibold text-gray-700">
            Acción de la regla
          </label>
          <Dropdown
            backgroundColor="bg-red-700"
            options={["Permitir", "Denegar", "Rechazar"]}
            value={action}
            onChange={(value) => onChange("action", value)}
          />
        </div>

        {/* Dirección */}
        <div className="w-full">
          <label className="block mb-2 text-base font-semibold text-gray-700">
            Dirección de la regla
          </label>
          <Dropdown
            backgroundColor="bg-blue-700"
            options={["Entrada", "Salida"]}
            value={direction}
            onChange={(value) => onChange("direction", value)}
          />
        </div>
      </div>
    </div>
  );
}
