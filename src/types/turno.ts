
export interface Turno {
  id: string;
  numero: number;
  nombre: string;
  comentario: string;
  fechaCreacion: Date;
  estado: 'pendiente' | 'en-curso' | 'completado';
}

export type EstadoTurno = Turno['estado'];
