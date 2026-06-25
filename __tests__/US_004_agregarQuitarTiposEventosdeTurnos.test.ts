/// <reference types="jest" />
import { verificarSuperposicionEvento, obtenerReservasPorTipoEvento, cancelarReservasPorTipoEvento, Reserva } from '../services/agendaService';

describe("Pruebas Unitarias - US_004: Agregar/quitar tipos de eventos", () => {

    // ESCENARIO 1: Habilitación de tipo de evento (sin superposición)
    test("US_004 - Escenario 1: Debería retornar false (sin conflicto) si la duración del evento no supera el inicio del siguiente turno", () => {
        // 1. ARRANGE
        const turnoActual = { id: 101, horaInicio: "10:00" };
        const duracionNuevoEvento = 20; // 20 minutos. Fin teórico: 10:20
        const proximoTurno = { id: 102, horaInicio: "10:30" }; // No choca

        // 2. ACT
        const resultadoConflictivo = verificarSuperposicionEvento(turnoActual, duracionNuevoEvento, proximoTurno);

        // 3. ASSERT
        // Permite el guardado directo
        expect(resultadoConflictivo).toBe(false);
    });

    // ESCENARIO 2: Habilitación de tipo de evento con superposición
    test("US_004 - Escenario 2: Debería detectar superposición si la duración del evento supera el inicio del siguiente turno", () => {
        // 1. ARRANGE
        const turnoActual = { id: 101, horaInicio: "10:00" };
        const duracionNuevoEvento = 45; // 45 minutos. Fin teórico: 10:45
        const proximoTurno = { id: 102, horaInicio: "10:30" }; // Choca porque inicia antes de las 10:45

        // 2. ACT
        const resultadoConflictivo = verificarSuperposicionEvento(turnoActual, duracionNuevoEvento, proximoTurno);

        // 3. ASSERT
        // Dispara la superposición
        expect(resultadoConflictivo).toBe(true);
    });

    // ESCENARIO 3: Deshabilitación de tipo de evento con reserva, cancelando las mismas.
    test("US_004 - Escenario 3: Debería identificar reservas de un tipo de evento y marcarlas como Canceladas", () => {
        // 1. ARRANGE
        const idTurno = 202;
        const tipoEventoADeshabilitar = "Consulta General";
        const reservasMock: Reserva[] = [
            { id: 1, idTurno: 202, tipoEvento: "Consulta General", estado: "Activa" },
            { id: 2, idTurno: 202, tipoEvento: "Inscripción", estado: "Activa" }
        ];

        // 2. ACT
        // Simulando que el usuario eligió "cancelar las reservas" ante la advertencia
        const reservasAfectadas = obtenerReservasPorTipoEvento(idTurno, tipoEventoADeshabilitar, reservasMock);
        
        // Verificamos que encontró la reserva a cancelar para poder advertir primero
        expect(reservasAfectadas.length).toBe(1);
        expect(reservasAfectadas[0].tipoEvento).toBe("Consulta General");

        // Cancelamos las reservas
        const reservasActualizadas = cancelarReservasPorTipoEvento(idTurno, tipoEventoADeshabilitar, reservasMock);

        // 3. ASSERT
        const reservaCancelada = reservasActualizadas.find(r => r.id === 1);
        const reservaIntacta = reservasActualizadas.find(r => r.id === 2);
        
        expect(reservaCancelada?.estado).toBe("Cancelada"); // Se marcan las reservas como canceladas en la base de datos simulada
        expect(reservaIntacta?.estado).toBe("Activa");
    });

    // ESCENARIO 4: Deshabilitación de tipo de evento con reserva, pero se descartan los cambios.
    test("US_004 - Escenario 4: Debería advertir sobre reservas existentes pero no modificarlas si se descartan los cambios", () => {
        // 1. ARRANGE
        const idTurno = 202;
        const tipoEventoADeshabilitar = "Consulta General";
        const reservasMock: Reserva[] = [
            { id: 1, idTurno: 202, tipoEvento: "Consulta General", estado: "Activa" },
            { id: 2, idTurno: 202, tipoEvento: "Inscripción", estado: "Activa" }
        ];

        // 2. ACT
        const reservasAfectadas = obtenerReservasPorTipoEvento(idTurno, tipoEventoADeshabilitar, reservasMock);
        
        // Simulamos descartar cambios, es decir, NO llamamos a cancelarReservasPorTipoEvento.
        // Las reservas en BD/estado se mantienen igual.

        // 3. ASSERT
        expect(reservasAfectadas.length).toBeGreaterThan(0); // Muestra advertencia porque hay reservas
        
        // Estado original no muta si se descartan los cambios
        const reservaOriginal = reservasMock.find(r => r.id === 1);
        expect(reservaOriginal?.estado).toBe("Activa");
    });

    // ESCENARIO 5: Deshabilitación de tipo de evento sin reservas
    test("US_004 - Escenario 5: Debería confirmar cero conflictos al eliminar un tipo de evento sin reservas", () => {
        // 1. ARRANGE
        const idTurno = 202;
        const tipoEventoAEliminar = "Consulta General";
        const reservasMock: Reserva[] = [
            { id: 1, idTurno: 202, tipoEvento: "Inscripción", estado: "Activa" }, // Otro tipo de evento
            { id: 2, idTurno: 203, tipoEvento: "Consulta General", estado: "Activa" } // Otro turno
        ];

        // 2. ACT
        const reservasEncontradas = obtenerReservasPorTipoEvento(idTurno, tipoEventoAEliminar, reservasMock);

        // 3. ASSERT
        expect(reservasEncontradas.length).toBe(0); // Proceder sin alertas
    });
});
