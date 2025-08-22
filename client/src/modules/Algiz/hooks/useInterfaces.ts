import { useState, useEffect } from "react";

export const useInterfaces = (ip: string | null) => {
    const [interfaces, setInterfaces] = useState<string[]>([]);

  useEffect(() => {
    if (!ip) return;
    const fetchInterfaces = async () => {
      try {
        const res = await fetch(`http://${ip}:4000/api/system/get?thing=interfaces`);
        if (!res.ok) throw new Error("Error obteniendo interfaces");
        const json = await res.json();
        setInterfaces([...json.data, "todas las interfaces"]);
      } catch (err) {
        console.error("Error al obtener interfaces:", err);
      }
    };
    fetchInterfaces();
  }, [ip]);

  return interfaces;
}