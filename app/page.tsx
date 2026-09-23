'use client';

import { useState } from 'react';
import {
  esFechaValidaParaBloqueo,
  descartarSeleccion,
} from '../services/disponibilidad';

// ─── Datos de ejemplo ────────────────────────────────────────────────────────
const DIAS_CON_RESERVAS: string[] = [
  getFechaRelativa(5),
  getFechaRelativa(8),
];

function getFechaRelativa(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

function getFechaHoy(): string {
  return new Date().toISOString().slice(0, 10);
}

const NOMBRES_MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];
const NOMBRES_DIAS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

// ─── Componente ──────────────────────────────────────────────────────────────
export default function GestionDisponibilidad() {
  // --- Estados: Configurar Horario Laboral ---
  const [dia, setDia] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [errorHorario, setErrorHorario] = useState('');
  const [exitoHorario, setExitoHorario] = useState('');

  // --- Estados: Bloquear Día ---
  const [errorBloqueo, setErrorBloqueo] = useState('');
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [diasBloqueados, setDiasBloqueados] = useState<string[]>([]);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');

  // --- Estado: navegación del calendario ---
  const ahora = new Date();
  const [mesVista, setMesVista] = useState(
    new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  );

  // --- Manejadores: Horario ---
  const handleGuardarHorario = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorHorario('');
    setExitoHorario('');
    if (!dia || !horaInicio || !horaFin) {
      setErrorHorario('Todos los campos son obligatorios');
      return;
    }
    setExitoHorario('Horario guardado exitosamente');
    setDia('');
    setHoraInicio('');
    setHoraFin('');
  };

  // --- Manejador: click en día del calendario ---
  const handleClickDia = (fechaStr: string) => {
    setErrorBloqueo('');
    setMensajeConfirmacion('');
    const tieneReservas = DIAS_CON_RESERVAS.includes(fechaStr);
    const resultado = esFechaValidaParaBloqueo(fechaStr, tieneReservas, getFechaHoy());

    if (resultado.estado === 'ERROR') {
      setErrorBloqueo('No se pueden bloquear fechas pasadas ni el día de hoy.');
      return;
    }
    if (resultado.estado === 'REQUIERE_REAGENDAMIENTO') {
      const confirmar = window.confirm(
        `El día ${fechaStr} tiene turnos reservados.\n¿Desea reagendarlos antes de bloquear este día?`
      );
      if (confirmar) window.location.href = resultado.urlRedireccion;
      return;
    }
    setDiasSeleccionados((prev) =>
      prev.includes(fechaStr) ? prev : [...prev, fechaStr]
    );
  };

  // --- Manejador: Confirmar ---
  const handleGuardar = () => {
    if (diasSeleccionados.length === 0) return;
    setDiasBloqueados((prev) => [...prev, ...diasSeleccionados]);
    setDiasSeleccionados([]);
    setMensajeConfirmacion(`Se bloquearon ${diasSeleccionados.length} día(s) exitosamente.`);
  };

  // --- Manejador: Descartar ---
  const handleDescartar = () => {
    setDiasSeleccionados(descartarSeleccion(diasSeleccionados));
    setMensajeConfirmacion('');
    setErrorBloqueo('');
  };

  // --- Lógica del calendario ---
  const anio = mesVista.getFullYear();
  const mes  = mesVista.getMonth();
  const primerDia  = new Date(anio, mes, 1);
  const ultimoDia  = new Date(anio, mes + 1, 0);
  const offset     = (primerDia.getDay() + 6) % 7; // lunes = 0
  const totalCeldas = Math.ceil((offset + ultimoDia.getDate()) / 7) * 7;
  const celdas = Array.from({ length: totalCeldas });
  const hoyStr = getFechaHoy();

  const toStr = (d: number) =>
    `${anio}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-2xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Módulo de Gestión de Disponibilidad
        </h1>

        {/* ── SECCIÓN 1: CONFIGURAR HORARIO LABORAL ── */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">1. Configurar horario laboral</h2>
          <form onSubmit={handleGuardarHorario} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="diaSemana" className="font-medium text-sm text-gray-700">Día de la semana:</label>
              <select id="diaSemana" data-cy="select-dia" value={dia}
                onChange={(e) => setDia(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Seleccione un día...</option>
                {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label htmlFor="horaInicio" className="font-medium text-sm text-gray-700">Hora de inicio:</label>
                <input type="time" id="horaInicio" data-cy="input-hora-inicio" value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col space-y-1">
                <label htmlFor="horaFin" className="font-medium text-sm text-gray-700">Hora de fin:</label>
                <input type="time" id="horaFin" data-cy="input-hora-fin" value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            {errorHorario && (
              <div data-cy="mensaje-error-horario" className="text-red-600 bg-red-50 border border-red-200 p-2 rounded text-sm">{errorHorario}</div>
            )}
            {exitoHorario && (
              <div data-cy="mensaje-exito-horario" className="text-green-600 bg-green-50 border border-green-200 p-2 rounded text-sm">{exitoHorario}</div>
            )}
            <button type="submit" data-cy="btn-guardar-horario"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Guardar Horario
            </button>
          </form>
        </section>

        {/* ── SECCIÓN 2: BLOQUEAR UN DÍA ── */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-5 border-b pb-2">2. Bloquear un día</h2>

          {/* ── MINI CALENDARIO ── */}
          <div className="mb-4 select-none">

            {/* Navegación mes */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setMesVista(new Date(anio, mes - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-xl">
                ‹
              </button>
              <span className="font-semibold text-gray-700 text-sm tracking-wide">
                {NOMBRES_MESES[mes]} {anio}
              </span>
              <button
                onClick={() => setMesVista(new Date(anio, mes + 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-xl">
                ›
              </button>
            </div>

            {/* Encabezado días semana */}
            <div className="grid grid-cols-7 mb-1">
              {NOMBRES_DIAS.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Grilla de días */}
            <div className="grid grid-cols-7 gap-y-1">
              {celdas.map((_, i) => {
                const diaNum = i - offset + 1;
                if (diaNum < 1 || diaNum > ultimoDia.getDate()) {
                  return <div key={i} />;
                }

                const fechaStr      = toStr(diaNum);
                const esPasadoOHoy  = fechaStr <= hoyStr;
                const esHoy         = fechaStr === hoyStr;
                const tieneReserva  = DIAS_CON_RESERVAS.includes(fechaStr);
                const estaBloqueado = diasBloqueados.includes(fechaStr);
                const estaSeleccionado = diasSeleccionados.includes(fechaStr);

                let cls = 'relative flex flex-col items-center justify-center h-9 rounded-lg text-sm transition-colors ';
                if (estaBloqueado) {
                  cls += 'bg-red-50 text-red-300 cursor-not-allowed';
                } else if (estaSeleccionado) {
                  cls += 'bg-blue-500 text-white cursor-pointer shadow-sm';
                } else if (esHoy) {
                  cls += 'border-2 border-blue-400 text-blue-600 font-semibold cursor-not-allowed';
                } else if (esPasadoOHoy) {
                  cls += 'text-gray-300 cursor-not-allowed';
                } else {
                  cls += 'hover:bg-orange-50 hover:text-orange-600 text-gray-700 cursor-pointer font-medium';
                }

                return (
                  <button
                    key={i}
                    data-cy={!esPasadoOHoy && !estaBloqueado ? 'dia-futuro-15' : 'dia-pasado'}
                    disabled={esPasadoOHoy || estaBloqueado}
                    onClick={() => handleClickDia(fechaStr)}
                    className={cls}
                    title={tieneReserva ? 'Tiene turnos — requiere reagendamiento' : undefined}
                  >
                    <span className="leading-none">{diaNum}</span>

                    {/* Puntito naranja: tiene turnos */}
                    {tieneReserva && !estaBloqueado && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-400" />
                    )}
                    {/* Puntito rojo: bloqueado */}
                    {estaBloqueado && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Leyenda */}
            <div className="flex gap-5 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                Tiene turnos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                Bloqueado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-blue-500 flex-shrink-0" />
                Seleccionado
              </span>
            </div>
          </div>

          {/* Error */}
          {errorBloqueo && (
            <div data-cy="mensaje-error-bloqueo"
              className="text-red-600 bg-red-50 border border-red-200 p-2 rounded text-sm mb-3">
              {errorBloqueo}
            </div>
          )}

          {/* Selección temporal */}
          {diasSeleccionados.length > 0 && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
              <p className="font-medium text-blue-800 mb-2">Días seleccionados (sin guardar):</p>
              <ul className="list-disc list-inside text-blue-700 mb-3">
                {diasSeleccionados.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <div className="flex gap-3">
                <button onClick={handleGuardar} data-cy="btn-guardar"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  Confirmar bloqueo
                </button>
                <button onClick={handleDescartar} data-cy="btn-descartar"
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded transition-colors">
                  Descartar cambios
                </button>
              </div>
            </div>
          )}

          {/* Confirmación */}
          {mensajeConfirmacion && (
            <div data-cy="mensaje-confirmacion"
              className="mt-3 text-green-600 bg-green-50 border border-green-200 p-3 rounded text-sm">
              {mensajeConfirmacion}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
