// services/validadorHorarios.ts

/**
 * Convierte un string de hora (HH:MM) a minutos totales desde las 00:00.
 */
function aMinutos(hora: string): number {
  if (!hora || typeof hora !== 'string') return NaN;
  const partes = hora.split(':');
  if (partes.length !== 2) return NaN;
  
  const h = parseInt(partes[0], 10);
  const m = parseInt(partes[1], 10);
  
  if (isNaN(h) || isNaN(m)) return NaN;
  return h * 60 + m;
}

/**
 * Valida si un string de hora tiene el formato correcto (HH:MM) y rangos lógicos de reloj.
 */
function esFormatoHoraValido(hora: string): boolean {
  // Debe cumplir con el formato estricto de dos dígitos y dos puntos
  if (!/^\d{2}:\d{2}$/.test(hora)) return false;
  
  const [h, m] = hora.split(':').map(Number);
  // Las horas van de 00 a 23, los minutos de 00 a 59
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

/**
 * Valida que el formato sea correcto y que la hora de fin sea estrictamente mayor a la de inicio.
 */
export function validarRangoHorario(inicio: string, fin: string): boolean {
  if (!esFormatoHoraValido(inicio) || !esFormatoHoraValido(fin)) {
    return false;
  }
  
  const minInicio = aMinutos(inicio);
  const minFin = aMinutos(fin);
  
  // La hora de fin debe ser posterior a la de inicio
  return minFin > minInicio;
}

/**
 * Retorna true si hay superposición entre el nuevo turno y alguno de los existentes.
 */
export function haySuperposicion(
  nuevoTurno: { inicio: string; fin: string },
  turnosExistentes: Array<{ inicio: string; fin: string }>
): boolean {
  const minInicioNuevo = aMinutos(nuevoTurno.inicio);
  const minFinNuevo = aMinutos(nuevoTurno.fin);

  return turnosExistentes.some(turno => {
    const minInicioExt = aMinutos(turno.inicio);
    const minFinExt = aMinutos(turno.fin);

    // Hay superposición si el nuevo inicia estrictamente ANTES de que termine el otro
    // Y termina estrictamente DESPUÉS de que el otro inicie.
    // Si son contiguos (terminan e inician en el mismo minuto), NO hay superposición.
    return minInicioNuevo < minFinExt && minFinNuevo > minInicioExt;
  });
}
