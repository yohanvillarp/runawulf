import React from 'react';

// Define un tipo específico para los datos que necesita este componente
interface SystemInfoData {
  ipPublica: string;
  ipPrivada: string;
  nombreMaquina: string;
  sistemaOperativo: string;
  tiempoPrendido: string;
}

type Props = {
  data: SystemInfoData;
};

const DataSection: React.FC<Props> = ({ data }) => {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto mb-12 text-sky-900">
      <h2 className="text-3xl font-bold mb-6 border-b border-sky-400 pb-3">
        Datos del Servidor
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 text-xl">
        <li>
          <strong>IP Pública:</strong> {data.ipPublica}
        </li>
        <li>
          <strong>IP Privada:</strong> {data.ipPrivada}
        </li>
        <li>
          <strong>Hostname:</strong> {data.nombreMaquina}
        </li>
        <li>
          <strong>Sistema Operativo:</strong> {data.sistemaOperativo}
        </li>
        <li>
          <strong>Tiempo encendido:</strong> {data.tiempoPrendido}
        </li>
      </ul>
    </section>
  );
};

export default DataSection;