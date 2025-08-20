import { Bell, Eye, PencilRuler } from "lucide-react";
import { ThreeCardPanel } from "../components/ThreeCardPanel";
import Title from "../components/Title";

export default function IntrusionDetection() {
  const cards = [
    {
      title: "Forjar alerta",
      icon: PencilRuler,
      to: "/intrusion-detection/crear-alerta",
      description:
        "Diseña alertas personalizadas para vigilar patrones sospechosos y reforzar las defensas.",
      bgColor: "bg-gradient-to-br from-white to-gray-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Ojos del Guardián",
      icon: Eye,
      to: "/intrusion-detection/guardian-eyes",
      description:
        "El núcleo de la vigilancia: observa en tiempo real los flujos y reglas que sostienen la red.",
      bgColor: "bg-gradient-to-br from-white to-gray-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Ecos de intrusión",
      icon: Bell,
      to: "/intrusion-detection/notificaciones",
      description:
        "Consulta los registros y notificaciones emitidos por el sistema ante eventos críticos.",
      bgColor: "bg-gradient-to-br from-white to-gray-50",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="p-12 space-y-16 min-h-screen">
      {/* Encabezado */}
      <div className="text-center space-y-3">
        <Title>ᛇ Eiwaz – Detección de Intrusos</Title>
      </div>

      {/* Panel de 3 cards */}
      <div className="max-w-6xl mx-auto">
        <ThreeCardPanel cards={cards} />
      </div>
    </div>
  );
}
