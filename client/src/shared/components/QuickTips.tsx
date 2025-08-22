import { useState, useEffect } from "react";
import { Shield, Key, FileText, AlertCircle, Lock } from "lucide-react";

export default function RotatingTips() {
  const tips = [
    {
      quote: "Security is a process, not a product.",
      meaning: "La seguridad no depende únicamente de herramientas o productos, sino de procesos continuos que incluyen monitoreo, revisión y actualización de políticas y sistemas.",
      icon: Shield,
      author: "Bruce Schneier"
    },
    {
      quote: "The only secure computer is one that's unplugged, locked in a safe, and buried 20 feet underground.",
      meaning: "Esto resalta la importancia de la gestión de riesgos: ninguna máquina conectada a una red está completamente segura, por eso se deben implementar controles y restricciones efectivas.",
      icon: Key,
      author: "Dennis Hughes"
    },
    {
      quote: "Assume breach.",
      meaning: "Siempre se debe asumir que un sistema puede ser vulnerado. Diseña la seguridad de manera que incluso si ocurre un incidente, el daño se minimice y la recuperación sea rápida.",
      icon: FileText,
      author: "Scott Guthrie"
    },
    {
      quote: "Passwords are like underwear: don’t let people see it, change it often, and keep it private.",
      meaning: "Un recordatorio de buenas prácticas: las contraseñas deben ser únicas, privadas y cambiadas regularmente para reducir el riesgo de accesos no autorizados.",
      icon: AlertCircle,
      author: "Chris Pirillo"
    },
    {
      quote: "Principle of least privilege.",
      meaning: "Los usuarios y servicios solo deben tener los permisos estrictamente necesarios para su funcionamiento, evitando así la propagación de daños en caso de compromisos.",
      icon: Lock,
      author: "Clifford Stoll"
    },
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const CurrentIcon = tips[currentTip].icon;

  return (
    <div className="flex justify-center">
      <div className="bg-blue-100 p-8 rounded-2xl shadow-lg max-w-3xl text-center transition-all duration-500">
        <CurrentIcon size={60} className="text-blue-700 mb-4 mx-auto" />
        <h3 className="text-2xl font-bold text-blue-700 mb-4">Consejo de seguridad</h3>
        <p className="text-lg text-gray-800 mb-2"><strong>"{tips[currentTip].quote}"</strong></p>
        <p className="text-base text-gray-700 mb-2">{tips[currentTip].meaning}</p>
        <p className="text-sm text-gray-600 italic">— {tips[currentTip].author}</p>
      </div>
    </div>
  );
}
