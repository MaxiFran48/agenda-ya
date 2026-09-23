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
    } else {
      // Si el día NO está disponible, ignoramos el evento táctil/click
      // para cumplir con el CP-008-02
      // No hacemos nada, ni siquiera actualizamos el mensaje.
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto text-slate-100 animate-fade-in">
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Header del Calendario */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-center shadow-inner">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Reserva tu Turno</h2>
          <p className="text-blue-100 font-semibold mt-1">Junio 2026</p>
        </div>

        <div className="p-6">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {DIAS_SEMANA.map((dia) => (
              <div key={dia} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
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
                ? 'bg-white text-slate-900 font-bold border-2 border-transparent hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer shadow'
                : 'bg-slate-800/50 text-slate-500 border border-slate-700/50 opacity-50 cursor-not-allowed';

              return (
                <button
                  key={dia}
                  onClick={() => handleDayClick(dia)}
                  disabled={!esDisponible}
                  data-testid={`dia-${dia}`}
                  className={`aspect-square flex items-center justify-center rounded-xl transition-all duration-200 text-sm ${buttonClasses}`}
                  aria-label={esDisponible ? `Día ${dia} disponible` : `Día ${dia} no disponible`}
                >
                  {dia}
                </button>
              );
            })}
          </div>

          {/* Leyenda Visual */}
          <div className="mt-8 flex flex-col gap-3 pt-5 border-t border-slate-800/50">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-4 h-4 rounded-md bg-white shadow-sm"></div>
              <span className="text-slate-300 font-medium">Días con turnos disponibles</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-4 h-4 rounded-md bg-slate-800/50 border border-slate-700/50 opacity-50"></div>
              <span className="text-slate-500">Sin turnos configurados / Inhabilitado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback de interacción (para mostrar que el botón blanco funciona) */}
      <div className="h-12 mt-6 flex items-center justify-center w-full">
        {mensajeInteraccion && (
          <div className="text-sm font-semibold px-5 py-2.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl shadow-lg shadow-green-500/5 text-center">
            {mensajeInteraccion}
          </div>
        )}
      </div>
    </div>
  );
}
