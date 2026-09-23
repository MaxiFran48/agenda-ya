import { validarVentanaAntelacion } from '../services/disponibilidad';

describe('AgendaYA - M02: Validación de Antelación Mínima', () => {
  it('Retorna true si el turno inicia 5 horas después de la hora actual y la antelación es de 2 horas', () => {
    expect(validarVentanaAntelacion('2026-09-23T15:00:00Z', '2026-09-23T10:00:00Z', 2)).toBe(true);
  });
  it('Retorna true si la diferencia entre la hora del turno y la actual es exactamente igual a la antelación mínima', () => {
    expect(validarVentanaAntelacion('2026-09-23T12:00:00Z', '2026-09-23T10:00:00Z', 2)).toBe(true);
  });
  it('Retorna false si el turno está a 1 hora y 59 minutos de la hora actual', () => {
    expect(validarVentanaAntelacion('2026-09-23T11:59:00Z', '2026-09-23T10:00:00Z', 2)).toBe(false);
  });
  it('Retorna false si el turno tiene un horario anterior al momento actual', () => {
    expect(validarVentanaAntelacion('2026-09-23T08:00:00Z', '2026-09-23T10:00:00Z', 2)).toBe(false);
  });
  it('Lanza una excepción si alguno de los strings de hora viene vacío o con formato erróneo', () => {
    expect(() => validarVentanaAntelacion('inválido', '2026-09-23T10:00:00Z', 2)).toThrow('Parámetros de horario inválidos');
    expect(() => validarVentanaAntelacion('', '2026-09-23T10:00:00Z', 2)).toThrow('Parámetros de horario inválidos');
  });
});
