// hooks/useSystemInfo.ts
import type { MockSystemData } from "../../types/MockSystemData";

export const useSystemInfo = (systemData: MockSystemData) => {
  return {
    ipPublica: systemData.ipPublica,
    ipPrivada: systemData.ipPrivada,
    nombreMaquina: systemData.nombreMaquina,
    sistemaOperativo: systemData.sistemaOperativo,
    tiempoPrendido: systemData.tiempoPrendido,
    datosRecibidosMB: systemData.datosRecibidosMB,
    datosEnviadosMB: systemData.datosEnviadosMB,
    latenciaMs: systemData.latenciaMs,
    usuariosConectados: systemData.usuariosConectados,
    cargaPromedio: systemData.cargaPromedio,
    numeroProcesos: systemData.numeroProcesos,
    procesosMasUsados: systemData.procesosMasUsados,
    servicios: systemData.servicios,
  };
};