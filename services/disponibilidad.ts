/**
 * Servicio de disponibilidad.
 * Contiene la lógica de negocio pura para la historia de usuario
 * "Seleccionar días para bloquearlos".
 *
 * Todas las funciones son puras: no tienen efectos secundarios
 * ni dependen de estado global.
 */

/** Expresión regular para validar exactamente el formato 'YYYY-MM-DD'. */
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

// ─── Tipos de retorno ─────────────────────────────────────────────────────────

export interface ResultadoExito {
  estado: 'EXITO';
}

export interface ResultadoRequiereReagendamiento {
  estado: 'REQUIERE_REAGENDAMIENTO';
  urlRedireccion: '/reagendar-turnos';
}

export interface ResultadoError {
  estado: 'ERROR';
}

export type ResultadoBloqueo =
  | ResultadoExito
  | ResultadoRequiereReagendamiento
  | ResultadoError;

// ─── Funciones ────────────────────────────────────────────────────────────────

/**
 * Evalúa si una fecha puede ser bloqueada y devuelve el resultado
 * correspondiente sin acoplar lógica de UI.
 *
 * @param fecha        - Fecha candidata en formato 'YYYY-MM-DD'.
 * @param tieneReservas - Indica si el día ya tiene reservas asociadas.
 * @param fechaActual  - Fecha de referencia ("hoy") en formato 'YYYY-MM-DD'.
 *                       Se recibe como parámetro para mantener la función pura.
 * @returns
 *   - `{ estado: 'EXITO' }` si la fecha es futura y sin reservas.
 *   - `{ estado: 'REQUIERE_REAGENDAMIENTO', urlRedireccion: '/reagendar-turnos' }`
 *     si la fecha es futura pero tiene reservas (el frontend debe preguntar
 *     al usuario si desea reagendarlos y, en caso afirmativo, redirigir).
 *   - `{ estado: 'ERROR' }` si la fecha es pasada, es hoy, tiene formato
 *     inválido o no existe en el calendario.
 */
export function esFechaValidaParaBloqueo(
  fecha: string,
  tieneReservas: boolean,
  fechaActual: string,
): ResultadoBloqueo {
  // 1. Validar formato mediante regex
  if (!FORMATO_FECHA.test(fecha)) {
    return { estado: 'ERROR' };
  }

  // 2. Validar que la fecha exista realmente en el calendario
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const dateObj = new Date(anio, mes - 1, dia);

  if (
    dateObj.getFullYear() !== anio ||
    dateObj.getMonth() !== mes - 1 ||
    dateObj.getDate() !== dia
  ) {
    return { estado: 'ERROR' };
  }

  // 3. Fecha pasada o hoy → ERROR
  if (fecha <= fechaActual) {
    return { estado: 'ERROR' };
  }

  // 4. Fecha futura con reservas o sin reservas → éxito (permite selección temporal)
  return { estado: 'EXITO' };
}

/**
 * Descarta la selección temporal de días, retornando un array vacío.
 * Función pura: no muta el array original.
 *
 * @param diasSeleccionados - Array de fechas seleccionadas temporalmente.
 * @returns Un nuevo array vacío `[]`.
 */
export function descartarSeleccion(diasSeleccionados: string[]): string[] {
  void diasSeleccionados;
  return [];
}

/**
 * Valida si un turno cumple con la antelación mínima requerida.
 */
export function validarVentanaAntelacion(horaTurno: string, horaActual: string, antelacionMinimaHoras: number): boolean {
  if (!horaTurno || !horaActual) {
    throw new Error('Parámetros de horario inválidos');
  }
  const turno = new Date(horaTurno);
  const actual = new Date(horaActual);
  if (isNaN(turno.getTime()) || isNaN(actual.getTime())) {
    throw new Error('Parámetros de horario inválidos');
  }
  const diferenciaMilisegundos = turno.getTime() - actual.getTime();
  if (diferenciaMilisegundos < 0) return false;
  const diferenciaMinutos = Math.floor(diferenciaMilisegundos / 1000 / 60);
  return diferenciaMinutos >= (antelacionMinimaHoras * 60);
}
