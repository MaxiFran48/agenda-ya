export interface Turno {
  id: string;
  disponible: boolean;
}

export interface EstadoSesion {
  idTurnoSeleccionado: string | null;
  confirmadoTemporal: boolean;
  fechaConfirmacionMs: number | null;
}

// escenario 1
export function evaluarEstadoBoton(turno: Turno | null): boolean {
  return turno ? turno.disponible : false;
}

// escenario 2
export function confirmarTurnoTemporal(turno: Turno, sesion: EstadoSesion): EstadoSesion {
  if (!turno.disponible) {
    throw new Error("El turno acaba de ser tomado por otro usuario");
  }
  return {
    ...sesion,
    idTurnoSeleccionado: turno.id,
    confirmadoTemporal: true,
    fechaConfirmacionMs: Date.now(),
  };
}

// escenario 3
export function verificarExpiracionReserva(
  sesion: EstadoSesion,
  tiempoMaximoMs: number = 10 * 60 * 1000
): { sesion: EstadoSesion; liberarTurno: boolean } {
  if (!sesion.fechaConfirmacionMs) {
    return { sesion, liberarTurno: false };
  }

  const tiempoTranscurrido = Date.now() - sesion.fechaConfirmacionMs;
  if (tiempoTranscurrido > tiempoMaximoMs) {
    return {
      sesion: {
        idTurnoSeleccionado: null,
        confirmadoTemporal: false,
        fechaConfirmacionMs: null,
      },
      liberarTurno: true,
    };
  }

  return { sesion, liberarTurno: false };
}