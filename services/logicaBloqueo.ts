export interface Turno {
  id: number;
  horario: string;
  estado: 'Activo' | 'Cancelado';
}

export interface ResultadoBloqueo {
  turnos: Turno[];
  mensaje: string;
  exito: boolean;
}

/**
 * Procesa la acción del modal de bloqueo de días.
 * 
 * @param dia - El día que se está intentando bloquear (ej. '20/06/2026').
 * @param turnosExistentes - Arreglo con los turnos del día.
 * @param accionConfirmada - Booleano que indica si el usuario confirmó el bloqueo.
 * @returns ResultadoBloqueo - Un objeto con los turnos actualizados y un mensaje de estado.
 */
export function procesarConfirmacionBloqueo(
  dia: string | null | undefined,
  turnosExistentes: Turno[] | null | undefined,
  accionConfirmada: boolean
): ResultadoBloqueo {
  if (!dia || dia.trim() === '') {
    throw new Error('Parámetros inválidos: el día es obligatorio.');
  }

  if (!Array.isArray(turnosExistentes)) {
    throw new Error('Parámetros inválidos: turnosExistentes debe ser un arreglo.');
  }

  if (turnosExistentes.length === 0) {
    return {
      turnos: [],
      mensaje: 'Día bloqueado exitosamente. No había turnos previos.',
      exito: true
    };
  }

  if (accionConfirmada) {
    const turnosModificados = turnosExistentes.map(turno => ({
      ...turno,
      estado: 'Cancelado' as const
    }));
    return {
      turnos: turnosModificados,
      mensaje: 'Bloqueo añadido, el mismo se notificará al guardar los cambios',
      exito: true
    };
  } else {
    // Si se aborta el bloqueo, los turnos quedan intactos
    return {
      turnos: [...turnosExistentes],
      mensaje: 'Acción cancelada. El día no fue bloqueado.',
      exito: false
    };
  }
}
