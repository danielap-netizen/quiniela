-- ============================================================
--  🗄️  QUINIELA — Script SQL para Supabase
--  Ejecuta este script completo en el SQL Editor de Supabase
--  Dashboard → SQL Editor → New query → Pega y ejecuta
-- ============================================================


-- ----------------------------------------------------------------
-- 1. TABLA: profiles (datos básicos de cada usuario)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  email       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);


-- ----------------------------------------------------------------
-- 2. TABLA: predicciones (una fila por usuario × partido)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.predicciones (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partido_id        TEXT NOT NULL,          -- ej: 'match_1', 'match_2'
  goles_local       INTEGER NOT NULL CHECK (goles_local >= 0 AND goles_local <= 99),
  goles_visitante   INTEGER NOT NULL CHECK (goles_visitante >= 0 AND goles_visitante <= 99),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, partido_id)              -- un solo resultado por partido por usuario
);

-- Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_predicciones_user    ON public.predicciones(user_id);
CREATE INDEX IF NOT EXISTS idx_predicciones_partido ON public.predicciones(partido_id);


-- ----------------------------------------------------------------
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------
ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predicciones ENABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------
-- 4. POLÍTICAS RLS — profiles
-- ----------------------------------------------------------------

-- Cualquier usuario autenticado puede ver todos los perfiles
-- (solo se usa para el conteo de participantes)
CREATE POLICY "Profiles: lectura pública"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Solo el propio usuario puede insertar/actualizar su perfil
CREATE POLICY "Profiles: insertar propio"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: actualizar propio"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);


-- ----------------------------------------------------------------
-- 5. POLÍTICAS RLS — predicciones
-- ----------------------------------------------------------------

-- Un usuario autenticado puede VER sus propias predicciones SIEMPRE
CREATE POLICY "Predicciones: ver propias"
  ON public.predicciones
  FOR SELECT
  USING (auth.uid() = user_id);

-- Cualquiera (anon + auth) puede ver TODAS las predicciones
-- SOLO después de la fecha de cierre.
-- ⚠️  Cambia '2025-07-15T20:00:00Z' a tu FECHA_CIERRE real (en UTC).
CREATE POLICY "Predicciones: ver todas post-cierre"
  ON public.predicciones
  FOR SELECT
  USING (NOW() > '2025-07-15T20:00:00Z'::TIMESTAMPTZ);

-- Solo el propio usuario puede INSERTAR sus predicciones
-- (y solo antes del cierre — validación adicional en el cliente)
CREATE POLICY "Predicciones: insertar propias"
  ON public.predicciones
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Solo el propio usuario puede ACTUALIZAR sus predicciones
CREATE POLICY "Predicciones: actualizar propias"
  ON public.predicciones
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Nadie puede borrar predicciones desde el cliente
-- (solo se puede desde el panel de Supabase manualmente)


-- ----------------------------------------------------------------
-- 6. FUNCIÓN: auto-actualizar updated_at
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_prediccion_updated
  BEFORE UPDATE ON public.predicciones
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ----------------------------------------------------------------
-- 7. VERIFICACIÓN FINAL
-- ----------------------------------------------------------------
-- Ejecuta estas consultas para confirmar que todo está bien:

-- SELECT tablename, rowsecurity FROM pg_tables
--   WHERE schemaname = 'public';

-- SELECT policyname, cmd, qual FROM pg_policies
--   WHERE schemaname = 'public';

-- ✅ Si ves las 2 tablas con rowsecurity=true y las 6 políticas,
--    la base de datos está lista.
