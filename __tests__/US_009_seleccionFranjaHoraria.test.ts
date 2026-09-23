import { esFranjaValida, obtenerFranjasDisponibles, TurnoOcupado } from '../services/US_009_seleccionFranjaHoraria';

describe('US_009: Selección de franja horaria (M04-R02F)', () => {
  const horaCierre = "18:00";

  // =========================================================================
  // CASO DE PRUEBA 1: ÉXITO [V] (CP-009-01)
  // Selección de franja válida sin solapamientos
  // =========================================================================
  test('CP-009-01 [V]: Debería admitir franjas válidas continuas y descartar solapamientos directos', () => {
    const duracionEvento = 45;
    const turnosOcupados: TurnoOcupado[] = [
      { inicio: "10:00", fin: "11:00" }
    ];

    // 09:00 a 09:45 finaliza antes de las 10:00 -> Válido
    const franjaValida = esFranjaValida("09:00", duracionEvento, turnosOcupados, horaCierre);
    expect(franjaValida).toBe(true);

    // 09:30 a 10:15 colisiona con el turno de las 10:00 -> Inválido
    const franjaInvalida = esFranjaValida("09:30", duracionEvento, turnosOcupados, horaCierre);
    expect(franjaInvalida).toBe(false);
  });

  // =========================================================================
  // CASO DE PRUEBA 2: FRACASO [F] (CP-009-02)
  // Descarte por fragmentación insuficiente
  // =========================================================================
  test('CP-009-02 [F]: Debería descartar todas las franjas (inhabilitar día) si los bloques libres no son continuos', () => {
    const duracionEvento = 60; // Requiere 60 min continuos
    // Dos bloques separados de 30 min (09:00 a 09:30 y 10:00 a 10:30)
    const bloquesFragmentados = ["09:00", "10:00"];
    const turnosOcupados: TurnoOcupado[] = [
      { inicio: "09:30", fin: "10:00" }
    ];

    const resultado = obtenerFranjasDisponibles(bloquesFragmentados, duracionEvento, turnosOcupados, horaCierre);

    // Al no haber bloque continuo de 60 min, la lista queda vacía
    expect(resultado).toEqual([]);
    expect(resultado.length).toBe(0);
  });

  // =========================================================================
  // CASO DE PRUEBA 3: ÉXITO [V] (CP-009-03)
  // Selección exitosa en un hueco intermedio exacto entre dos reservas
  // =========================================================================
  test('CP-009-03 [V]: Debería permitir seleccionar un horario libre ubicado exactamente entre dos turnos ocupados', () => {
    const duracionEvento = 60;
    const turnosOcupados: TurnoOcupado[] = [
      { inicio: "09:00", fin: "10:00" },
      { inicio: "11:00", fin: "12:00" }
    ];
    const bloquesDelDia = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"];

    const disponibles = obtenerFranjasDisponibles(bloquesDelDia, duracionEvento, turnosOcupados, horaCierre);

    // 10:00 a 11:00 es un bloque continuo libre entre las dos citas -> debe estar disponible
    expect(disponibles).toContain("10:00");
    // Los horarios que colisionan con las reservas existentes no deben estar disponibles
    expect(disponibles).not.toContain("09:00");
    expect(disponibles).not.toContain("09:30");
    expect(disponibles).not.toContain("10:30");
    expect(disponibles).not.toContain("11:00");
  });

  // =========================================================================
  // CASO DE PRUEBA 4: FRACASO [F] (CP-009-04)
  // Descarte de horario por exceder la hora de cierre
  // =========================================================================
  test('CP-009-04 [F]: Debería rechazar e invalidar un horario cuyo tiempo de ejecución sobrepase la hora de cierre', () => {
    const duracionEvento = 45;

    // 17:30 + 45 min finaliza a las 18:15 (supera el cierre fijado a las 18:00) -> Inválido
    const franjaExcedida = esFranjaValida("17:30", duracionEvento, [], horaCierre);
    expect(franjaExcedida).toBe(false);
  });

  // =========================================================================
  // CASO DE PRUEBA 5: ÉXITO [V] (CP-009-05)
  // Aceptación de franja límite que termina en punto en el horario de cierre
  // =========================================================================
  test('CP-009-05 [V]: Debería aceptar como válida la franja horaria que finaliza exactamente en el límite del horario de cierre', () => {
    const duracionEvento = 60;

    // 17:00 + 60 min finaliza exactamente a las 18:00 (límite exacto de cierre) -> Válido
    const franjaLimiteValida = esFranjaValida("17:00", duracionEvento, [], horaCierre);
    expect(franjaLimiteValida).toBe(true);

    const bloquesTarde = ["16:30", "17:00", "17:30"];
    const disponiblesTarde = obtenerFranjasDisponibles(bloquesTarde, duracionEvento, [], horaCierre);

    expect(disponiblesTarde).toContain("17:00");
    expect(disponiblesTarde).not.toContain("17:30");
  });
});
