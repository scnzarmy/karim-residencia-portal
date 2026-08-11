import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppProvider, useApp } from './context/AppContext'
import LandingPage from './components/LandingPage'
import BlockSelection from './components/BlockSelection'
import LoginPage from './components/LoginPage'
import ResidentDashboard from './components/ResidentDashboard'
import CommitteeDashboard from './components/CommitteeDashboard'
import ResetPasswordPage from './components/ResetPasswordPage'

function DashboardRouter() {
  const { profile, loadingProfile } = useApp()

  if (loadingProfile) {
    return <div className="min-h-screen flex items-center justify-center text-forest-600">Loading…</div>
  }
  if (!profile) {
    return <Navigate to="/login" replace />
  }
  return profile.role === 'committee' ? <CommitteeDashboard /> : <ResidentDashboard />
}

export default function App() {
  return (
    <AppProvider>
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/select-block" element={<BlockSelection />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
