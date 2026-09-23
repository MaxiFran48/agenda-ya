import React, { useState } from 'react';
import { procesarConfirmacionBloqueo, Turno } from '../services/logicaBloqueo';

export default function GestionBloqueos() {
  const diaHardcodeado = '20/06/2026';
  const turnosIniciales: Turno[] = [
    { id: 1, horario: '10:00', estado: 'Activo' },
    { id: 2, horario: '11:00', estado: 'Activo' },
  ];

  const [diaActivo, setDiaActivo] = useState<string | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>(turnosIniciales);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>('');

  const seleccionarDia = () => {
    // Al hacer click en el día, se "selecciona"
    setDiaActivo(diaHardcodeado);
    setMensaje('');
  };

  const handleGuardar = () => {
    if (diaActivo === diaHardcodeado) {
      // Abre modal de advertencia al intentar guardar con turnos existentes
      setModalAbierto(true);
    }
  };

  const confirmarBloqueo = () => {
    const resultado = procesarConfirmacionBloqueo(diaHardcodeado, turnos, true);
    setTurnos(resultado.turnos);
    setMensaje(resultado.mensaje);
    setModalAbierto(false);
  };

  const cancelarBloqueo = () => {
    const resultado = procesarConfirmacionBloqueo(diaHardcodeado, turnos, false);
    // El sistema permanece sin cambios (turnos intactos)
    setTurnos(resultado.turnos);
    setMensaje('');
    setModalAbierto(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>AgendaYA - Gestión de Bloqueos</h1>
      
      {/* Mensaje de confirmación o error */}
      {mensaje && (
        <div data-cy="mensaje-estado" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#d4edda', color: '#155724' }}>
          {mensaje}
        </div>
      )}

      {/* Calendario simulado */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div 
          data-cy={`dia-${diaHardcodeado.replace(/\//g, '-')}`} 
          onClick={seleccionarDia}
          style={{ 
            border: diaActivo === diaHardcodeado ? '2px solid blue' : '1px solid gray', 
            padding: '20px', 
            cursor: 'pointer',
            backgroundColor: '#f9f9f9'
          }}
        >
          {diaHardcodeado}
        </div>
      </div>

      {/* Lista de turnos */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Turnos del día:</h3>
        <ul data-cy="lista-turnos">
          {turnos.map(t => (
            <li key={t.id} data-cy={`turno-${t.id}`}>
              {t.horario} - Estado: <span data-cy={`estado-turno-${t.id}`}>{t.estado}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón de guardado general */}
      <button 
        data-cy="btn-guardar" 
        onClick={handleGuardar}
        disabled={!diaActivo}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: diaActivo ? 'pointer' : 'not-allowed' }}
      >
        Guardar
      </button>

      {/* Modal de Advertencia */}
      {modalAbierto && (
        <div 
          data-cy="modal-advertencia"
          style={{
            position: 'fixed',
            top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
        >
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '400px' }}>
            <h2>¡Advertencia!</h2>
            <p>El día seleccionado ya contiene turnos reservados. Si continuas, los turnos serán cancelados. ¿Deseas proceder con el bloqueo?</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button 
                data-cy="btn-abortar-bloqueo" 
                onClick={cancelarBloqueo}
                style={{ padding: '8px 16px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button 
                data-cy="btn-confirmar-bloqueo" 
                onClick={confirmarBloqueo}
                style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: 'red', color: 'white', border: 'none' }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
