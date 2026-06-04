import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MisPrediccionesPage from './pages/MisPrediccionesPage'
import TablaPublicaPage from './pages/TablaPublicaPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  if (user) return <Navigate to="/mis-predicciones" replace />
  return children
}

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030a06]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-pitch-500/30 border-t-pitch-400 rounded-full animate-spin" />
        <p className="text-pitch-400 font-mono text-sm tracking-widest">CARGANDO...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/tabla" replace />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/registro"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/mis-predicciones"
            element={
              <PrivateRoute>
                <Layout>
                  <MisPrediccionesPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/tabla"
            element={
              <Layout>
                <TablaPublicaPage />
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/tabla" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
