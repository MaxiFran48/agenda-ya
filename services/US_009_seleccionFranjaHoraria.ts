export interface TurnoOcupado {
  inicio: string; // Formato "HH:MM"
  fin: string;    // Formato "HH:MM"
}

/**
 * Verifica si una franja de inicio permite completar el evento antes de un choque o del cierre.
 */
export function esFranjaValida(
  inicio: string, 
  duracion: number, 
  turnosOcupados: TurnoOcupado[], 
  horaCierre: string
): boolean {
  const [hInicio, mInicio] = inicio.split(':').map(Number);
  const totalMinutosInicio = hInicio * 60 + mInicio;
  const totalMinutosFin = totalMinutosInicio + duracion;

  const [hCierre, mCierre] = horaCierre.split(':').map(Number);
  const totalMinutosCierre = hCierre * 60 + mCierre;

  // ESCENARIO 2: Omitir si excede el horario de cierre
  if (totalMinutosFin > totalMinutosCierre) {
    return false;
  }

  // ESCENARIO 2: Evitar solapamientos con turnos ocupados
  for (const turno of turnosOcupados) {
    const [hOcupadoInicio, mOcupadoInicio] = turno.inicio.split(':').map(Number);
    const [hOcupadoFin, mOcupadoFin] = turno.fin.split(':').map(Number);
    
    const minutosOcupadoInicio = hOcupadoInicio * 60 + mOcupadoInicio;
    const minutosOcupadoFin = hOcupadoFin * 60 + mOcupadoFin;

    if (
      (totalMinutosInicio >= minutosOcupadoInicio && totalMinutosInicio < minutosOcupadoFin) ||
      (totalMinutosFin > minutosOcupadoInicio && totalMinutosFin <= minutosOcupadoFin) ||
      (totalMinutosInicio <= minutosOcupadoInicio && totalMinutosFin >= minutosOcupadoFin)
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Filtra las franjas horarias. Si no queda ninguna continua, el día no estará disponible.
 */
export function obtenerFranjasDisponibles(
  bloquesDelDia: string[], 
  duracion: number, 
  turnosOcupados: TurnoOcupado[], 
  horaCierre: string
): string[] {
  return bloquesDelDia.filter(horaInicio => 
    esFranjaValida(horaInicio, duracion, turnosOcupados, horaCierre)
  );
}
