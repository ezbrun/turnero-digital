
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Play, CheckCircle, Trash2, Users } from 'lucide-react';
import { Turno } from '@/types/turno';

interface AdministrarTurnosProps {
  turnos: Turno[];
  turnosPendientes: Turno[];
  turnosEnCurso: Turno[];
  turnosCompletados: Turno[];
  onCambiarEstado: (id: string, estado: Turno['estado']) => void;
  onEliminar: (id: string) => void;
}

const AdministrarTurnos = ({
  turnos,
  turnosPendientes,
  turnosEnCurso,
  turnosCompletados,
  onCambiarEstado,
  onEliminar
}: AdministrarTurnosProps) => {
  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado: Turno['estado']) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'en-curso':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">En Curso</Badge>;
      case 'completado':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completado</Badge>;
    }
  };

  const TurnoCard = ({ turno }: { turno: Turno }) => (
    <Card className="mb-3">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl font-bold text-blue-600">#{turno.numero}</div>
              {getEstadoBadge(turno.estado)}
              <span className="text-sm text-gray-500">
                {formatearFecha(turno.fecha_creacion)}
              </span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">{turno.nombre}</h4>
            <p className="text-sm text-gray-600 mb-3">{turno.comentario}</p>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          {turno.estado === 'pendiente' && (
            <Button
              size="sm"
              onClick={() => onCambiarEstado(turno.id, 'en-curso')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="h-4 w-4 mr-1" />
              Iniciar
            </Button>
          )}
          
          {turno.estado === 'en-curso' && (
            <Button
              size="sm"
              onClick={() => onCambiarEstado(turno.id, 'completado')}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Completar
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEliminar(turno.id)}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">{turnosPendientes.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Curso</p>
                <p className="text-3xl font-bold text-blue-600">{turnosEnCurso.length}</p>
              </div>
              <Play className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-3xl font-bold text-green-600">{turnosCompletados.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de turnos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestión de Turnos
          </CardTitle>
          <CardDescription>
            Administra todos los turnos del día
          </CardDescription>
        </CardHeader>
        <CardContent>
          {turnos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay turnos solicitados aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Turnos en curso */}
              {turnosEnCurso.length > 0 && (
                <div>
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    En Curso ({turnosEnCurso.length})
                  </h3>
                  {turnosEnCurso.map(turno => (
                    <TurnoCard key={turno.id} turno={turno} />
                  ))}
                  <Separator className="my-6" />
                </div>
              )}
              
              {/* Turnos pendientes */}
              {turnosPendientes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pendientes ({turnosPendientes.length})
                  </h3>
                  {turnosPendientes.map(turno => (
                    <TurnoCard key={turno.id} turno={turno} />
                  ))}
                  {turnosCompletados.length > 0 && <Separator className="my-6" />}
                </div>
              )}
              
              {/* Turnos completados */}
              {turnosCompletados.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Completados ({turnosCompletados.length})
                  </h3>
                  {turnosCompletados.map(turno => (
                    <TurnoCard key={turno.id} turno={turno} />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdministrarTurnos;
