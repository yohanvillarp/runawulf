import { PencilRuler, ScanEye, History } from "lucide-react";
import Title from "../components/Title";
import { ThreeCardPanel } from "../components/ThreeCardPanel";
import QuickTips from "../components/QuickTips";

export default function AccessControl() {
  const cards = [
    {
      title: "Crear reglas",
      icon: PencilRuler,
      to: "/firewall-control/create-rule",
      description: "Define nuevas reglas para controlar el tráfico de red entrante y saliente.",
      bgColor: "bg-white",
      iconColor: "text-blue-600"
    },
    {
      title: "Visualizar reglas",
      icon: ScanEye,
      to: "/firewall-control/view-rules",
      description: "Consulta todas las reglas activas aplicadas al servidor.",
      bgColor: "bg-white",
      iconColor: "text-green-600"
    },
    {
      title: "Historial de cambios",
      icon: History,
      to: "/firewall-control/rule-history",
      description: "Revisa las modificaciones realizadas en las reglas de acceso a lo largo del tiempo.",
      bgColor: "bg-white",
      iconColor: "text-purple-600"
    },
  ];

  return (
    <div className="p-12 space-y-16 bg-gray-50 min-h-screen">
      {/* Título principal */}
      <div className="text-center space-y-4">
        <Title>Control de Firewall</Title>
      </div>

      {/* Panel de 3 cards */}
      <div className="max-w-6xl mx-auto">
        <ThreeCardPanel cards={cards} />
      </div>

      {/* Sección de consejos */}
      <div className="max-w-3xl mx-auto">
        <QuickTips />
      </div>
    </div>
  );
}
