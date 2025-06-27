
-- Crear tabla para almacenar los turnos
CREATE TABLE public.turnos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  comentario TEXT NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en-curso', 'completado'))
);

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX idx_turnos_estado ON public.turnos(estado);
CREATE INDEX idx_turnos_fecha_creacion ON public.turnos(fecha_creacion);
