export type AccionBloqueo = 'CONFIRMAR' | 'ABORTAR' | 'NINGUNA';

export interface ResultadoConfirmacion {
  exito: boolean;
  mensaje: string;
  estadoTurnos: 'Cancelado' | 'Intacto';
}

export function procesarConfirmacionBloqueo(
  dia: string | null,
  tieneReservas: boolean,
  accion: AccionBloqueo
): ResultadoConfirmacion {
  if (dia === null) {
    return { exito: false, mensaje: 'Error: Día nulo', estadoTurnos: 'Intacto' };
  }

  if (typeof dia !== 'string' || dia.trim() === '') {
    return { exito: false, mensaje: 'Error: Parámetros inválidos', estadoTurnos: 'Intacto' };
  }

  if (!tieneReservas) {
    return { 
      exito: true, 
      mensaje: 'Bloqueo añadido exitosamente', 
      estadoTurnos: 'Intacto' 
    };
  }

  if (accion === 'CONFIRMAR') {
    return { 
      exito: true, 
      mensaje: 'Bloqueo añadido, el mismo se notificará al guardar los cambios', 
      estadoTurnos: 'Cancelado' 
    };
  }

  if (accion === 'ABORTAR') {
    return { 
      exito: false, 
      mensaje: 'Bloqueo abortado', 
      estadoTurnos: 'Intacto' 
    };
  }

  return { exito: false, mensaje: 'Error: Acción inválida', estadoTurnos: 'Intacto' };
}
