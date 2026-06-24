'use client';

import React, { useState } from 'react';
import { guardarEstadoDia } from '../services/US_001_persistenciaEstadoDia';
import GestionDiaTrabajo from './US_001_gestionDiaTrabajo';

interface DayConfig {
  diaSemana: string;
  habilitado: boolean;
  guardadoHabilitado: boolean;
  tieneReservas: boolean;
}

export default function ConfiguracionSemanal() {
  const [dias, setDias] = useState<DayConfig[]>([
    { diaSemana: 'Lunes', habilitado: true, guardadoHabilitado: true, tieneReservas: true },
    { diaSemana: 'Martes', habilitado: true, guardadoHabilitado: true, tieneReservas: false },
    { diaSemana: 'Miércoles', habilitado: true, guardadoHabilitado: true, tieneReservas: true },
    { diaSemana: 'Jueves', habilitado: true, guardadoHabilitado: true, tieneReservas: false },
    { diaSemana: 'Viernes', habilitado: true, guardadoHabilitado: true, tieneReservas: true },
    { diaSemana: 'Sábado', habilitado: false, guardadoHabilitado: false, tieneReservas: false },
    { diaSemana: 'Domingo', habilitado: false, guardadoHabilitado: false, tieneReservas: false },
  ]);

  const [mensaje, setMensaje] = useState('');
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);
  const [diasConAdvertencia, setDiasConAdvertencia] = useState<string[]>([]);

  const handleToggle = (index: number) => {
    const nuevosDias = [...dias];
    nuevosDias[index].habilitado = !nuevosDias[index].habilitado;
    setDias(nuevosDias);
  };

  const handleGuardar = async () => {
    setMensaje('');
    setDiasConAdvertencia([]);

    // Encontrar días que se están deshabilitando y tienen reservas
    const conflictivos = dias.filter(
      (d) => !d.habilitado && d.guardadoHabilitado && d.tieneReservas
    );

    if (conflictivos.length > 0) {
      setDiasConAdvertencia(conflictivos.map((c) => c.diaSemana));
      setMostrarAdvertencia(true);
      return;
    }

    // Guardar todos los días normales
    try {
      let cambiosRealizados = false;
      for (const d of dias) {
        if (d.habilitado !== d.guardadoHabilitado) {
          await guardarEstadoDia(d.diaSemana, d.habilitado, false);
          cambiosRealizados = true;
        }
      }

      // Actualizar estado guardado
      setDias(dias.map((d) => ({ ...d, guardadoHabilitado: d.habilitado })));
      setMensaje(cambiosRealizados ? 'Cambios guardados exitosamente' : 'No hay cambios pendientes');
    } catch (error) {
      setMensaje('Error al guardar los cambios');
    }
  };

  const handleConfirmarCancelar = async () => {
    try {
      // Inhabilitar días conflictivos con cancelarReservas = true
      for (const d of dias) {
        if (!d.habilitado && d.guardadoHabilitado) {
          await guardarEstadoDia(d.diaSemana, false, d.tieneReservas);
        } else if (d.habilitado !== d.guardadoHabilitado) {
          await guardarEstadoDia(d.diaSemana, d.habilitado, false);
        }
      }

      setDias(dias.map((d) => ({ ...d, guardadoHabilitado: d.habilitado })));
      setMostrarAdvertencia(false);
      
      const listaDias = diasConAdvertencia.join(', ');
      setMensaje(`Reservas para el día ${listaDias} canceladas`);
    } catch (error) {
      setMensaje('Error al cancelar reservas');
    }
  };

  const handleDescartarCambios = () => {
    // Revertir estado de habilitación al estado guardado anterior
    setDias(dias.map((d) => ({ ...d, habilitado: d.guardadoHabilitado })));
    setMostrarAdvertencia(false);
    setMensaje('Cambios descartados');
  };

  return (
    <div className="flex flex-col gap-6 w-full text-slate-100">
      <h3 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
        Configuración Semanal de Días de Trabajo
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {dias.map((d, index) => (
          <GestionDiaTrabajo
            key={d.diaSemana}
            diaSemana={d.diaSemana}
            habilitado={d.habilitado}
            guardadoHabilitado={d.guardadoHabilitado}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>

      {/* Global Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-8 p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="text-sm text-slate-400 text-center sm:text-left">
          Modifica los días de la semana y guarda para aplicar los cambios a la agenda.
        </div>
        <div className="flex gap-4 w-full sm:w-auto justify-center">
          <button
            type="button"
            data-testid="btn-descartar-global"
            onClick={handleDescartarCambios}
            className="px-4 py-2 border border-slate-700 text-slate-300 rounded-lg text-sm font-semibold hover:border-slate-600 hover:bg-slate-800 transition active:scale-95"
          >
            Descartar Cambios
          </button>
          <button
            type="button"
            data-testid="btn-guardar-global"
            onClick={handleGuardar}
            className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition active:scale-95 shadow-md shadow-green-600/10"
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      {mensaje && (
        <div data-testid="mensaje-alerta-global" className="text-sm font-semibold p-3 rounded-lg bg-slate-900 text-slate-200 text-center border border-slate-800 shadow">
          {mensaje}
        </div>
      )}

      {/* Modal/Advertencia de Reservas Global */}
      {mostrarAdvertencia && (
        <div
          data-testid="advertencia-reservas-global"
          className="p-5 border border-red-500/20 bg-red-950/20 rounded-xl text-red-200 mt-4 animate-fade-in"
        >
          <p className="text-sm font-medium mb-4">
            Los siguientes días tienen reservas registradas: <strong className="text-red-400">{diasConAdvertencia.join(', ')}</strong>. ¿Desea cancelar los turnos?
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              data-testid="btn-confirmar-cancelar-global"
              onClick={handleConfirmarCancelar}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-red-700 transition active:scale-95"
            >
              Cancelar Turnos
            </button>
            <button
              type="button"
              data-testid="btn-confirmar-descartar-global"
              onClick={handleDescartarCambios}
              className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-700 transition active:scale-95"
            >
              Descartar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
