import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import About from '@/pages/About'
import InitialSetup from '@/pages/InitialSetup'
import ProtectedRoute from './ProtectecRoute'
import NotFound from '@/pages/NotFound'
import Setup from '@/pages/Setup'
import FirewallControl from '@/features/firewall/pages/FirewallControl.tsx'
import DashboardLayout from '@/widgets/DashboardLayout'
import CreateRule from '@/features/firewall/pages/CreateRule.tsx'
import RedirectIfConfigured from '@/shared/components/RedirectIfConfigured.tsx'
import IntrusionDetection from '@/features/intrusion/pages/IntrusionDetection'
import DetectionSuricata from '@/features/intrusion/pages/DetectionSuricata'
import GuardianEyes from '@/features/intrusion/pages/GuardianEyes'
import ViewRules from '@/features/firewall/pages/ViewRules.tsx'
import SystemMonitor from '@/features/monitoring/pages/SystemMonitor'

function AppRoutes() {
  return (
    <RedirectIfConfigured>
      <Routes>
        <Route path="/initial-setup" element={<InitialSetup />} />

        {/* Rutas protegidas con layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/firewall-control" element={<FirewallControl />} />
            <Route path="/firewall-control/create-rule" element={<CreateRule />} />
            <Route path="/firewall-control/view-rules" element={<ViewRules />} />

            <Route path="/system-monitor" element={<SystemMonitor />} />
            <Route path="/intrusion-detection" element={<IntrusionDetection />} />
            <Route path="/intrusion-detection/notificaciones" element={<DetectionSuricata />} />
            <Route path="/intrusion-detection/guardian-eyes" element={<GuardianEyes />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </RedirectIfConfigured>
  )
}

export default AppRoutes