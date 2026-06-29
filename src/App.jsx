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
            border: '
