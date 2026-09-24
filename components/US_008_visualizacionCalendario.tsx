'use client';

import React, { useState } from 'react';

// Días de la semana para el encabezado
const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Simulación de los días de Junio 2026.
// Junio 2026 empieza un Lunes y tiene 30 días.
const DIAS_JUNIO_2026 = Array.from({ length: 30 }, (_, i) => i + 1);

// Días con turnos disponibles pre-configurados (Datos de Prueba)
const DIAS_DISPONIBLES = [15, 16, 18];

export default function VisualizacionCalendarioPublico() {
  const [mensajeInteraccion, setMensajeInteraccion] = useState<string>('');

  const handleDayClick = (dia: number) => {
    // Si el día está disponible, simulamos que selecciona la fecha
    if (DIAS_DISPONIBLES.includes(dia)) {
      setMensajeInteraccion(`✓ Has seleccionado el día ${dia} de Junio de 2026 para reservar.`);
    }
    // Si el día NO está disponible, ignoramos el evento táctil/click
    // para cumplir con el CP-008-02
    // No hacemos nada, ni siquiera actualizamos el mensaje.
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
        {/* Header del Calendario */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-center">
          <h3 className="text-2xl font-bold text-white tracking-tight">Reserva tu Turno</h3>
          <p className="text-blue-100 font-semibold mt-1">Junio 2026</p>
        </div>

        <div className="p-6">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {DIAS_SEMANA.map((dia) => (
              <div key={dia} className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                {dia}
              </div>
            ))}
          </div>

          {/* Cuadrícula del mes */}
          <div className="grid grid-cols-7 gap-2">
            {DIAS_JUNIO_2026.map((dia) => {
              const esDisponible = DIAS_DISPONIBLES.includes(dia);

              // Clases dinámicas dependiendo de la disponibilidad (CP-008-01 vs CP-008-02)
              const buttonClasses = esDisponible
                ? 'bg-blue-600 text-white font-bold shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer'
                : 'bg-gray-100 text-gray-300 border border-gray-200 opacity-60 cursor-not-allowed';

              return (
                <button
                  key={dia}
                  onClick={() => handleDayClick(dia)}
                  disabled={!esDisponible}
                  data-testid={`dia-${dia}`}
                  data-cy={`dia-${dia}`}
                  className={`aspect-square flex items-center justify-center rounded-xl transition-all duration-200 text-sm ${buttonClasses}`}
                  aria-label={esDisponible ? `Día ${dia} disponible` : `Día ${dia} no disponible`}
                >
                  {dia}
                </button>
              );
            })}
          </div>

          {/* Leyenda Visual */}
          <div className="mt-8 flex flex-col gap-3 pt-5 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-4 h-4 rounded-md bg-blue-600"></div>
              <span className="text-gray-600 font-medium">Días con turnos disponibles</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-4 h-4 rounded-md bg-gray-200 border border-gray-300"></div>
              <span className="text-gray-400">Sin turnos configurados / Inhabilitado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback de interacción (para mostrar que el botón habilitado funciona) */}
      <div className="h-12 mt-6 flex items-center justify-center w-full">
        {mensajeInteraccion && (
          <div
            data-cy="mensaje-seleccion"
            className="text-sm font-semibold px-5 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-center shadow-sm"
          >
            {mensajeInteraccion}
          </div>
        )}
      </div>
    </div>
  );
}