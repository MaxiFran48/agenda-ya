// __tests__/US_008_visualizacionCalendario.test.tsx
/* eslint-disable no-undef */
declare const describe: any;
declare const test: any;
declare const expect: any;

import { evaluarDisponibilidadDia, AgendaSemanal, DiaCalendario } from '../services/US_008_visualizacionCalendario';

describe('Pruebas Unitarias para US_008 - Daniel Salomón', () => {

  // ESCENARIO 1: Carga inicial del calendario (Días hábiles vs Fines de semana)
  test('CP-008-01: Debe habilitar días hábiles según la agenda y deshabilitar fines de semana', () => {
    const agendaSemanal: AgendaSemanal = {
      Lunes: true, Martes: true, Miercoles: true, Jueves: true, Viernes: true,
      Sabado: false, Domingo: false
    };
    
    const diaMartes: DiaCalendario = { nombreDia: 'Martes', esBloqueadoManual: false };
    const diaSabado: DiaCalendario = { nombreDia: 'Sabado', esBloqueadoManual: false };

    expect(evaluarDisponibilidadDia(diaMartes, agendaSemanal)).toBe(true);
    expect(evaluarDisponibilidadDia(diaSabado, agendaSemanal)).toBe(false);
  });

  // ESCENARIO 2: Días bloqueados manualmente por el administrador
  test('CP-008-02: Debe deshabilitar un día si el administrador lo configuró como bloqueado', () => {
    const agendaSemanal: AgendaSemanal = { Lunes: true, Martes: true, Miercoles: true };
    const diaJuevesBloqueado: DiaCalendario = { nombreDia: 'Jueves', esBloqueadoManual: true };

    expect(evaluarDisponibilidadDia(diaJuevesBloqueado, agendaSemanal)).toBe(false);
  });

  // ESCENARIO 3: Validación de antelación mínima de reserva
  test('CP-008-03: Debe invalidar el día si los turnos rompen el margen de antelación mínima', () => {
    const agendaSemanal: AgendaSemanal = { Lunes: true };
    const diaActual: DiaCalendario = { nombreDia: 'Lunes', esBloqueadoManual: false };
    const antelacionMinimaMinutos = 120; // 2 horas requeridas
    const turnosDelDia = [{ hora: '11:00' }];
    const horaActual = '10:00'; // Solo hay 60 minutos de margen

    const resultado = evaluarDisponibilidadDia(
      diaActual,
      agendaSemanal,
      turnosDelDia,
      horaActual,
      antelacionMinimaMinutos
    );

    expect(resultado).toBe(false);
  });
});