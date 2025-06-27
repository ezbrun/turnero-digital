
import { useState, useCallback, useEffect } from 'react';
import { Turno } from '@/types/turno';

const STORAGE_KEY = 'turnos-data';

export const useTurnos = () => {
  // Función para cargar turnos desde localStorage
  const cargarTurnosGuardados = (): Turno[] => {
    try {
      const datosGuardados = localStorage.getItem(STORAGE_KEY);
      if (datosGuardados) {
        const turnos = JSON.parse(datosGuardados);
        // Convertir las fechas de string a Date
        return turnos.map((turno: any) => ({
          ...turno,
          fecha_creacion: new Date(turno.fecha_creacion)
        }));
      }
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    }
    return [];
  };

  const [turnos, setTurnos] = useState<Turno[]>(cargarTurnosGuardados);

  // Función para guardar turnos en localStorage
  const guardarTurnos = useCallback((nuevosTurnos: Turno[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosTurnos));
    } catch (error) {
      console.error('Error al guardar turnos:', error);
    }
  }, []);

  // Guardar automáticamente cuando cambien los turnos
  useEffect(() => {
    guardarTurnos(turnos);
  }, [turnos, guardarTurnos]);

  const agregarTurno = useCallback((nombre: string, comentario: string) => {
    const nuevoTurno: Turno = {
      id: crypto.randomUUID(),
      numero: turnos.length + 1,
      nombre,
      comentario,
      fecha_creacion: new Date(),
      estado: 'pendiente'
    };
    
    setTurnos(prev => [...prev, nuevoTurno]);
    return nuevoTurno.numero;
  }, [turnos.length]);

  const cambiarEstadoTurno = useCallback((id: string, nuevoEstado: Turno['estado']) => {
    setTurnos(prev => 
      prev.map(turno => 
        turno.id === id ? { ...turno, estado: nuevoEstado } : turno
      )
    );
  }, []);

  const eliminarTurno = useCallback((id: string) => {
    setTurnos(prev => prev.filter(turno => turno.id !== id));
  }, []);

  const turnosPendientes = turnos.filter(t => t.estado === 'pendiente');
  const turnosEnCurso = turnos.filter(t => t.estado === 'en-curso');
  const turnosCompletados = turnos.filter(t => t.estado === 'completado');

  return {
    turnos,
    turnosPendientes,
    turnosEnCurso,
    turnosCompletados,
    agregarTurno,
    cambiarEstadoTurno,
    eliminarTurno
  };
};
