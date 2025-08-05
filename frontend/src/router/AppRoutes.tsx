import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import InitialSetup from '../pages/InitialSetup'
import ProtectedRoute from './ProtectecRoute'
import NotFound from '../pages/NotFound'
import Setup from '../pages/Setup'
import AccessControl from '../pages/AccessControl'
import DashboardLayout from '../layouts/DashboardLayout'
import CreateRule from '../pages/AccessControl/CreateRule'
import RedirectIfConfigured from '../components/RedirectIfConfigured'

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
            <Route path="/access-control" element={<AccessControl />} />
            <Route path="/access-control/create-rule" element={<CreateRule />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </RedirectIfConfigured>
  )
}

export default AppRoutes