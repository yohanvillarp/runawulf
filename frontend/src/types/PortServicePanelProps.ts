export type PortServicePanelProps = {
  type: "Puerto" | "Servicio";
  port: number;
  service: string;
  onChange: (field: "port" | "service", value: string | number) => void;
}