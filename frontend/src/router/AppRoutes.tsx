import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import InitialSetup from '../pages/InitialSetup'
import ProtectedRoute from './ProtectecRoute'
import NotFound from '../pages/NotFound'
import Setup from '../pages/Setup'
import AccessControl from '../pages/FirewallControl'
import DashboardLayout from '../layouts/DashboardLayout'
import CreateRule from '../pages/ControlFirewall/CreateRule'
import RedirectIfConfigured from '../components/RedirectIfConfigured'
import SystemMonitor from '../pages/SystemMonitor'
import IntrusionDetection from '../pages/IntrusionDetection'
import ViewRules from '../pages/ControlFirewall/ViewRules'
import Backup from '../pages/Backup/Backup'

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
            <Route path="/firewall-control" element={<AccessControl />} />
            <Route path="/firewall-control/create-rule" element={<CreateRule />} />
            <Route path="/firewall-control/view-rules" element={<ViewRules />} />

            <Route path="/system-monitor" element={<SystemMonitor />} />
            <Route path="/intrusion-detection" element={<IntrusionDetection />} />
            <Route path="/backup" element={<Backup />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </RedirectIfConfigured>
  )
}

export default AppRoutes