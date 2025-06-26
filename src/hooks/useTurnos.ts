
import { useState, useCallback } from 'react';
import { Turno } from '@/types/turno';

export const useTurnos = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);

  const agregarTurno = useCallback((nombre: string, comentario: string) => {
    const nuevoTurno: Turno = {
      id: crypto.randomUUID(),
      numero: turnos.length + 1,
      nombre,
      comentario,
      fechaCreacion: new Date(),
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
