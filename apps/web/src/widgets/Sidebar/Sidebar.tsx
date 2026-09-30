/**
 * @file Sidebar.tsx
 * @description Enterprise navigation sidebar for Runawulf Control Plane powered by react-router NavLinks.
 */

import { NavLink } from 'react-router';
import { useTranslation } from '@/app/providers/LanguageProvider';
import { useOperationMode } from '@/app/providers/ModeProvider';
import {
  LayoutDashboard,
  ShieldAlert,
  Radio,
  Activity,
  FileCheck,
  Settings,
  Terminal,
} from 'lucide-react';

export function Sidebar() {
  const { t } = useTranslation();
  const { operationMode } = useOperationMode();

  const navItems = [
    {
      path: '/',
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      rune: 'ᚱ',
    },
    {
      path: '/firewall',
      label: t.nav.firewall,
      icon: ShieldAlert,
      rune: 'ᛉ',
      badge: 'nftables',
    },
    {
      path: '/intrusion',
      label: t.nav.intrusion,
      icon: Radio,
      rune: 'ᛇ',
      badge: 'Suricata',
    },
    {
      path: '/telemetry',
      label: t.nav.telemetry,
      icon: Activity,
      rune: 'ᛞ',
    },
    {
      path: '/audit',
      label: t.nav.audit,
      icon: FileCheck,
      rune: 'ᛟ',
      badge: 'HMAC',
    },
    {
      path: '/settings',
      label: t.nav.settings,
      icon: Settings,
      rune: 'ᚷ',
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-md flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
          System Control
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-3 py-2.5 rounded-none text-xs font-mono font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
                style={({ isActive }) => ({
                  borderLeft: isActive
                    ? `3px solid ${operationMode.accentColor}`
                    : '3px solid transparent',
                })}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className="w-4 h-4 transition-colors"
                        style={{ color: isActive ? operationMode.accentColor : undefined }}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-none bg-slate-800 text-slate-400 border border-slate-700/60">
                          {item.badge}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-400 opacity-60">
                        {item.rune}
                      </span>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Linux Security Boundary Footer Info */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/40">
        <div className="p-2.5 rounded-none bg-slate-900/80 border border-slate-800 text-[11px] space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-cyan-400" />
              Scope
            </span>
            <span className="text-cyan-300 font-semibold text-[10px]">table inet runawulf</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Watchdog</span>
            <span className="text-emerald-400 font-semibold">ARMED (30s)</span>
          </div>
        </div>

        <div className="px-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span>{t.nav.version}</span>
          <span className="text-emerald-500 font-bold">●</span>
        </div>
      </div>
    </aside>
  );
}
