"use client";

import React, { useState } from 'react';
import { procesarConfirmacionBloqueo, Turno } from '../services/logicaBloqueo';

export default function GestionBloqueos() {
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([
    { id: 1, horario: '10:00', estado: 'Activo' },
    { id: 2, horario: '11:00', estado: 'Activo' }
  ]);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>('');

  const diaEjemplo = '20/06/2026';

  const manejarClickDia = () => {
    setDiaSeleccionado(diaEjemplo);
    setMensaje('');
  };

  const intentarGuardar = () => {
    if (diaSeleccionado === diaEjemplo) {
      setMostrarModal(true);
    }
  };

  const aceptarBloqueo = () => {
    const res = procesarConfirmacionBloqueo(diaEjemplo, turnos, true);
    setTurnos(res.turnos);
    setMensaje(res.mensaje);
    setMostrarModal(false);
  };

  const rechazarBloqueo = () => {
    const res = procesarConfirmacionBloqueo(diaEjemplo, turnos, false);
    setTurnos(res.turnos);
    setMensaje(''); // El spec asume que no hay mensaje si se rechaza
    setMostrarModal(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Gestión de Bloqueos</h1>
      
      {mensaje && (
        <div data-cy="mensaje-estado" style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '20px' }}>
          {mensaje}
        </div>
      )}

      <div 
        data-cy={`dia-20-06-2026`} 
        onClick={manejarClickDia}
        style={{ 
          border: diaSeleccionado === diaEjemplo ? '2px solid blue' : '1px solid gray', 
          padding: '20px', 
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'inline-block'
        }}
      >
        {diaEjemplo}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Turnos:</h3>
        <ul data-cy="lista-turnos">
          {turnos.map(t => (
            <li key={t.id} data-cy={`turno-${t.id}`}>
              {t.horario} - Estado: <strong data-cy={`estado-turno-${t.id}`}>{t.estado}</strong>
            </li>
          ))}
        </ul>
      </div>

      <button 
        data-cy="btn-guardar" 
        onClick={intentarGuardar}
        disabled={!diaSeleccionado}
        style={{ padding: '10px 20px', cursor: diaSeleccionado ? 'pointer' : 'not-allowed' }}
      >
        Guardar Bloqueo
      </button>

      {mostrarModal && (
        <div data-cy="modal-advertencia" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
            <h2>Advertencia</h2>
            <p>Hay turnos reservados. ¿Deseas cancelarlos y bloquear el día?</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button data-cy="btn-abortar-bloqueo" onClick={rechazarBloqueo}>Cancelar</button>
              <button data-cy="btn-confirmar-bloqueo" onClick={aceptarBloqueo} style={{ backgroundColor: 'red', color: 'white' }}>Confirmar Bloqueo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
