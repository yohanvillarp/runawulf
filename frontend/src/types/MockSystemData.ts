export type MockSystemData = {
  cargaPromedio: {
    '1min': number;
    '5min': number;
    '15min': number;
  };
  cpuUsado: number;
  datosEnviadosMB: number;
  datosRecibidosMB: number;
  discoTotal: number;
  discoUsado: number;
  ipPrivada: string;
  ipPublica: string;
  latenciaMs: number;
  nombreMaquina: string;
  numeroProcesos: number;
  procesosMasUsados: {
    nombre: string;
    usoCpu: number;
  }[];
  ramTotal: number;
  ramUsado: number;
  servicios: string[];
  sistemaOperativo: string;
  tiempoPrendido: string;
  usuariosConectados: number;
};
