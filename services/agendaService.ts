export interface Turno {
    id?: number;
    horaInicio: string;
}

export interface Reserva {
    id?: number;
    idTurno: number;
    tipoEvento: string;
    estado: string;
}

/**
 * Verifica si agregar un tipo de evento a un turno provoca que este se superponga con el siguiente.
 * * VÍNCULO CON CRITERIOS DE ACEPTACIÓN:
 * - US_004 - ESCENARIO 1: Retorna false si no hay conflicto, permitiendo el guardado directo.
 * - US_004 - ESCENARIO 2: Detecta matemáticamente la colisión horaria basada en la duración máxima.
 */
export function verificarSuperposicionEvento(turnoActual: Turno, duracionNuevoEventoMinutos: number, proximoTurno: Turno | null): boolean {
    if (!turnoActual || !duracionNuevoEventoMinutos || !proximoTurno) return false;

    // Convertir hora de inicio del turno actual a minutos totales desde las 00:00
    const [horasActual, minutosActual] = turnoActual.horaInicio.split(':').map(Number);
    const tiempoInicioActualMin = (horasActual * 60) + minutosActual;
    
    // Calcular el final teórico del turno sumando la duración máxima del nuevo evento
    const tiempoFinTeoricoMin = tiempoInicioActualMin + duracionNuevoEventoMinutos;

    // Convertir hora de inicio del próximo turno a minutos totales
    const [horasProximo, minutosProximo] = proximoTurno.horaInicio.split(':').map(Number);
    const tiempoInicioProximoMin = (horasProximo * 60) + minutosProximo;

    // Si el final teórico invade el inicio del próximo turno, existe superposición
    return tiempoFinTeoricoMin > tiempoInicioProximoMin;
}

/**
 * Filtra y devuelve las reservas activas asociadas a un tipo de evento específico en un turno dado.
 * * VÍNCULO CON CRITERIOS DE ACEPTACIÓN:
 * - US_004 - ESCENARIO 3: Identifica los turnos a cancelar del tipo de evento inhabilitado.
 * - US_004 - ESCENARIO 4: Verifica si existen reservas antes de disparar la advertencia.
 * - US_004 - ESCENARIO 5: Comprueba que el resultado sea un arreglo vacío para proceder sin alertas.
 */
export function obtenerReservasPorTipoEvento(idTurno: number, tipoEvento: string, reservasActivas: Reserva[]): Reserva[] {
    if (!idTurno || !tipoEvento || !Array.isArray(reservasActivas)) return [];
    return reservasActivas.filter(
        reserva => reserva.idTurno === idTurno && 
                   reserva.tipoEvento.toLowerCase() === tipoEvento.toLowerCase() && 
                   reserva.estado === 'Activa'
    );
}

/**
 * Cancela masivamente las reservas vinculadas a un tipo de evento en un turno específico.
 * * VÍNCULO CON CRITERIOS DE ACEPTACIÓN:
 * - US_004 - ESCENARIO 3: Setea el estado a 'Cancelada' en la base de datos simulada.
 */
export function cancelarReservasPorTipoEvento(idTurno: number, tipoEvento: string, todasLasReservas: Reserva[]): Reserva[] {
    if (!Array.isArray(todasLasReservas)) return [];
    return todasLasReservas.map(reserva => {
        if (reserva.idTurno === idTurno && reserva.tipoEvento.toLowerCase() === tipoEvento.toLowerCase()) {
            return { ...reserva, estado: 'Cancelada' };
        }
        return reserva;
    });
}
