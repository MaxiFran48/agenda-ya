import { procesarConfirmacionBloqueo, Turno } from '../services/logicaBloqueo';

describe('procesarConfirmacionBloqueo', () => {
  const diaPrueba = '20/06/2026';
  const turnosMock: Turno[] = [
    { id: 1, horario: '10:00', estado: 'Activo' },
    { id: 2, horario: '11:00', estado: 'Activo' }
  ];

  it('1) Debe manejar correctamente un día sin reservas', () => {
    const resultado = procesarConfirmacionBloqueo(diaPrueba, [], true);
    
    expect(resultado.exito).toBe(true);
    expect(resultado.turnos).toEqual([]);
    expect(resultado.mensaje).toBe('Día bloqueado exitosamente. No había turnos previos.');
  });

  it('2) Debe cancelar todos los turnos y devolver mensaje de éxito cuando se confirma el bloqueo con reservas', () => {
    const resultado = procesarConfirmacionBloqueo(diaPrueba, turnosMock, true);
    
    expect(resultado.exito).toBe(true);
    expect(resultado.mensaje).toBe('Bloqueo añadido, el mismo se notificará al guardar los cambios');
    expect(resultado.turnos).toHaveLength(2);
    expect(resultado.turnos[0].estado).toBe('Cancelado');
    expect(resultado.turnos[1].estado).toBe('Cancelado');
  });

  it('3) Debe mantener los turnos intactos cuando se aborta el bloqueo', () => {
    const resultado = procesarConfirmacionBloqueo(diaPrueba, turnosMock, false);
    
    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe('Acción cancelada. El día no fue bloqueado.');
    expect(resultado.turnos).toEqual(turnosMock);
  });

  it('4) Debe lanzar un error si el día está vacío, nulo o indefinido', () => {
    expect(() => procesarConfirmacionBloqueo('', turnosMock, true)).toThrow('Parámetros inválidos: el día es obligatorio.');
    expect(() => procesarConfirmacionBloqueo('   ', turnosMock, true)).toThrow('Parámetros inválidos: el día es obligatorio.');
    expect(() => procesarConfirmacionBloqueo(null as any, turnosMock, true)).toThrow('Parámetros inválidos: el día es obligatorio.');
    expect(() => procesarConfirmacionBloqueo(undefined as any, turnosMock, true)).toThrow('Parámetros inválidos: el día es obligatorio.');
  });

  it('5) Debe lanzar un error si turnosExistentes no es un arreglo válido', () => {
    expect(() => procesarConfirmacionBloqueo(diaPrueba, null as any, true)).toThrow('Parámetros inválidos: turnosExistentes debe ser un arreglo.');
    expect(() => procesarConfirmacionBloqueo(diaPrueba, undefined as any, true)).toThrow('Parámetros inválidos: turnosExistentes debe ser un arreglo.');
    expect(() => procesarConfirmacionBloqueo(diaPrueba, {} as any, true)).toThrow('Parámetros inválidos: turnosExistentes debe ser un arreglo.');
  });
});
