
export interface Turno {
  id: string;
  numero: number;
  nombre: string;
  comentario: string;
  fecha_creacion: Date;
  estado: 'pendiente' | 'en-curso' | 'completado';
}

export type EstadoTurno = Turno['estado'];

// Tipo para insertar nuevos turnos en Supabase
export interface TurnoInsertar {
  numero: number;
  nombre: string;
  comentario: string;
  estado?: EstadoTurno;
}
