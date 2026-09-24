'use client';

import React, { useState } from 'react';
import { guardarEstadoDia } from '../services/persistenciaEstadoDia';
import GestionDiaTrabajo, { Turno } from './US_001_gestionDiaTrabajo';

function aMinutos(hora: string): number {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}

export interface DayConfig {
  diaSemana: string;
  habilitado: boolean;
  guardadoHabilitado: boolean;
  tieneReservas: boolean;
  turnos: Turno[];
}

function crearDiasIniciales(): DayConfig[] {
  return [
    { diaSemana: 'Lunes', habilitado: true, guardadoHabilitado: true, tieneReservas: true, turnos: [] },
    { diaSemana: 'Martes', habilitado: true, guardadoHabilitado: true, tieneReservas: false, turnos: [] },
    { diaSemana: 'Miércoles', habilitado: true, guardadoHabilitado: true, tieneReservas: true, turnos: [] },
    { diaSemana: 'Jueves', habilitado: true, guardadoHabilitado: true, tieneReservas: false, turnos: [] },
    { diaSemana: 'Viernes', habilitado: true, guardadoHabilitado: true, tieneReservas: true, turnos: [] },
    { diaSemana: 'Sábado', habilitado: false, guardadoHabilitado: false, tieneReservas: false, turnos: [] },
    { diaSemana: 'Domingo', habilitado: false, guardadoHabilitado: false, tieneReservas: false, turnos: [] },
  ];
}

export default function ConfiguracionSemanal({
  diasIniciales,
}: {
  diasIniciales?: DayConfig[];
}) {
  const [dias, setDias] = useState<DayConfig[]>(() => diasIniciales ?? crearDiasIniciales());
  const [mensaje, setMensaje] = useState('');
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);
  const [diasConAdvertencia, setDiasConAdvertencia] = useState<string[]>([]);

  // Mocks de tipos de eventos predefinidos
  const TIPOS_EVENTO_MOCK = [
    { id: '1', nombre: 'Consulta General', duracion: 45 },
    { id: '2', nombre: 'Revisión', duracion: 30 },
    { id: '3', nombre: 'Consulta Larga', duracion: 60 },
    { id: '4', nombre: 'Operación Menor', duracion: 120 },
  ];

  // Estados para Asignar Eventos a Turnos
  const [turnoSeleccionado, setTurnoSeleccionado] = useState('');
  const [tipoEventoSeleccionado, setTipoEventoSeleccionado] = useState('');
  const [resultadoMensaje, setResultadoMensaje] = useState('');
  const [resultadoTipo, setResultadoTipo] = useState<'success' | 'error' | ''>('');

  const handleToggle = (index: number) => {
    const nuevosDias = [...dias];
    nuevosDias[index].habilitado = !nuevosDias[index].habilitado;
    setDias(nuevosDias);
  };

  const handleAgregarTurno = (dia: string, horaInicio: string, horaFin: string) => {
    setDias(
      dias.map((d) =>
        d.diaSemana === dia
          ? {
              ...d,
              turnos: [
                ...d.turnos,
                { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, horaInicio, horaFin },
              ],
            }
          : d
      )
    );
  };

  const handleEliminarTurno = (dia: string, id: string) => {
    setDias(
      dias.map((d) =>
        d.diaSemana === dia ? { ...d, turnos: d.turnos.filter((t) => t.id !== id) } : d
      )
    );
    // Si se eliminó el turno seleccionado, limpiamos el state
    if (turnoSeleccionado === id) {
      setTurnoSeleccionado('');
    }
  };

  const handleAsignarEvento = (e: React.FormEvent) => {
    e.preventDefault();
    setResultadoMensaje('');
    setResultadoTipo('');

    if (!turnoSeleccionado || !tipoEventoSeleccionado) {
      setResultadoMensaje('Debe seleccionar el turno y el tipo de evento');
      setResultadoTipo('error');
      return;
    }

    const eventoMock = TIPOS_EVENTO_MOCK.find(e => e.id === tipoEventoSeleccionado);
    if (!eventoMock) return;

    let diaIndex = -1;
    let turnoIndex = -1;
    for (let i = 0; i < dias.length; i++) {
      const tIdx = dias[i].turnos.findIndex(t => t.id === turnoSeleccionado);
      if (tIdx !== -1) {
        diaIndex = i;
        turnoIndex = tIdx;
        break;
      }
    }

    if (diaIndex === -1) return;

    const nuevosDias = [...dias];
    const turno = nuevosDias[diaIndex].turnos[turnoIndex];
    
    // Validar superposición por duración
    const duracionTurno = aMinutos(turno.horaFin) - aMinutos(turno.horaInicio);
    const duracionOcupada = (turno.eventos || []).reduce((acc, e) => acc + e.duracion, 0);
    const duracionNueva = eventoMock.duracion;

    if (duracionOcupada + duracionNueva > duracionTurno) {
      setResultadoMensaje(`La duración excede el turno y se superpone con el siguiente.`);
      setResultadoTipo('error');
      return;
    }

    if (!turno.eventos) turno.eventos = [];
    
    turno.eventos.push({
      id: `${Date.now()}`,
      nombre: eventoMock.nombre,
      duracion: eventoMock.duracion
    });

    setDias(nuevosDias);
    setResultadoMensaje(`Evento "${eventoMock.nombre}" asignado exitosamente`);
    setResultadoTipo('success');
    setTipoEventoSeleccionado('');
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
    } catch {
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
    } catch {
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
            onToggle={() => handleToggle(index)}
            turnos={d.turnos}
            onAgregarTurno={handleAgregarTurno}
            onEliminarTurno={handleEliminarTurno}
          />
        ))}
      </div>

      {/* ── Asignar Evento a Turno (US04) integrado ── */}
      <div className="mt-8 p-6 bg-white border border-blue-200 rounded-xl shadow-sm text-slate-900">
        <h4 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Asignar Evento a Turno</h4>
        <form onSubmit={handleAsignarEvento} className="space-y-4 max-w-xl">
          <div className="flex flex-col space-y-1">
            <label htmlFor="turnoSeleccionado" className="font-medium text-sm text-gray-700">Seleccionar turno existente:</label>
            <select 
              id="turnoSeleccionado"
              data-cy="select-siguiente-turno"
              value={turnoSeleccionado}
              onChange={(e) => setTurnoSeleccionado(e.target.value)}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Seleccione un turno...</option>
              {dias.filter(d => d.habilitado).map(d => (
                d.turnos.map(t => (
                  <option key={t.id} value={t.id}>
                    {d.diaSemana}: {t.horaInicio} - {t.horaFin}
                  </option>
                ))
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="tipoEvento" className="font-medium text-sm text-gray-700">Tipo de Evento:</label>
            <select 
              id="tipoEvento"
              data-cy="select-tipo-evento"
              value={tipoEventoSeleccionado}
              onChange={(e) => setTipoEventoSeleccionado(e.target.value)}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Seleccione un tipo de evento...</option>
              {TIPOS_EVENTO_MOCK.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} ({e.duracion} min)
                </option>
              ))}
            </select>
          </div>

          {resultadoMensaje && (
            <div 
              data-cy="mensaje-resultado" 
              className={`p-2 rounded text-sm border ${
                resultadoTipo === 'success' 
                  ? 'text-green-700 bg-green-50 border-green-200' 
                  : 'text-red-700 bg-red-50 border-red-200'
              }`}
            >
              {resultadoMensaje}
            </div>
          )}

          <button 
            type="submit"
            data-cy="btn-guardar-evento"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Guardar Evento en Turno
          </button>
        </form>
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
            data-cy="btn-descartar-global"
            onClick={handleDescartarCambios}
            className="px-4 py-2 border border-slate-700 text-slate-300 rounded-lg text-sm font-semibold hover:border-slate-600 hover:bg-slate-800 transition active:scale-95"
          >
            Descartar Cambios
          </button>
          <button
            type="button"
            data-testid="btn-guardar-global"
            data-cy="btn-guardar-global"
            onClick={handleGuardar}
            className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition active:scale-95 shadow-md shadow-green-600/10"
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      {mensaje && (
        <div
          data-testid="mensaje-alerta-global"
          data-cy="mensaje-alerta-global"
          className="text-sm font-semibold p-3 rounded-lg bg-slate-900 text-slate-200 text-center border border-slate-800 shadow"
        >
          {mensaje}
        </div>
      )}

      {/* Modal/Advertencia de Reservas Global */}
      {mostrarAdvertencia && (
        <div
          data-testid="advertencia-reservas-global"
          data-cy="advertencia-reservas-global"
          className="p-5 border border-red-500/20 bg-red-950/20 rounded-xl text-red-200 mt-4 animate-fade-in"
        >
          <p className="text-sm font-medium mb-4">
            Los siguientes días tienen reservas registradas: <strong className="text-red-400">{diasConAdvertencia.join(', ')}</strong>. ¿Desea cancelar los turnos?
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              data-testid="btn-confirmar-cancelar-global"
              data-cy="btn-confirmar-cancelar-global"
              onClick={handleConfirmarCancelar}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-red-700 transition active:scale-95"
            >
              Cancelar Turnos
            </button>
            <button
              type="button"
              data-testid="btn-confirmar-descartar-global"
              data-cy="btn-confirmar-descartar-global"
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