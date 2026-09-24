import React, { useState } from 'react';
import { obtenerFranjasDisponibles, TurnoOcupado } from '../services/US_009_seleccionFranjaHoraria';

export interface DiaDisponibilidad {
  fecha: string;
  apertura: string; // ej "09:00"
  cierre: string;   // ej "18:00"
  turnosOcupados: TurnoOcupado[];
}

interface Props {
  duracionEventoMinutos: number;
  diasDisponibles: DiaDisponibilidad[];
  onSeleccionarFranja?: (fecha: string, hora: string) => void;
}

// Genera intervalos de 30 min entre la apertura y el cierre para pasárselos al servicio
const generarBloquesDelDia = (apertura: string, cierre: string, intervaloMin: number = 30): string[] => {
  const [hApertura, mApertura] = apertura.split(':').map(Number);
  const [hCierre, mCierre] = cierre.split(':').map(Number);
  const inicioMin = hApertura * 60 + mApertura;
  const finMin = hCierre * 60 + mCierre;

  const bloques: string[] = [];
  for (let actual = inicioMin; actual < finMin; actual += intervaloMin) {
    const hh = Math.floor(actual / 60).toString().padStart(2, '0');
    const mm = (actual % 60).toString().padStart(2, '0');
    bloques.push(`${hh}:${mm}`);
  }
  return bloques;
};

export const US_009_SeleccionFranjaHoraria: React.FC<Props> = ({
  duracionEventoMinutos,
  diasDisponibles,
  onSeleccionarFranja,
}) => {
  const [diaSeleccionado, setDiaSeleccionado] = useState<DiaDisponibilidad | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);

  const franjas = diaSeleccionado
    ? obtenerFranjasDisponibles(
        generarBloquesDelDia(diaSeleccionado.apertura, diaSeleccionado.cierre),
        duracionEventoMinutos,
        diaSeleccionado.turnosOcupados,
        diaSeleccionado.cierre
      )
    : [];

  return (
    <div className="p-4 max-w-md mx-auto" data-testid="modulo-franja-horaria">
      <h2 className="text-lg font-bold mb-4">Selección de franja horaria</h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Días del mes:</h3>
        <div className="flex gap-2 flex-wrap">
          {diasDisponibles.map((dia) => {
            const bloques = generarBloquesDelDia(dia.apertura, dia.cierre);
            const slotsDisponibles = obtenerFranjasDisponibles(
              bloques,
              duracionEventoMinutos,
              dia.turnosOcupados,
              dia.cierre
            );
            const tieneDisponibilidadContinua = slotsDisponibles.length > 0;

            return (
              <button
                key={dia.fecha}
                data-testid={`dia-${dia.fecha}`}
                disabled={!tieneDisponibilidadContinua}
                onClick={() => {
                  setDiaSeleccionado(dia);
                  setHoraSeleccionada(null);
                }}
                className={`px-3 py-2 border rounded ${
                  !tieneDisponibilidadContinua
                    ? 'opacity-40 bg-gray-200 cursor-not-allowed text-gray-500'
                    : diaSeleccionado?.fecha === dia.fecha
                    ? 'bg-blue-600 text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {dia.fecha}
              </button>
            );
          })}
        </div>
      </div>

      {diaSeleccionado && (
        <div data-testid="seccion-franjas" className="mt-4">
          <h3 className="font-semibold mb-2">Horarios disponibles:</h3>
          {franjas.length === 0 ? (
            <p className="text-gray-500 text-sm">No disponible</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {franjas.map((hora) => (
                <button
                  key={hora}
                  data-testid={`slot-${hora}`}
                  onClick={() => {
                    setHoraSeleccionada(hora);
                    onSeleccionarFranja?.(diaSeleccionado.fecha, hora);
                  }}
                  className={`py-2 px-3 border text-sm rounded ${
                    horaSeleccionada === hora ? 'bg-green-600 text-white' : 'hover:bg-blue-50'
                  }`}
                >
                  {hora}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {horaSeleccionada && (
        <div data-testid="confirmacion-seleccion" className="mt-4 p-2 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-800">
            Franja seleccionada: {horaSeleccionada} hs ({duracionEventoMinutos} min)
          </p>
        </div>
      )}
    </div>
  );
};

export default US_009_SeleccionFranjaHoraria;
