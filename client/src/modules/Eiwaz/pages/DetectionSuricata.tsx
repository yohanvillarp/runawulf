import AlertCard from "../components/AlertCard";
import { useScript } from "../../../shared/hooks/useScript";
import type { SuricataLog } from "../types/SuricataLog";

const DetectionSuricata = () => {
    const { data } = useScript<SuricataLog[]>([], "get/get_suricata_logs.sh")

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Alertas de Suricata</h2>
            <div className="grid grid-cols-1 ">
                {data.map((alertas, i) => (
                    <AlertCard
                        key={i}
                        title={alertas.tipo}
                        description={alertas.alerta}
                        sourceIp={alertas.src_ip}
                        destIp={alertas.dest_ip}
                        timestamp={alertas.timestamp}
                    />
                ))}
            </div>
        </div>
    );
};

export default DetectionSuricata;
