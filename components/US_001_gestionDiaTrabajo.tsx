'use client';

import React, { useState } from 'react';

export interface Turno {
  id: string;
  horaInicio: string;
  horaFin: string;
}

function aMinutos(hora: string): number {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}

export default function GestionDiaTrabajo({
  diaSemana,
  habilitado,
  onToggle,
  turnos = [],
  onAgregarTurno,
  onEliminarTurno,
}: {
  diaSemana: string;
  habilitado: boolean;
  onToggle: () => void;
  turnos?: Turno[];
  onAgregarTurno?: (dia: string, horaInicio: string, horaFin: string) => void;
  onEliminarTurno?: (dia: string, id: string) => void;
}) {
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [error, setError] = useState('');

  const normalizado = diaSemana.toLowerCase();
  const diaClase = habilitado ? 'bg-white text-slate-900 border-blue-500' : 'bg-gray-200 text-slate-700';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!onAgregarTurno) return;
    if (!horaInicio || !horaFin) {
      setError('Completá las horas de inicio y fin');
      return;
    }
    if (aMinutos(horaFin) <= aMinutos(horaInicio)) {
      setError('La hora de fin debe ser posterior a la de inicio');
      return;
    }

    const haySuperposicion = turnos.some(
      (t) => aMinutos(horaInicio) < aMinutos(t.horaFin) && aMinutos(horaFin) > aMinutos(t.horaInicio)
    );
    if (haySuperposicion) {
      setError(`Superposición entre turnos ${horaInicio} y ${horaFin} del día ${diaSemana}`);
      return;
    }

    onAgregarTurno(diaSemana, horaInicio, horaFin);
    setHoraInicio('');
    setHoraFin('');
  };

  return (
    <div
      data-testid={`dia-contenedor-${normalizado}`}
      data-cy={`dia-contenedor-${normalizado}`}
      className={`p-6 border rounded-lg shadow-md w-full max-w-sm transition-all duration-300 ${diaClase}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold capitalize">{diaSemana}</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            data-testid={`dia-checkbox-${normalizado}`}
            data-cy={`dia-checkbox-${normalizado}`}
            checked={habilitado}
            onChange={onToggle}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-semibold">Habilitado</span>
        </label>
      </div>

      {/* Lista de turnos del día */}
      <div className="mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Turnos configurados</h4>
        {turnos.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Sin turnos configurados.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {turnos.map((t) => (
              <div
                key={t.id}
                data-testid={`turno-item-${normalizado}`}
                data-cy={`turno-item-${normalizado}`}
                className={`p-2 rounded text-sm font-medium flex items-center justify-between ${
                  habilitado ? 'bg-blue-50 text-blue-900' : 'bg-gray-100 text-slate-500'
                }`}
              >
                <span>
                  {t.horaInicio} - {t.horaFin}
                </span>
                {onEliminarTurno && (
                  <button
                    type="button"
                    data-testid={`btn-eliminar-turno-${normalizado}`}
                    data-cy={`btn-eliminar-turno-${normalizado}`}
                    onClick={() => onEliminarTurno(diaSemana, t.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 px-1.5 transition"
                    aria-label={`Eliminar turno ${t.horaInicio} - ${t.horaFin}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alta de turnos */}
      {habilitado && onAgregarTurno && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <input
              type="time"
              data-testid={`input-hora-inicio-${normalizado}`}
              data-cy={`input-hora-inicio-${normalizado}`}
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="border rounded p-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none flex-1"
            />
            <span className="text-slate-500 text-sm">-</span>
            <input
              type="time"
              data-testid={`input-hora-fin-${normalizado}`}
              data-cy={`input-hora-fin-${normalizado}`}
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className="border rounded p-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none flex-1"
            />
          </div>
          {error && (
            <div
              data-testid={`mensaje-error-turno-${normalizado}`}
              data-cy={`mensaje-error-turno-${normalizado}`}
              className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-1.5"
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            data-testid={`btn-agregar-turno-${normalizado}`}
            data-cy={`btn-agregar-turno-${normalizado}`}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition"
          >
            Agregar Turno
          </button>
        </form>
      )}
    </div>
  );
}