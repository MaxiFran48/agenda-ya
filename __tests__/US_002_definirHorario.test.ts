import { haySuperposicion, validarRangoHorario } from '../services/validadorHorarios';

describe('US_002: Definir horario de turno y validar superposición (Lógica Pura)', () => {

  // Test 1 (Caso Normal - Sin conflicto)
  it('Debería retornar false cuando los turnos están claramente distantes', () => {
    const nuevoTurno = { inicio: '14:00', fin: '15:00' };
    const turnosExistentes = [
      { inicio: '09:00', fin: '10:00' },
      { inicio: '17:00', fin: '18:00' }
    ];
    
    // Act & Assert
    expect(haySuperposicion(nuevoTurno, turnosExistentes)).toBe(false);
  });

  // Test 2 (Caso de Error - Superposición parcial)
  it('Debería retornar true cuando el nuevo turno choca con otro', () => {
    const nuevoTurno = { inicio: '09:30', fin: '10:30' };
    const turnosExistentes = [
      { inicio: '09:00', fin: '10:00' } // Superposición de 09:30 a 10:00
    ];
    
    // Act & Assert
    expect(haySuperposicion(nuevoTurno, turnosExistentes)).toBe(true);
  });

  // Test 3 (Caso Borde - Turnos contiguos)
  it('Debería retornar false cuando los turnos son contiguos (termina y empieza en el mismo minuto)', () => {
    const nuevoTurno = { inicio: '10:00', fin: '11:00' };
    const turnosExistentes = [
      { inicio: '09:00', fin: '10:00' } // Termina exactamente a las 10:00
    ];
    
    // Act & Assert
    expect(haySuperposicion(nuevoTurno, turnosExistentes)).toBe(false);
  });

  // Test 4 (Caso Inválido - Incoherencia cronológica)
  it('Debería retornar false si la hora de fin es anterior o igual a la de inicio', () => {
    // Hora fin igual a inicio
    expect(validarRangoHorario('10:00', '10:00')).toBe(false);
    
    // Hora fin menor a inicio
    expect(validarRangoHorario('11:00', '10:00')).toBe(false);
  });

  // Test 5 (Caso Borde / Formato inválido)
  it('Debería aceptar límites correctos del día y rechazar valores imposibles o mal formateados', () => {
    // Límite correcto de final de día
    expect(validarRangoHorario('23:00', '23:59')).toBe(true);
    
    // Horas inexistentes (fuera del reloj 24hs)
    expect(validarRangoHorario('25:00', '26:00')).toBe(false);
    
    // Minutos imposibles (> 59)
    expect(validarRangoHorario('10:00', '10:60')).toBe(false);
    
    // Strings vacíos
    expect(validarRangoHorario('', '')).toBe(false);
    
    // Formato erróneo de strings sin el padding (0) inicial
    expect(validarRangoHorario('9:0', '10:00')).toBe(false); 
  });

});
