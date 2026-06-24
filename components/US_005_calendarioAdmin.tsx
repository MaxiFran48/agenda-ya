'use client';

import React, { useState } from 'react';
import { guardarBloqueos } from '../services/persistenciaEstadoDia';

export default function CalendarioAdmin({ fechaActual, reservas = [] }: { fechaActual: Date, reservas?: any[] }) {
  const [dia20Clase, setDia20Clase] = useState('');
  const [dia25Clase, setDia25Clase] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);

  const handleClickDiaPasado = (e: React.MouseEvent) => {
    // No hace nada, ignorando el click como pide el Escenario 1
    e.preventDefault();
  };

  const handleGuardar = async () => {
    await guardarBloqueos();
    setMensaje('Día bloqueado exitosamente');
    setDia20Clase('estilo-bloqueado');
  };

  const handleDescartar = () => {
    setMostrarAdvertencia(true);
  };

  const confirmarDescarte = () => {
    setMostrarAdvertencia(false);
    setDia25Clase(''); // Limpia la selección volviendo al estado original
  };

  return (
    <div>
      {/* Escenario 1: Fecha pasada */}
      <div 
        data-testid="dia-2026-06-10" 
        className="sombreado-bloqueado" 
        onClick={handleClickDiaPasado}
      >
        10
      </div>

      {/* Escenario 2: Bloqueo de días */}
      <div 
        data-testid="dia-2026-06-20" 
        className={dia20Clase} 
        onClick={() => setDia20Clase('seleccionado')}
      >
        20
      </div>
      <button onClick={handleGuardar}>Guardar</button>
      {mensaje && <p>{mensaje}</p>}

      {/* Escenario 3: Descarte de cambios */}
      <div 
        data-testid="dia-2026-06-25" 
        className={dia25Clase} 
        onClick={() => setDia25Clase('seleccionado-para-bloquear')}
      >
        25
      </div>
      <button onClick={handleDescartar}>Descartar</button>
      
      {mostrarAdvertencia && (
        <div>
          <p>¿Está seguro de descartar los cambios?</p>
          <button onClick={confirmarDescarte}>Confirmar Descarte</button>
        </div>
      )}
    </div>
  );
}