
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, ArrowLeft, LogOut, RefreshCw } from 'lucide-react';
import SolicitarTurno from '@/components/SolicitarTurno';
import AdministrarTurnos from '@/components/AdministrarTurnos';
import AdminLogin from '@/components/AdminLogin';
import { useSupabaseTurnos } from '@/hooks/useSupabaseTurnos';
import { useAdminAuth } from '@/hooks/useAdminAuth';

type Vista = 'inicio' | 'solicitar' | 'administrar';

const Index = () => {
  const [vistaActual, setVistaActual] = useState<Vista>('inicio');
  const { isAuthenticated, login, logout } = useAdminAuth();
  const {
    turnos,
    turnosPendientes,
    turnosEnCurso,
    turnosCompletados,
    loading,
    agregarTurno,
    cambiarEstadoTurno,
    eliminarTurno,
    recargarTurnos
  } = useSupabaseTurnos();

  // Wrapper para hacer que agregarTurno sea compatible con SolicitarTurno
  const handleAgregarTurno = async (nombre: string, comentario: string): Promise<number> => {
    return await agregarTurno(nombre, comentario);
  };

  const VistaPrincipal = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Sistema de Turnos</h1>
          <p className="text-xl text-gray-600">
            Gestiona tus citas de manera eficiente y organizada
          </p>
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={recargarTurnos}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Cargando...' : 'Actualizar'}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 hover:border-blue-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-blue-800">Solicitar Turno</CardTitle>
              <CardDescription>
                Reserva tu cita de forma rápida y sencilla
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setVistaActual('solicitar')}
              >
                Solicitar Turno
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 hover:border-green-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-800">Administrar Turnos</CardTitle>
              <CardDescription>
                Gestiona y organiza todos los turnos pendientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setVistaActual('administrar')}
              >
                Ver Turnos ({loading ? '...' : turnos.length})
              </Button>
            </CardContent>
          </Card>
        </div>

        {!loading && turnos.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{turnosPendientes.length}</div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{turnosEnCurso.length}</div>
                <div className="text-sm text-gray-600">En Curso</div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{turnosCompletados.length}</div>
                <div className="text-sm text-gray-600">Completados</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const BotonVolver = () => (
    <div className="absolute top-6 left-6">
      <Button
        variant="outline"
        onClick={() => setVistaActual('inicio')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>
    </div>
  );

  if (vistaActual === 'solicitar') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 relative">
        <BotonVolver />
        <div className="pt-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-800 mb-2">Solicitar Turno</h1>
            <p className="text-gray-600">Completa el formulario para reservar tu cita</p>
          </div>
          <SolicitarTurno onSolicitar={handleAgregarTurno} />
        </div>
      </div>
    );
  }

  if (vistaActual === 'administrar') {
    // Si no está autenticado, mostrar login
    if (!isAuthenticated) {
      return <AdminLogin onLogin={login} />;
    }

    // Si está autenticado, mostrar la administración
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 relative">
        <BotonVolver />
        <div className="absolute top-6 right-6">
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
        <div className="pt-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-2">Administrar Turnos</h1>
            <p className="text-gray-600">Gestiona todos los turnos del sistema</p>
          </div>
          <AdministrarTurnos
            turnos={turnos}
            turnosPendientes={turnosPendientes}
            turnosEnCurso={turnosEnCurso}
            turnosCompletados={turnosCompletados}
            onCambiarEstado={cambiarEstadoTurno}
            onEliminar={eliminarTurno}
          />
        </div>
      </div>
    );
  }

  return <VistaPrincipal />;
};

export default Index;
