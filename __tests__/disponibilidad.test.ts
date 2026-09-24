import {
  esFechaValidaParaBloqueo,
  descartarSeleccion,
} from '../services/disponibilidad';

const HOY = '2025-06-15';

describe('esFechaValidaParaBloqueo', () => {
  // Caso normal: fecha futura sin reservas → EXITO
  test('retorna EXITO para una fecha futura sin reservas', () => {
    expect(esFechaValidaParaBloqueo('2025-06-20', false, HOY))
      .toEqual({ estado: 'EXITO' });
  });

  // Caso límite: exactamente hoy → ERROR
  test('retorna ERROR cuando la fecha es exactamente hoy', () => {
    expect(esFechaValidaParaBloqueo(HOY, false, HOY))
      .toEqual({ estado: 'ERROR' });
  });

  // Caso límite: fecha futura con reservas → REQUIERE_REAGENDAMIENTO
  test('retorna EXITO para una fecha futura con reservas (flujo CP-006)', () => {
    expect(esFechaValidaParaBloqueo('2025-06-20', true, HOY))
      .toEqual({ estado: 'EXITO' });
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
    expect(descartarSeleccion(['2025-06-20', '2025-06-21'])).toEqual([]);
  });
});
