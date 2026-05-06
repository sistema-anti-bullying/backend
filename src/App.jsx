import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/lib/AuthContext'
import { Toaster } from 'sonner'

// Pages
import ReportForm from '@/pages/ReportForm'

// Placeholder components
const LandingPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Sistema Anti-Bullying</h1>
      <p className="text-lg mb-8">Denuncie ou acompanhe denúncias</p>
      <a href="/denunciar" className="bg-blue-600 text-white px-6 py-2 rounded">
        Fazer Denúncia
      </a>
    </div>
  </div>
)

const TrackReport = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p>Acompanhamento de denúncia em desenvolvimento</p>
  </div>
)

const AdminLayout = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p>Painel administrativo em desenvolvimento</p>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/denunciar" element={<ReportForm />} />
          <Route path="/acompanhar/:reportId" element={<TrackReport />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  )
}

export default App
