import { esFranjaValida, obtenerFranjasDisponibles, TurnoOcupado } from '../services/US_009_seleccionFranjaHoraria';

describe('US_009: Selección de franja horaria - Pruebas Unitarias', () => {
  const horaCierre = "18:00";

  // PRUEBA 1 (Conversación PO y Escenario 1): Descartar día si las horas libres no son continuas
  test('Debería descartar las franjas si los bloques libres no son continuos para la duración total', () => {
    const duracionEvento = 60; // Requiere bloque continuo de 60 min
    const turnosOcupados: TurnoOcupado[] = [
      { inicio: "09:30", fin: "10:00" } // Corta el rango en dos bloques de 30 min libres
    ];

    const resultado = obtenerFranjasDisponibles(["09:00", "10:00"], duracionEvento, turnosOcupados, horaCierre);
    expect(resultado).toEqual([]); // El arreglo queda vacío, inhabilitando el día
  });

  // PRUEBA 2 (Escenario 2): Omitir inicios que se solapen con turnos existentes
  test('Debería omitir las franjas horarias que se solapen con turnos ya ocupados', () => {
    const duracionEvento = 45; 
    const turnosOcupados: TurnoOcupado[] = [
      { inicio: "10:00", fin: "11:00" }
    ];

    const franjaInvalida = esFranjaValida("09:30", duracionEvento, turnosOcupados, horaCierre);
    expect(franjaInvalida).toBe(false);

    const franjaValida = esFranjaValida("09:00", duracionEvento, turnosOcupados, horaCierre);
    expect(franjaValida).toBe(true);
  });

  // PRUEBA 3 (Escenario 2): Deshabilitar inicios que excedan la hora de cierre
  test('Debería deshabilitar las franjas horarias que excedan el horario de cierre', () => {
    const duracionEvento = 45; 
    
    const franjaLimiteInvalida = esFranjaValida("17:30", duracionEvento, [], horaCierre);
    expect(franjaLimiteInvalida).toBe(false);

    const franjaLimiteValida = esFranjaValida("16:00", duracionEvento, [], horaCierre);
    expect(franjaLimiteValida).toBe(true);
  });
});
