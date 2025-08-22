import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import InitialSetup from '../pages/InitialSetup'
import ProtectedRoute from './ProtectecRoute'
import NotFound from '../pages/NotFound'
import Setup from '../pages/Setup'
import FirewallControl from '../modules/Algiz/pages/FirewallControl.tsx'
import DashboardLayout from '../layouts/DashboardLayout'
import CreateRule from '../modules/Algiz/pages/CreateRule.tsx'
import RedirectIfConfigured from '../shared/components/RedirectIfConfigured.tsx'
import SystemMonitor from '../modules/Raido/pages/SystemMonitor.tsx'
import IntrusionDetection from '../modules/Eiwaz/pages/IntrusionDetection.tsx'
import DetectionSuricata from '../modules/Eiwaz/pages/DetectionSuricata.tsx'
import ViewRules from '../modules/Algiz/pages/ViewRules.tsx'
import Backup from '../modules/Berkano/pages/Backup.tsx'
import GuardianEyes from '../modules/Eiwaz/pages/GuardianEyes.tsx'

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
            <Route path="/backup" element={<Backup />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </RedirectIfConfigured>
  )
}

export default AppRoutes