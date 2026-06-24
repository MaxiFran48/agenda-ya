'use client';

import React from 'react';

export default function GestionDiaTrabajo({
  diaSemana,
  habilitado,
  guardadoHabilitado,
  onToggle,
}: {
  diaSemana: string;
  habilitado: boolean;
  guardadoHabilitado: boolean;
  onToggle: () => void;
}) {
  const diaClase = guardadoHabilitado ? 'bg-white text-slate-900 border-blue-500' : 'bg-gray-200 text-slate-700';
  const turnoClase = guardadoHabilitado ? 'bg-blue-50 text-blue-900 font-semibold' : 'bg-gray-100 text-slate-500';

  return (
    <div
      data-testid={`dia-contenedor-${diaSemana.toLowerCase()}`}
      className={`p-6 border rounded-lg shadow-md w-full max-w-sm transition-all duration-300 ${diaClase}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold capitalize">{diaSemana}</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            data-testid={`dia-checkbox-${diaSemana.toLowerCase()}`}
            checked={habilitado}
            onChange={onToggle}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-semibold">Habilitado</span>
        </label>
      </div>

      {/* Lista de turnos de ejemplo */}
      <div className="mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Turnos configurados</h4>
        <div className="flex flex-col gap-2">
          <div data-testid="turno-item" className={`p-2 rounded text-sm font-medium ${turnoClase}`}>
            09:00 - 10:00
          </div>
          <div data-testid="turno-item" className={`p-2 rounded text-sm font-medium ${turnoClase}`}>
            10:00 - 11:00
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {guardadoHabilitado && (
          <span
            data-testid="btn-agregar-turno"
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium cursor-pointer hover:bg-blue-700 transition"
          >
            Agregar Turno
          </span>
        )}
      </div>
    </div>
  );
}
