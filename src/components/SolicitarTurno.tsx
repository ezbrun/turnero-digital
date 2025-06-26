
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle, User, MessageSquare } from 'lucide-react';

interface SolicitarTurnoProps {
  onSolicitar: (nombre: string, comentario: string) => number;
}

const SolicitarTurno = ({ onSolicitar }: SolicitarTurnoProps) => {
  const [nombre, setNombre] = useState('');
  const [comentario, setComentario] = useState('');
  const [turnoAsignado, setTurnoAsignado] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim() || !comentario.trim()) return;
    
    setCargando(true);
    
    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      const numeroTurno = onSolicitar(nombre.trim(), comentario.trim());
      setTurnoAsignado(numeroTurno);
      setNombre('');
      setComentario('');
      setCargando(false);
      
      // Limpiar la confirmación después de 5 segundos
      setTimeout(() => setTurnoAsignado(null), 5000);
    }, 500);
  };

  if (turnoAsignado) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
              <div>
                <h3 className="text-2xl font-bold text-green-800">¡Turno Asignado!</h3>
                <p className="text-green-600 mt-2">Tu número de turno es:</p>
                <div className="text-6xl font-bold text-green-800 my-4">#{turnoAsignado}</div>
                <p className="text-sm text-green-600">
                  Por favor conserva este número. Te avisaremos cuando sea tu turno.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-blue-800">Solicitar Turno</CardTitle>
          <CardDescription className="text-center">
            Completa los datos para solicitar tu turno
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nombre completo
              </Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comentario" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Motivo de la reunión
              </Label>
              <Textarea
                id="comentario"
                placeholder="Describe brevemente el motivo de tu consulta..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                required
                rows={3}
                className="focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={cargando || !nombre.trim() || !comentario.trim()}
            >
              {cargando ? 'Procesando...' : 'Solicitar Turno'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolicitarTurno;
