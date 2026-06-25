// __tests__/US_008_visualizacionCalendario.test.tsx
import { evaluarDisponibilidadDia, DiaCalendario, AgendaSemanal } from '../services/US_008_visualizacionCalendario';

describe('Pruebas Unitarias para US_008 - Daniel Salomón - CP-008-01: Debe habilitar días hábiles según la agenda y deshabilitar fines de semana', () => {
  const agendaSemanal = (): AgendaSemanal => ({
    diasHabilitados: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    antelacionMinimaMinutos: 30,
  });

  test('Debería habilitar un día laboral común (Martes)', () => {
    const diaLaboral: DiaCalendario = {
      nombreDia: 'Martes',
      esFinDeSemana: false,
      esBloqueadoManual: false,
    };
    expect(evaluarDisponibilidadDia(diaLaboral, agendaSemanal())).toBe(true);
  });

  test('Debería deshabilitar un día de fin de semana (Sábado)', () => {
    const diaFinSemana: DiaCalendario = {
      nombreDia: 'Sábado',
      esFinDeSemana: true,
      esBloqueadoManual: false,
    };
    expect(evaluarDisponibilidadDia(diaFinSemana, agendaSemanal())).toBe(false);
  });
});

describe('Pruebas Unitarias para US_008 - Daniel Salomón - CP-008-02: Debe deshabilitar un día si el administrador lo configuró como bloqueado', () => {
  const agendaSemanal = (): AgendaSemanal => ({
    diasHabilitados: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    antelacionMinimaMinutos: 30,
  });

  test('Debería dar falso si el día está bloqueado manualmente', () => {
    const diaBloqueado: DiaCalendario = {
      nombreDia: 'Jueves',
      esFinDeSemana: false,
      esBloqueadoManual: true,
    };
    expect(evaluarDisponibilidadDia(diaBloqueado, agendaSemanal())).toBe(false);
  });
});

describe('Pruebas Unitarias para US_008 - Daniel Salomón - CP-008-03: Debe invalidar el día si los turnos rompen el margen de antelación mínima', () => {
  const agendaSemanal = (): AgendaSemanal => ({
    diasHabilitados: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    antelacionMinimaMinutos: 60, // Requiere 1 hora de anticipación obligatoria
  });

  test('Debería invalidar el día si el turno está muy encima del límite de antelación', () => {
    const diaActual: DiaCalendario = {
      nombreDia: 'Lunes',
      esFinDeSemana: false,
      esBloqueadoManual: false,
    };
    const turnoCritico = { inicio: '10:00' };

    const resultado = evaluarDisponibilidadDia(diaActual, agendaSemanal(), turnoCritico);
    expect(resultado).toBe(false);
  });
});