'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eliminarTurnoAPI } from '../services/turnos';

type Turno = {
  id: string;
  horario: string;
  tieneReservas: boolean;
};

export default function EliminarTurno({ turnoInicial }: { turnoInicial: Turno }) {
  const router = useRouter();
  const [turno, setTurno] = useState<Turno | null>(turnoInicial);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);

  const handleEliminar = () => {
    if (turno?.tieneReservas) {
      setMostrarAdvertencia(true);
    } else {
      guardarCambios('none');
    }
  };

  const guardarCambios = async (confirmacion: 'cancelar' | 'descartar' | 'none') => {
    if (!turno) return;

    if (confirmacion === 'descartar') {
      setMostrarAdvertencia(false);
      setMensaje('Cambios descartados');
      return;
    }

    const exito = await eliminarTurnoAPI(turno.id, turno.tieneReservas, confirmacion);

    if (exito) {
      if (confirmacion === 'cancelar') {
        setMensaje('Cambios guardados exitosamente. Reservas para el día Y canceladas');
        setTurno(null);
        setMostrarAdvertencia(false);
        router.push('/reprogramar-turnos');
      } else {
        setMensaje('Cambios guardados exitosamente');
        setTurno(null);
      }
    }
  };

  return (
    <div className="p-4 border rounded max-w-sm">
      {mensaje && <div data-testid="mensaje-alerta">{mensaje}</div>}
      
      {turno ? (
        <div data-testid="turno-elemento" className="flex flex-col gap-4">
          <p>Turno: {turno.horario}</p>
          <button 
            data-testid="btn-eliminar"
            onClick={handleEliminar}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Eliminar turno
          </button>
        </div>
      ) : null}

      {mostrarAdvertencia && (
        <div data-testid="advertencia-reservas" className="mt-4 p-4 bg-yellow-100 border border-yellow-400">
          <p>Advertencia: Este turno tiene reservas.</p>
          <div className="flex gap-2 mt-2">
            <button 
              data-testid="btn-cancelar-reservas"
              onClick={() => guardarCambios('cancelar')}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Cancelar turnos
            </button>
            <button 
              data-testid="btn-descartar-cambios"
              onClick={() => guardarCambios('descartar')}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Descartar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
