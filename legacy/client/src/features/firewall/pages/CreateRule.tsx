import Title from "../../../shared/components/Title";
import { useState } from "react";
import { PROTOCOLS } from "../../../shared/constants/ruleOptions";
import { useInterfaces } from "../hooks/useInterfaces";
import { useCreateRule } from "../hooks/useCreateRule";
import type { FirewallFormRule } from "../types/FirewallFormRule";
import RuleActionDirectionPanel from "../components/RuleActionDirectionPanel";
import RuleAddressPanel from "../components/RuleAddressPanel";
import RulePortServicePanel from "../components/RulePortServicePanel";
import RulePreviewPanel from "../components/RulePreviewPanel";

export default function CreateRule() {
  const [rule, setRule] = useState<FirewallFormRule>({
    direction: "Entrada",
    action: "Permitir",
    from: "",
    to: "",
    type: "Servicio",
    service: "",
    port: 0,
    protocol: "Todos",
  });
  const ip = localStorage.getItem('ipServer');
  const interfaces = useInterfaces(ip);
  const handleSubmit = useCreateRule(ip, rule);

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title>
        Crear regla
      </Title>

      {/* Panel de acción y dirección */}
      <RuleActionDirectionPanel
        action={rule.action}
        direction={rule.direction}
        onChange={(field, value) => {
          if (field === "direction") {
            setRule({
              ...rule,
              direction: value as FirewallFormRule["direction"],
              from: "",
              to: "",
            })
          } else if (field === "action") {
            setRule({
              ...rule,
              action: value as FirewallFormRule["action"],
            });
          } else {
            setRule({ ...rule, [field]: value });
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Panel de Direcciones */}
        <RuleAddressPanel
          direction={rule.direction}
          from={rule.from}
          to={rule.to}
          interfaces={interfaces}
          onChange={(field, value) => setRule({ ...rule, [field]: value })}
        />

        {/* Panel de Puerto o Servicio */}
        <RulePortServicePanel
          type={rule.type}
          port={rule.port}
          service={rule.service}
          protocol={rule.protocol}
          getProtocolOptions={() => getProtocolOptions()}
          onChange={(field, value) => {
            let updatedRule = { ...rule, [field]: value };
            // Si el usuario empieza a escribir puerto o servicio => protocolo Auto inmediato
            if (
              (field === "port" && value !== 0) ||
              (field === "service" && String(value).trim() !== "")
            ) {
              updatedRule.protocol = "Auto";
            } else {
              // Si no hay puerto ni servicio, permitir "Todos"
              const protocols = getProtocolOptions();
              if (!protocols.includes(updatedRule.protocol)) {
                updatedRule.protocol = "Todos";
              }
            }
            // Reset si cambia el tipo (Puerto/Servicio)
            if (field === "type") {
              updatedRule = {
                ...updatedRule,
                port: 0,
                service: "",
                protocol: "Todos",
              };
            }

            setRule(updatedRule);
          }}
        />

      </div>

      <RulePreviewPanel
        rule={rule}
        onSubmit={handleSubmit}
      />
    </div>
  );
}