import { AlertTriangle, MapPin, Crosshair, Clock } from "lucide-react";

type AlertCardProps = {
    title: string;
    description: string;
    sourceIp: string;
    destIp: string;
    timestamp: string;
};

const AlertCard: React.FC<AlertCardProps> = ({
    title,
    description,
    sourceIp,
    destIp,
    timestamp,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow p-6 transition transform duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-500 border cursor-pointer mt-4">
            <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="text-blue-500 w-6 h-6" />
                <h3 className="text-lg font-semibold text-blue-600">{title}</h3>
            </div>
            <p className="text-gray-600 mb-2">{description}</p>

            <div className="text-sm text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span><strong>Origen:</strong> {sourceIp}</span>

                </div>

                <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-blue-500" />
                    <span><strong>Destino:</strong> {destIp}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span><strong>Hora:</strong> {timestamp}</span>
                </div>
            </div>
        </div>

    );
};

export default AlertCard;
