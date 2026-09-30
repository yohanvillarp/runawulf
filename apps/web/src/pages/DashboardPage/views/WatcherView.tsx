/**
 * @file WatcherView.tsx
 * @description Telemetry & Forensics Observatory view for Watcher mode.
 * High-density data console displaying live Suricata EVE streams, packet filters, and audit telemetry with sharp square aesthetics.
 */

import { useState } from 'react';
import { useTranslation } from '@/app/providers/LanguageProvider';
import {
  Radio,
  Search,
  Download,
  Filter,
  Eye,
} from 'lucide-react';
import { MOCK_EVENTS, type MockEveEvent } from './watcherData';
import { WatcherInspector } from './WatcherInspector';

export function WatcherView() {
  const { t } = useTranslation();
  const v = t.views.watcher;

  const [filterQuery, setFilterQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<MockEveEvent | null>(MOCK_EVENTS[0]);

  const filtered = MOCK_EVENTS.filter(
    (e) =>
      e.signature.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.srcIp.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.destIp.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Watcher Observatory Header Banner */}
      <section className="relative overflow-hidden rounded-none border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 p-5 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <div className="absolute top-3 right-4 font-mono text-[9px] text-amber-500/50 uppercase tracking-widest pointer-events-none">
          STATION: ODIN_WATCHER // BUFFER_HEALTH: OPTIMAL
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-none text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                {v.badge}
              </span>
              <span className="text-xs font-mono text-amber-300/70">
                {v.suricataVersion}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" />
              <span>{v.title}</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {v.streamSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-none border border-slate-800 text-xs font-mono">
            <div>
              <div className="text-slate-400 text-[10px]">INGEST RATE</div>
              <div className="text-amber-400 text-lg font-bold">148 ev/s</div>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <div className="text-slate-400 text-[10px]">AUDIT STATUS</div>
              <div className="text-emerald-400 text-lg font-bold">RECORDING</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stream Search & Filter Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={v.filterPlaceholder}
            className="w-full bg-slate-900 border border-slate-800 rounded-none pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-2 rounded-none bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Filter</span>
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-none bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 text-amber-400 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{v.exportLogs}</span>
          </button>
        </div>
      </div>

      {/* 3. Forensic Stream Table & Inspector Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live EVE Table (2 Cols) */}
        <div className="lg:col-span-2 rounded-none border border-slate-800 bg-slate-900/80 overflow-hidden">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              SURICATA EVE LOG STREAM
            </span>
            <span className="text-slate-500 text-[11px]">{filtered.length} events displayed</span>
          </div>

          <div className="overflow-x-auto max-h-[440px] overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">{v.tableTime}</th>
                  <th className="py-2.5 px-2 font-semibold">{v.tableSeverity}</th>
                  <th className="py-2.5 px-3 font-semibold">{v.tableSource}</th>
                  <th className="py-2.5 px-3 font-semibold">{v.tableSignature}</th>
                  <th className="py-2.5 px-3 text-right font-semibold">{v.tableAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {filtered.map((item) => {
                  const isSelected = selectedEvent?.id === item.id;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedEvent(item)}
                      className={`hover:bg-amber-500/5 transition-colors cursor-pointer ${
                        isSelected ? 'bg-amber-500/10 border-l-2 border-amber-400' : ''
                      }`}
                    >
                      <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                        {item.timestamp}
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-1.5 py-0.5 rounded-none text-[10px] font-bold ${
                            item.severity === 1
                              ? 'bg-red-950 text-red-400 border border-red-500/40'
                              : item.severity === 2
                              ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                              : 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                          }`}
                        >
                          S{item.severity}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300 whitespace-nowrap">
                        <span className="text-amber-300">{item.srcIp}</span>
                        <span className="text-slate-500 mx-1">→</span>
                        <span>{item.destIp}</span>
                      </td>
                      <td className="py-2 px-3 text-slate-300 truncate max-w-[200px]" title={item.signature}>
                        {item.signature}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className="px-1.5 py-0.5 text-[10px] rounded-none bg-slate-800 text-slate-300 border border-slate-700">
                          {item.action}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forensic Packet Inspector (1 Col) */}
        <WatcherInspector selectedEvent={selectedEvent} />
      </div>
    </div>
  );
}
