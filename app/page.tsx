'use client';

import React, { useState } from 'react';
import GestionDiaTrabajo from '../components/GestionDiaTrabajo';
import CalendarioAdmin from '../components/CalendarioAdmin';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'us001' | 'us005'>('us001');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              AY
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                AgendaYA
              </h1>
              <p className="text-xs text-slate-400 font-medium">Ingeniería y Calidad de Software</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('us001')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'us001'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              US_001: Habilitar Días
            </button>
            <button
              onClick={() => setActiveTab('us005')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'us005'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              US_005: Bloquear Fechas
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        {activeTab === 'us001' ? (
          <div className="grid md:grid-cols-12 gap-8 items-start animate-fade-in">
            <div className="md:col-span-5 flex flex-col gap-4">
              <span className="self-start px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Épica: CONF_AGENDA
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                US_001: Deshabilitar/habilitar días de trabajo
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Permite al administrador deshabilitar o habilitar un día de la semana para
                gestionar la configuración de los turnos de manera eficiente, sin necesidad de
                crear o borrar registros desde cero.
              </p>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-sm text-slate-400 flex flex-col gap-2">
                <span className="font-semibold text-slate-200">Criterios de Aceptación Cubiertos:</span>
                <ul className="list-disc pl-5 flex flex-col gap-1 text-xs">
                  <li>Habilitación del día de trabajo (marcado en blanco y con botón de agregar).</li>
                  <li>Deshabilitación de día sin reservas (marcado en gris junto con los turnos).</li>
                  <li>Advertencia interactiva de cancelación en días con reservas.</li>
                  <li>Descarte y reversión de cambios en días con reservas.</li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-7 flex justify-center bg-slate-900/40 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <GestionDiaTrabajo diaSemana="Lunes" tieneReservasInicial={true} />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-12 gap-8 items-start animate-fade-in">
            <div className="md:col-span-5 flex flex-col gap-4">
              <span className="self-start px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                Épica: BLOQ_DIAS
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                US_005: Seleccionar días para bloquearlos
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Permite al administrador bloquear días futuros en el calendario de atención. Evita
                la interacción con fechas pasadas e integra advertencias en caso de descartar cambios
                sobre días seleccionados.
              </p>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-sm text-slate-400 flex flex-col gap-2">
                <span className="font-semibold text-slate-200">Criterios de Aceptación Cubiertos:</span>
                <ul className="list-disc pl-5 flex flex-col gap-1 text-xs">
                  <li>Bloqueo visual y preventivo sobre fechas pasadas.</li>
                  <li>Bloqueo dinámico de fechas futuras sin reservas.</li>
                  <li>Advertencia de confirmación al descartar un bloqueo en edición.</li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-7 flex justify-center bg-slate-900/40 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <div className="text-slate-800 p-6 bg-white rounded-lg shadow-md w-full max-w-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Calendario de Administración</h3>
                <CalendarioAdmin fechaActual={new Date('2026-06-17')} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} UTN - Cátedra de Ingeniería y Calidad de Software.
      </footer>
    </div>
  );
}
