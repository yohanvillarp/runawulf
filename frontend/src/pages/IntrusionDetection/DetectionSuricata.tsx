

import AlertCard from "../../components/IdsSuricata/AlertCard";

const DetectionSuricata = () => {
    //ejemplos de alertas
    const alertas = [
        {
            title: "ALERTA Suricata ",
            description: " Nmap Scan Detectado",
            sourceIp: "10.32.146.118",
            destIp: "162.159.135.233",
            timestamp: "2025-08-18T20:01:44.245590-0500",
        },
        {
            title: " ALERTA Suricata ",
            description: " ICMP Ping Detectado",
            sourceIp: "192.168.1.20",
            destIp: "8.8.8.8",
            timestamp: "2025-08-18T21:10:12.120Z",
        },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Alertas de Suricata</h2>
            <div className="grid grid-cols-1 ">
                {alertas.map((alertas, i) => (
                    <AlertCard
                        key={i}
                        title={alertas.title}
                        description={alertas.description}
                        sourceIp={alertas.sourceIp}
                        destIp={alertas.destIp}
                        timestamp={alertas.timestamp}
                    />
                ))}
            </div>
        </div>
    );
};

export default DetectionSuricata;
