import AlertPanel from "../components/AlertPanel";
import { useScript } from "../../../shared/hooks/useScript";
import type { SuricataLog } from "../types/SuricataLog";

export default function GuardianEyes() {
  const { data } = useScript<SuricataLog[]>([], "get/get_suricata_logs.sh");

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">ᛇ Ojos del Guardián</h3>
      <AlertPanel logs={data} bucketMs={60_000} />
    </div>
  );
}
