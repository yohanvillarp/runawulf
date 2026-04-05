import Swal from "sweetalert2";
import type { FirewallFormRule } from "../types/FirewallFormRule";

export const useCreateRule = (ip: string | null, rule : FirewallFormRule) => {
  const getFinalValue = () => {
    return rule.type === "Puerto" ? rule.port : rule.service;
  };

  const handleSubmit = async () => {
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
          confirmButton: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700",
        },
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
      if (data.status === "duplicated") {
        Swal.fire({
          title: "Regla duplicada",
          text: "La regla que intentaste agregar ya existe.",
          icon: "warning",
          confirmButtonText: "Entendido",
          customClass: {
            confirmButton: "bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700",
          },
        });
      } else if (data.status === "ok") {
        Swal.fire({
          title: "Regla aplicada correctamente",
          text: `La regla ${data.output} se ejecutó sin problemas.`,
          icon: "success",
          confirmButtonText: "Entendido",
          customClass: {
            confirmButton: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700",
          },
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonText: "Cerrar",
        customClass: {
          confirmButton: "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700",
        },
      });
    }
  };

  return handleSubmit;
};
