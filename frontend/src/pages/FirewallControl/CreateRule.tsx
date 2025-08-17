import Title from "../../components/Title";
import { useState } from "react";
import { PROTOCOLS } from "../../constants/ruleOptions";
import { useInterfaces } from "../../hooks/FirewallControl/useInterfaces";
import { useCreateRule } from "../../hooks/FirewallControl/useCreateRule";
import type { FirewallFormRule } from "../../types/FirewallFormRule";
import RuleActionDirectionPanel from "../../components/FirewallControl/RuleActionDirectionPanel";
import RuleAddressPanel from "../../components/FirewallControl/RuleAddressPanel";
import RulePortServicePanel from "../../components/FirewallControl/RulePortServicePanel";
import RulePreviewPanel from "../../components/FirewallControl/RulePreviewPanel";

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
          if(field === "direction"){
            setRule({
              ...rule,
              direction: value as FirewallFormRule["direction"],
              from: "",
              to: "",
            })
          }else if (field === "action"){
            setRule({
              ...rule,
              action: value as FirewallFormRule["action"],
            });
          }else {
            setRule({ ...rule, [field]: value});
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
            if(field === "type"){
              setRule({
                ...rule,
                port: 0,
                service: "",
                protocol: "Todos",
              })
            }else {
              setRule({ ...rule, [field]: value })}
            }
          }
            
        />
      </div>

      <RulePreviewPanel
        rule={rule}
        onSubmit={handleSubmit}
      />
    </div>
  );
}