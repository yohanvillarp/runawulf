/**
 * @file App.tsx
 * @description Enterprise application shell for Runawulf Linux Local Control Plane.
 * Features URL-based routing with react-router (BrowserRouter, Routes, Route, Link).
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router';
import { LanguageProvider } from '@/app/providers/LanguageProvider';
import { ModeProvider } from '@/app/providers/ModeProvider';
import { RunicBackground } from '@/widgets/RunicBackground/RunicBackground';
import { Header } from '@/widgets/Header/Header';
import { Sidebar } from '@/widgets/Sidebar';
import { DashboardPage } from '@/pages/DashboardPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { FirewallPage } from '@/pages/FirewallPage/FirewallPage';
import { IntrusionPage } from '@/pages/IntrusionPage/IntrusionPage';
import { TelemetryPage } from '@/pages/TelemetryPage/TelemetryPage';
import { AuditPage } from '@/pages/AuditPage/AuditPage';
import { SettingsPage } from '@/pages/SettingsPage/SettingsPage';

function AppContent() {
  const navigate = useNavigate();
  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('runawulf_setup_completed') === 'true';
    } catch {
      return false;
    }
  });

  const handleSetupComplete = () => {
    setIsSetupCompleted(true);
    navigate('/');
  };

  const handleRerunSetup = () => {
    try {
      localStorage.removeItem('runawulf_setup_completed');
    } catch {
      // Ignore
    }
    setIsSetupCompleted(false);
  };

  if (!isSetupCompleted) {
    return <OnboardingPage onComplete={handleSetupComplete} />;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white animate-in fade-in duration-700">
      {/* Ambient subtle canvas runes reacting to active defense posture */}
      <RunicBackground />

      {/* Enterprise Top Navigation Bar with Brand Link and centered Cyber-Dock */}
      <Header />

      {/* Main Layout: Sidebar + Operational Viewport Routes */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/firewall" element={<FirewallPage />} />
            <Route path="/intrusion" element={<IntrusionPage />} />
            <Route path="/telemetry" element={<TelemetryPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route
              path="/settings"
              element={<SettingsPage onRerunSetup={handleRerunSetup} />}
            />
            <Route
              path="/setup"
              element={<OnboardingPage onComplete={handleSetupComplete} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ModeProvider>
          <AppContent />
        </ModeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
