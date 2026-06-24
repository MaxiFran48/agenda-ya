'use client';

import React, { useState } from 'react';
import ConfiguracionSemanal from '../components/US_001_configuracionSemanal';
import CalendarioAdmin from '../components/US_005_calendarioAdmin';

export default function Home() {
  const [selectedUs, setSelectedUs] = useState<'us001' | 'us005' | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setSelectedUs(null)} 
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              AY
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                AgendaYA
              </h1>
              <p className="text-xs text-slate-400 font-medium">Ingeniería y Calidad de Software</p>
            </div>
          </button>
          {selectedUs && (
            <button
              onClick={() => setSelectedUs(null)}
              className="text-sm font-semibold text-slate-400 hover:text-slate-100 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all"
            >
              &larr; Volver al panel
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        {selectedUs === null ? (
          // Grid view of User Stories
          <div className="flex flex-col gap-10">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Historias de Usuario del Proyecto
              </h2>
              <p className="text-slate-400 text-lg">
                Selecciona una funcionalidad para interactuar con su componente y ver su comportamiento.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
              {/* Recuadro US_001 */}
              <button
                onClick={() => setSelectedUs('us001')}
                className="group text-left p-8 rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Épica: CONF_AGENDA
                  </span>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-blue-400 transition-colors">
                    5 SP
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                  US_001: Deshabilitar/habilitar días de trabajo
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Como administrador, quiero deshabilitar o habilitar un día de la semana, de modo que pueda gestionar la configuración de turnos de un día sin tener que crearlos desde cero o borrarlos.
                </p>
                <span className="mt-auto text-xs font-semibold text-blue-500 group-hover:text-blue-400 flex items-center gap-1.5">
                  Ver funcionalidad &rarr;
                </span>
              </button>

              {/* Recuadro US_005 */}
              <button
                onClick={() => setSelectedUs('us005')}
                className="group text-left p-8 rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 flex flex-col gap-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    Épica: BLOQ_DIAS
                  </span>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-violet-400 transition-colors">
                    3/5 SP
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-violet-400 transition-colors">
                  US_005: Seleccionar días para bloquearlos
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Como administrador, permite seleccionar fechas en el calendario para bloquearlas. Incluye reglas de bloqueo sobre fechas pasadas y confirmación al descartar cambios.
                </p>
                <span className="mt-auto text-xs font-semibold text-violet-500 group-hover:text-violet-400 flex items-center gap-1.5">
                  Ver funcionalidad &rarr;
                </span>
              </button>
            </div>
          </div>
        ) : (
          // Simplified Detail View for US Functionality
          <div className={`flex flex-col items-center gap-6 mx-auto w-full animate-fade-in ${selectedUs === 'us001' ? 'max-w-6xl' : 'max-w-xl'}`}>
            {/* Small ID Badge above the component */}
            <div className="text-center">
              <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-900 border border-slate-800 text-blue-400 font-mono tracking-wider shadow-md">
                {selectedUs.toUpperCase().replace('US', 'US_')}
              </span>
            </div>

            {/* Interactive component container */}
            <div className="w-full bg-slate-900/40 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-lg">
              {selectedUs === 'us001' ? (
                <ConfiguracionSemanal />
              ) : (
                <div className="flex justify-center w-full">
                  <div className="text-slate-800 p-6 bg-white rounded-lg shadow-md w-full max-w-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Calendario de Administración</h3>
                    <CalendarioAdmin fechaActual={new Date('2026-06-17')} />
                  </div>
                </div>
              )}
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
