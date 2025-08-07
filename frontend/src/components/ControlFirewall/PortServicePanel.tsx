import React from "react";

interface Props {
  type: "Puerto" | "Servicio";
  port: number;
  service: string;
  onChange: (field: "port" | "service", value: string | number) => void;
}

const PortServicePanel: React.FC<Props> = ({ type, port, service, onChange }) => {
  if (type === "Puerto") {
    return (
      <input
        type="number"
        min="1"
        inputMode="numeric"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 mt-2"
        placeholder="Ej: 80"
        value={port <= 0 ? "" : port}
        onChange={(e) => {
          const value = e.target.value;
          onChange("port", value <= "" ? 0 : parseInt(value) || 0);
        }}
      />
    );
  }

  return (
    <input
      type="text"
      className="w-full rounded-lg border border-gray-300 px-4 py-2 mt-2"
      placeholder="Ej: ssh, http"
      value={service}
      onChange={(e) => onChange("service", e.target.value)}
    />
  );
};

export default PortServicePanel;
