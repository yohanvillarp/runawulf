export interface FirewallFormRule {
  direction: "Entrada" | "Salida";
  action: "Permitir" | "Denegar" | "Rechazar";
  from: string;
  to: string;
  type: "Puerto" | "Servicio";
  service: string;
  port: number;
  protocol: string; // "Todos" | "Auto" | "TCP" | "UDP"
}
