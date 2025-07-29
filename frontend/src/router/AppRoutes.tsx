import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import InitialSetup from '../pages/InitialSetup'
import ProtectedRoute from './ProtectecRoute'
import NotFound from '../pages/NotFound'
import Setup from '../pages/Setup'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/initial-setup" element={<InitialSetup />} />

      <Route
        element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/setup" element={<Setup />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes