import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'

import Layout from './components/Layout'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MisPrediccionesPage from './pages/MisPrediccionesPage'
import TablaPublicaPage from './pages/TablaPublicaPage'
import PartidosPage from './pages/PartidosPage'
import AdminPage from './pages/AdminPage'
import ParticipantesPage from './pages/ParticipantesPage'

import OctavosPage from './pages/OctavosPage'
import AdminOctavosPage from './pages/AdminOctavosPage'
import TablaEliminatoriasPage from './pages/TablaEliminatoriasPage'
import PrediccionesEliminatoriasPage from './pages/PrediccionesEliminatoriasPage'
import PrediccionesEditablesPage from './pages/PrediccionesEditablesPage'
import ResultadosEliminatoriasPage from './pages/ResultadosEliminatoriasPage'

function Loader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#111F18' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full animate-spin"
          style={{
            border: '2px solid rgba(244,167,185,0.2)',
            borderTopColor: '#F4A7B9',
          }}
        />

        <p className="text-white/40 font-mono text-sm tracking-widest">
          CARGANDO...
        </p>
      </div>
    </div>
  )
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader />

  if (!user) return <Navigate to="/login" replace />

  return children
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader />

  if (user) return <Navigate to="/16avos" replace />

  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/16avos" replace />} />

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
            path="/16avos"
            element={
              <PrivateRoute>
                <Layout>
                  <OctavosPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route path="/octavos" element={<Navigate to="/16avos" replace />} />

          <Route
            path="/predicciones-editar"
            element={
              <PrivateRoute>
                <Layout>
                  <PrediccionesEditablesPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/resultados-16avos"
            element={
              <PrivateRoute>
                <Layout>
                  <ResultadosEliminatoriasPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/tabla-eliminatorias"
            element={
              <PrivateRoute>
                <Layout>
                  <TablaEliminatoriasPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/predicciones-16avos"
            element={
              <PrivateRoute>
                <Layout>
                  <PrediccionesEliminatoriasPage />
                </Layout>
              </PrivateRoute>
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
            path="/partidos"
            element={
              <Layout>
                <PartidosPage />
              </Layout>
            }
          />

          <Route
            path="/participantes"
            element={
              <Layout>
                <ParticipantesPage />
              </Layout>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Layout>
                  <AdminPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin-16avos"
            element={
              <PrivateRoute>
                <Layout>
                  <AdminOctavosPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route path="/admin-octavos" element={<Navigate to="/admin-16avos" replace />} />

          <Route
            path="/tabla"
            element={
              <Layout>
                <TablaPublicaPage />
              </Layout>
            }
          />

          <Route path="*" element={<Navigate to="/16avos" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
