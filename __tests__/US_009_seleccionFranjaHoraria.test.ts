import { esFranjaValida, obtenerFranjasDisponibles, TurnoOcupado } from '../services/US_009_seleccionFranjaHoraria';

describe('US_009: Selección de franja horaria (M04-R02F)', () => {
  const horaCierre = "18:00";

  // CASO DE PRUEBA 1: ÉXITO (CP-009-01)
  describe('CP-009-01: Selección de franja horaria válida sin solapamientos', () => {
    test('Debería admitir franjas válidas continuas y rechazar las que colisionen con turnos ocupados', () => {
      const duracionEvento = 45;
      const turnosOcupados: TurnoOcupado[] = [
        { inicio: "10:00", fin: "11:00" }
      ];

      const franjaValida = esFranjaValida("09:00", duracionEvento, turnosOcupados, horaCierre);
      expect(franjaValida).toBe(true);

      const franjaInvalida = esFranjaValida("09:30", duracionEvento, turnosOcupados, horaCierre);
      expect(franjaInvalida).toBe(false);
    });

    test('Debería listar únicamente las franjas de inicio que pueden completarse sin superposición', () => {
      const duracionEvento = 60;
      const turnosOcupados: TurnoOcupado[] = [
        { inicio: "10:00", fin: "11:00" }
      ];
      const bloquesDelDia = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

      const disponibles = obtenerFranjasDisponibles(bloquesDelDia, duracionEvento, turnosOcupados, horaCierre);

      expect(disponibles).toContain("09:00");
      expect(disponibles).toContain("11:00");
      expect(disponibles).not.toContain("09:30");
      expect(disponibles).not.toContain("10:00");
    });
  });

  // CASO DE PRUEBA 2: FRACASO / DESCARTE (CP-009-02)
  describe('CP-009-02: Descarte e inhabilitación de fecha por fragmentación de tiempo insuficiente', () => {
    test('Debería descartar todas las franjas si los bloques libres no son continuos para la duración requerida', () => {
      const duracionEvento = 60;
      const bloquesFragmentados = ["09:00", "10:00"];
      const turnosOcupados: TurnoOcupado[] = [
        { inicio: "09:30", fin: "10:00" }
      ];

      const resultado = obtenerFranjasDisponibles(bloquesFragmentados, duracionEvento, turnosOcupados, horaCierre);

      expect(resultado).toEqual([]);
    });
  });

  // ESCENARIO 3: LÍMITE DE CIERRE
  describe('Escenario 3: Validación del límite de horario de cierre', () => {
    test('Debería deshabilitar las franjas que sobrepasen el horario de cierre', () => {
      const duracionEvento = 45;

      const franjaExcedida = esFranjaValida("17:30", duracionEvento, [], horaCierre);
      expect(franjaExcedida).toBe(false);

      const franjaPermitida = esFranjaValida("17:00", duracionEvento, [], horaCierre);
      expect(franjaPermitida).toBe(true);
    });
  });
});
