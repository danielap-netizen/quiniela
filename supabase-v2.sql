-- ============================================================
--  MIGRACIÓN V2: predicciones con resultado L/E/V
--  + tabla resultados para admin
-- ============================================================

-- Drop vieja tabla de predicciones y recrear con nueva estructura
DROP TABLE IF EXISTS public.predicciones CASCADE;

CREATE TABLE public.predicciones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partido_id  TEXT NOT NULL,
  resultado   TEXT NOT NULL CHECK (resultado IN ('L','E','V')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, partido_id)
);

CREATE INDEX idx_pred_user    ON public.predicciones(user_id);
CREATE INDEX idx_pred_partido ON public.predicciones(partido_id);
ALTER TABLE public.predicciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pred: ver propias"    ON public.predicciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Pred: ver post-cierre" ON public.predicciones FOR SELECT USING (NOW() > '2026-06-11T19:00:00Z'::TIMESTAMPTZ);
CREATE POLICY "Pred: insertar"       ON public.predicciones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Pred: actualizar"     ON public.predicciones FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Tabla de resultados reales (la llena el admin)
CREATE TABLE IF NOT EXISTS public.resultados (
  partido_id  TEXT PRIMARY KEY,
  resultado   TEXT NOT NULL CHECK (resultado IN ('L','E','V')),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.resultados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resultados: lectura publica" ON public.resultados FOR SELECT USING (true);
CREATE POLICY "Resultados: solo admin"      ON public.resultados FOR ALL USING (auth.role() = 'service_role');

-- Trigger updated_at predicciones
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS
'BEGIN NEW.updated_at = NOW(); RETURN NEW; END';

DROP TRIGGER IF EXISTS on_prediccion_updated ON public.predicciones;
CREATE TRIGGER on_prediccion_updated
  BEFORE UPDATE ON public.predicciones
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
