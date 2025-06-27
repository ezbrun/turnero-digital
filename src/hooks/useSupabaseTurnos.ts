
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Turno, TurnoInsertar } from '@/types/turno';

export const useSupabaseTurnos = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar turnos desde Supabase
  const cargarTurnos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('turnos')
        .select('*')
        .order('fecha_creacion', { ascending: true });

      if (error) {
        console.error('Error al cargar turnos:', error);
        return;
      }

      // Convertir las fechas de string a Date
      const turnosConFechas = (data || []).map(turno => ({
        ...turno,
        fecha_creacion: new Date(turno.fecha_creacion)
      }));

      setTurnos(turnosConFechas);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar turnos al montar el componente
  useEffect(() => {
    cargarTurnos();
  }, [cargarTurnos]);

  // Obtener el próximo número de turno
  const obtenerProximoNumero = useCallback(async () => {
    const { data, error } = await supabase
      .from('turnos')
      .select('numero')
      .order('numero', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error al obtener próximo número:', error);
      return 1;
    }

    return data && data.length > 0 ? data[0].numero + 1 : 1;
  }, []);

  const agregarTurno = useCallback(async (nombre: string, comentario: string) => {
    try {
      const proximoNumero = await obtenerProximoNumero();
      
      const nuevoTurno: TurnoInsertar = {
        numero: proximoNumero,
        nombre,
        comentario,
        estado: 'pendiente'
      };

      const { data, error } = await supabase
        .from('turnos')
        .insert([nuevoTurno])
        .select()
        .single();

      if (error) {
        console.error('Error al agregar turno:', error);
        return 0;
      }

      // Recargar turnos para mantener sincronización
      await cargarTurnos();
      return proximoNumero;
    } catch (error) {
      console.error('Error al agregar turno:', error);
      return 0;
    }
  }, [obtenerProximoNumero, cargarTurnos]);

  const cambiarEstadoTurno = useCallback(async (id: string, nuevoEstado: Turno['estado']) => {
    try {
      const { error } = await supabase
        .from('turnos')
        .update({ estado: nuevoEstado })
        .eq('id', id);

      if (error) {
        console.error('Error al cambiar estado:', error);
        return;
      }

      // Recargar turnos para mantener sincronización
      await cargarTurnos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  }, [cargarTurnos]);

  const eliminarTurno = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('turnos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error al eliminar turno:', error);
        return;
      }

      // Recargar turnos para mantener sincronización
      await cargarTurnos();
    } catch (error) {
      console.error('Error al eliminar turno:', error);
    }
  }, [cargarTurnos]);

  const turnosPendientes = turnos.filter(t => t.estado === 'pendiente');
  const turnosEnCurso = turnos.filter(t => t.estado === 'en-curso');
  const turnosCompletados = turnos.filter(t => t.estado === 'completado');

  return {
    turnos,
    turnosPendientes,
    turnosEnCurso,
    turnosCompletados,
    loading,
    agregarTurno,
    cambiarEstadoTurno,
    eliminarTurno,
    recargarTurnos: cargarTurnos
  };
};
