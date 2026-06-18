'use client';

import React, { useState } from 'react';
import { guardarEstadoDia } from '../services/api';

export default function GestionDiaTrabajo({
  diaSemana,
  tieneReservasInicial = false,
  habilitadoInicial = true,
}: {
  diaSemana: string;
  tieneReservasInicial?: boolean;
  habilitadoInicial?: boolean;
}) {
  const [habilitado, setHabilitado] = useState(habilitadoInicial);
  const [mensaje, setMensaje] = useState('');
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);
  const [guardadoHabilitado, setGuardadoHabilitado] = useState(habilitadoInicial);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHabilitado(e.target.checked);
  };

  const handleGuardar = async () => {
    setMensaje('');
    
    // Si se está deshabilitando y tiene reservas, mostramos advertencia
    if (!habilitado && tieneReservasInicial && guardadoHabilitado) {
      setMostrarAdvertencia(true);
      return;
    }

    // Caso común (habilitar, o deshabilitar sin reservas)
    try {
      const exito = await guardarEstadoDia(diaSemana, habilitado, false);
      if (exito) {
        setGuardadoHabilitado(habilitado);
        setMensaje('Cambios guardados exitosamente');
      }
    } catch (error) {
      setMensaje('Error al guardar los cambios');
    }
  };

  const handleConfirmarCancelar = async () => {
    try {
      const exito = await guardarEstadoDia(diaSemana, false, true);
      if (exito) {
        setGuardadoHabilitado(false);
        setHabilitado(false);
        setMostrarAdvertencia(false);
        setMensaje(`Reservas para el día ${diaSemana} canceladas`);
      }
    } catch (error) {
      setMensaje('Error al cancelar reservas');
    }
  };

  const handleDescartarCambios = () => {
    setHabilitado(true);
    setMostrarAdvertencia(false);
    setMensaje('Cambios descartados');
  };

  // El estilo visual cambia según el estado guardado final
  const diaClase = guardadoHabilitado ? 'bg-white border-blue-500' : 'bg-gray-200 text-gray-500';
  const turnoClase = guardadoHabilitado ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-400';

  return (
    <div
      data-testid="dia-contenedor"
      className={`p-6 border rounded-lg shadow-md max-w-sm transition-all duration-300 ${diaClase}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold capitalize">{diaSemana}</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            data-testid="dia-checkbox"
            checked={habilitado}
            onChange={handleToggle}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium">Habilitado</span>
        </label>
      </div>

      {/* Lista de turnos de ejemplo */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-2">Turnos configurados</h4>
        <div className="flex flex-col gap-2">
          <div data-testid="turno-item" className={`p-2 rounded text-sm font-medium ${turnoClase}`}>
            09:00 - 10:00
          </div>
          <div data-testid="turno-item" className={`p-2 rounded text-sm font-medium ${turnoClase}`}>
            10:00 - 11:00
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {guardadoHabilitado && (
          <button
            type="button"
            data-testid="btn-agregar-turno"
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition"
          >
            Agregar Turno
          </button>
        )}
        <button
          type="button"
          data-testid="btn-guardar"
          onClick={handleGuardar}
          className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700 transition ml-auto"
        >
          Guardar Cambios
        </button>
      </div>

      {mensaje && (
        <div data-testid="mensaje-alerta" className="text-sm font-medium p-2 rounded bg-gray-50 text-gray-700 text-center border">
          {mensaje}
        </div>
      )}

      {/* Modal/Advertencia de Reservas */}
      {mostrarAdvertencia && (
        <div
          data-testid="advertencia-reservas"
          className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg text-red-800"
        >
          <p className="text-sm font-medium mb-3">
            El día tiene reservas registradas. ¿Desea cancelar los turnos?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              data-testid="btn-confirmar-cancelar"
              onClick={handleConfirmarCancelar}
              className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-red-700 transition"
            >
              Cancelar Turnos
            </button>
            <button
              type="button"
              data-testid="btn-confirmar-descartar"
              onClick={handleDescartarCambios}
              className="bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-700 transition"
            >
              Descartar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
