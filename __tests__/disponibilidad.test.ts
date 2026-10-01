import {
  esFechaValidaParaBloqueo,
  descartarSeleccion,
} from '../services/disponibilidad';

function getFechaRelativa(diasOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + diasOffset);
  return d.toISOString().slice(0, 10);
}

const HOY = getFechaRelativa(0);
const AYER = getFechaRelativa(-1);
const MANANA = getFechaRelativa(5); // Usamos 5 días a futuro para asegurar seguridad

describe('esFechaValidaParaBloqueo', () => {
  // Caso normal: fecha futura sin reservas → EXITO
  test('retorna EXITO para una fecha futura sin reservas', () => {
    expect(esFechaValidaParaBloqueo(MANANA, false, HOY))
      .toEqual({ estado: 'EXITO' });
  });

  // Caso límite: exactamente hoy → ERROR
  test('retorna ERROR cuando la fecha es exactamente hoy', () => {
    expect(esFechaValidaParaBloqueo(HOY, false, HOY))
      .toEqual({ estado: 'ERROR' });
  });

  // Caso límite: fecha pasada → ERROR
  test('retorna ERROR cuando la fecha es anterior a hoy', () => {
    expect(esFechaValidaParaBloqueo(AYER, false, HOY))
      .toEqual({ estado: 'ERROR' });
  });

  // Caso límite: fecha futura con reservas → REQUIERE_REAGENDAMIENTO
  test('retorna REQUIERE_REAGENDAMIENTO para una fecha futura con reservas (flujo CP-006)', () => {
    expect(esFechaValidaParaBloqueo(MANANA, true, HOY))
      .toEqual({ estado: 'REQUIERE_REAGENDAMIENTO', urlRedireccion: '/reagendar-turnos' });
  });

  // Caso inválido: formato incorrecto → ERROR
  test('retorna ERROR cuando el formato es incorrecto', () => {
    expect(esFechaValidaParaBloqueo('20/06/2025', false, HOY))
      .toEqual({ estado: 'ERROR' });
  });

  // Caso inválido: fecha inexistente en el calendario → ERROR
  test('retorna ERROR para una fecha que no existe (30 de febrero)', () => {
    expect(esFechaValidaParaBloqueo('2025-02-30', false, HOY))
      .toEqual({ estado: 'ERROR' });
  });
});

describe('descartarSeleccion', () => {
  test('retorna un array vacío descartando la selección', () => {
    expect(descartarSeleccion([MANANA, getFechaRelativa(6)])).toEqual([]);
  });
});
