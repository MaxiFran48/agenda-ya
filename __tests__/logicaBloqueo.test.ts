import { procesarConfirmacionBloqueo } from '../services/logicaBloqueo';

describe('logicaBloqueo', () => {
  it('debería retornar éxito si el día no tiene reservas (día sin reservas)', () => {
    const resultado = procesarConfirmacionBloqueo('2026-06-20', false, 'NINGUNA');
    expect(resultado.exito).toBe(true);
    expect(resultado.mensaje).toBe('Bloqueo añadido exitosamente');
    expect(resultado.estadoTurnos).toBe('Intacto');
  });

  it('debería retornar éxito y cancelar turnos si se confirma (bloqueo con confirmación)', () => {
    const resultado = procesarConfirmacionBloqueo('2026-06-20', true, 'CONFIRMAR');
    expect(resultado.exito).toBe(true);
    expect(resultado.mensaje).toBe('Bloqueo añadido, el mismo se notificará al guardar los cambios');
    expect(resultado.estadoTurnos).toBe('Cancelado');
  });

  it('debería abortar sin éxito y mantener turnos intactos si se aborta (bloqueo abortado)', () => {
    const resultado = procesarConfirmacionBloqueo('2026-06-20', true, 'ABORTAR');
    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe('Bloqueo abortado');
    expect(resultado.estadoTurnos).toBe('Intacto');
  });

  it('debería retornar error para parámetros inválidos (parámetros inválidos)', () => {
    const resultado = procesarConfirmacionBloqueo('', true, 'CONFIRMAR');
    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe('Error: Parámetros inválidos');
    expect(resultado.estadoTurnos).toBe('Intacto');
  });

  it('debería retornar error para día nulo (día nulo)', () => {
    const resultado = procesarConfirmacionBloqueo(null, true, 'CONFIRMAR');
    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe('Error: Día nulo');
    expect(resultado.estadoTurnos).toBe('Intacto');
  });
});
