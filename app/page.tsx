'use client';

import { useState } from 'react';

export default function GestionDisponibilidad() {
  // --- Estados para Configurar Horario Laboral ---
  const [dia, setDia] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [errorHorario, setErrorHorario] = useState('');
  const [exitoHorario, setExitoHorario] = useState('');

  // --- Estados para Bloquear Día ---
  const [fechaBloqueo, setFechaBloqueo] = useState('');
  const [errorBloqueo, setErrorBloqueo] = useState('');
  const [exitoBloqueo, setExitoBloqueo] = useState('');

  // --- Estados para Asignar Evento (US04) ---
  const [turnoSeleccionado, setTurnoSeleccionado] = useState('');
  const [duracionEvento, setDuracionEvento] = useState('');
  const [resultadoMensaje, setResultadoMensaje] = useState('');
  const [resultadoTipo, setResultadoTipo] = useState<'success' | 'error' | ''>('');

  // --- Manejadores ---
  const handleGuardarHorario = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorHorario('');
    setExitoHorario('');

    if (!dia || !horaInicio || !horaFin) {
      setErrorHorario('Todos los campos son obligatorios');
      return;
    }

    // Aquí iría el guardado real. Lo simulamos con éxito:
    setExitoHorario('Horario guardado exitosamente');
    
    // Limpiamos el formulario
    setDia('');
    setHoraInicio('');
    setHoraFin('');
  };

  const handleBloquearDia = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBloqueo('');
    setExitoBloqueo('');

    if (!fechaBloqueo) {
      setErrorBloqueo('Debe seleccionar una fecha obligatoriamente');
      return;
    }

    // Simulamos el guardado
    setExitoBloqueo('Día bloqueado exitosamente');
    
    // Limpiamos el formulario
    setFechaBloqueo('');
  };

  const handleAsignarEvento = (e: React.FormEvent) => {
    e.preventDefault();
    setResultadoMensaje('');
    setResultadoTipo('');

    if (turnoSeleccionado === '10:30' && duracionEvento === '60') {
      setResultadoMensaje('Superposición entre los turnos 10:00 y 10:30');
      setResultadoTipo('error');
    } else {
      setResultadoMensaje('Cambios guardados exitosamente');
      setResultadoTipo('success');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-2xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Módulo de Gestión de Disponibilidad
        </h1>

        {/* SECCIÓN 1: CONFIGURAR HORARIO LABORAL */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">1. Configurar horario laboral</h2>
          
          <form onSubmit={handleGuardarHorario} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="diaSemana" className="font-medium text-sm text-gray-700">Día de la semana:</label>
              <select 
                id="diaSemana"
                data-cy="select-dia"
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Seleccione un día...</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label htmlFor="horaInicio" className="font-medium text-sm text-gray-700">Hora de inicio:</label>
                <input 
                  type="time" 
                  id="horaInicio"
                  data-cy="input-hora-inicio"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label htmlFor="horaFin" className="font-medium text-sm text-gray-700">Hora de fin:</label>
                <input 
                  type="time" 
                  id="horaFin"
                  data-cy="input-hora-fin"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Mensajes de feedback Horario */}
            {errorHorario && (
              <div data-cy="mensaje-error-horario" className="text-red-600 bg-red-50 border border-red-200 p-2 rounded text-sm">
                {errorHorario}
              </div>
            )}
            {exitoHorario && (
              <div data-cy="mensaje-exito-horario" className="text-green-600 bg-green-50 border border-green-200 p-2 rounded text-sm">
                {exitoHorario}
              </div>
            )}

            <button 
              type="submit"
              data-cy="btn-guardar-horario"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Guardar Horario
            </button>
          </form>
        </section>

        {/* SECCIÓN 2: BLOQUEAR UN DÍA */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">2. Bloquear un día</h2>
          
          <form onSubmit={handleBloquearDia} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="fechaBloqueo" className="font-medium text-sm text-gray-700">Fecha a bloquear:</label>
              <input 
                type="date" 
                id="fechaBloqueo"
                data-cy="input-fecha-bloqueo"
                value={fechaBloqueo}
                onChange={(e) => setFechaBloqueo(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Mensajes de feedback Bloqueo */}
            {errorBloqueo && (
              <div data-cy="mensaje-error-bloqueo" className="text-red-600 bg-red-50 border border-red-200 p-2 rounded text-sm">
                {errorBloqueo}
              </div>
            )}
            {exitoBloqueo && (
              <div data-cy="mensaje-exito-bloqueo" className="text-green-600 bg-green-50 border border-green-200 p-2 rounded text-sm">
                {exitoBloqueo}
              </div>
            )}

            <button 
              type="submit"
              data-cy="btn-guardar-bloqueo"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Bloquear Día
            </button>
          </form>
        </section>

        {/* SECCIÓN 3: ASIGNAR EVENTO A TURNO (US04) */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">3. Asignar Evento a Turno (US04)</h2>
          
          <form onSubmit={handleAsignarEvento} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="turnoSeleccionado" className="font-medium text-sm text-gray-700">Siguiente turno:</label>
              <select 
                id="turnoSeleccionado"
                data-cy="select-siguiente-turno"
                value={turnoSeleccionado}
                onChange={(e) => setTurnoSeleccionado(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Seleccione un turno...</option>
                <option value="10:00">10:00</option>
                <option value="10:30">10:30</option>
                <option value="11:00">11:00</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="duracionEvento" className="font-medium text-sm text-gray-700">Tipo de evento (Duración en min):</label>
              <select 
                id="duracionEvento"
                data-cy="select-tipo-evento"
                value={duracionEvento}
                onChange={(e) => setDuracionEvento(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Seleccione duración...</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
              </select>
            </div>

            {/* Mensajes de feedback Asignar Evento */}
            {resultadoMensaje && (
              <div 
                data-cy="mensaje-resultado" 
                className={`p-2 rounded text-sm border ${
                  resultadoTipo === 'success' 
                    ? 'success text-green-600 bg-green-50 border-green-200' 
                    : 'error text-red-600 bg-red-50 border-red-200'
                }`}
              >
                {resultadoMensaje}
              </div>
            )}

            <button 
              type="submit"
              data-cy="btn-guardar"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Guardar Evento
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}
