import { describe, test, expect } from '@jest/globals';
import {
  evaluarEstadoBoton,
  confirmarTurnoTemporal,
  verificarExpiracionReserva,
  Turno,
  EstadoSesion,
} from "../services/US_010_confirmacionTurno";

describe("Pruebas Unitarias para US_010 - Confirmación de Turno Temporal", () => {
  
  // escenario 1
  test("CP-010-01: Debe cambiar el estado del botón a activo inmediatamente al seleccionar un turno disponible", () => {
    const turnoDisponible: Turno = { id: "slot-10min", disponible: true };
    const botonActivo = evaluarEstadoBoton(turnoDisponible);
    
    expect(botonActivo).toBe(true);
  });

  // escenario 2
  test("CP-010-02: Debe persistir la elección en la sesión y registrar el timestamp al confirmar", () => {
    const turnoDisponible: Turno = { id: "slot-10min", disponible: true };
    const sesionInicial: EstadoSesion = {
      idTurnoSeleccionado: null,
      confirmadoTemporal: false,
      fechaConfirmacionMs: null,
    };

    const sesionActualizada = confirmarTurnoTemporal(turnoDisponible, sesionInicial);

    expect(sesionActualizada.idTurnoSeleccionado).toBe("slot-10min");
    expect(sesionActualizada.confirmadoTemporal).toBe(true);
    expect(sesionActualizada.fechaConfirmacionMs).not.toBeNull();
  });

  test("CP-010-02B: Debe lanzar un error si el turno dejó de estar disponible en el último segundo", () => {
    const turnoOcupado: Turno = { id: "slot-10min", disponible: false };
    const sesionInicial: EstadoSesion = {
      idTurnoSeleccionado: null,
      confirmadoTemporal: false,
      fechaConfirmacionMs: null,
    };

    expect(() => {
      confirmarTurnoTemporal(turnoOcupado, sesionInicial);
    }).toThrow("El turno acaba de ser tomado por otro usuario");
  });

  // escenario 3
  test("CP-010-03: Debe limpiar la sesión y dar la orden de liberar el turno si pasan más de 10 minutos", () => {
    const diezMinutosYUnSegundo = 10 * 60 * 1000 + 1000;
    const sesionExpirada: EstadoSesion = {
      idTurnoSeleccionado: "slot-10min",
      confirmadoTemporal: true,
      fechaConfirmacionMs: Date.now() - diezMinutosYUnSegundo,
    };

    const resultado = verificarExpiracionReserva(sesionExpirada);

    expect(resultado.sesion.idTurnoSeleccionado).toBeNull();
    expect(resultado.sesion.confirmadoTemporal).toBe(false);
    expect(resultado.liberarTurno).toBe(true);
  });
});