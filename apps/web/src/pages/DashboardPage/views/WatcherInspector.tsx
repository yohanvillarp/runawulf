/**
 * @file WatcherInspector.tsx
 * @description Forensic RAW EVE JSON detail inspector panel for selected Suricata alerts.
 */

import { FileCode } from 'lucide-react';
import type { MockEveEvent } from './watcherData';

interface WatcherInspectorProps {
  selectedEvent: MockEveEvent | null;
}

export function WatcherInspector({ selectedEvent }: WatcherInspectorProps) {
  return (
    <div className="rounded-none border border-slate-800 bg-slate-900/80 p-4 space-y-3 font-mono text-xs">
      <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800 pb-2">
        <FileCode className="w-4 h-4 text-amber-400" />
        <span className="font-semibold">RAW EVE JSON INSPECTOR</span>
      </div>

      {selectedEvent ? (
        <div className="space-y-3">
          <div className="p-2.5 rounded-none bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400">CATEGORY</div>
            <div className="text-white font-semibold">{selectedEvent.category}</div>
          </div>

          <div className="p-2.5 rounded-none bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400">SIGNATURE</div>
            <div className="text-amber-400 text-xs font-semibold leading-tight">
              {selectedEvent.signature}
            </div>
          </div>

          <div className="p-2.5 rounded-none bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400">RAW PAYLOAD SUMMARY</div>
            <pre className="text-[11px] text-slate-300 overflow-x-auto p-2 rounded-none bg-slate-900 border border-slate-800">
{JSON.stringify(
  {
    event_type: 'alert',
    src_ip: selectedEvent.srcIp.split(':')[0],
    src_port: Number(selectedEvent.srcIp.split(':')[1]),
    dest_ip: selectedEvent.destIp.split(':')[0],
    dest_port: Number(selectedEvent.destIp.split(':')[1]),
    proto: 'TCP',
    alert: {
      action: 'allowed',
      gid: 1,
      signature_id: 2012034,
      rev: 8,
      severity: selectedEvent.severity,
    },
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="text-slate-500 text-center py-10">Select an event from the stream to inspect</div>
      )}
    </div>
  );
}
