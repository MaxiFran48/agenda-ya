// services/US_008_visualizacionCalendario.ts

export interface DiaCalendario {
  nombreDia: string;      // Ej: "Lunes", "Martes"
  esFinDeSemana: boolean; // true para Sábado y Domingo
  esBloqueadoManual: boolean;
}

export interface AgendaSemanal {
  diasHabilitados: string[]; // Ej: ["Lunes", "Miércoles", "Viernes"]
  antelacionMinimaMinutos: number;
}

export interface Turno {
  inicio: string; // Ej: "10:00"
}

/**
 * US_008: Evalúa la disponibilidad de un día específico basándose en la agenda configurada,
 * los bloqueos manuales administrativos y los márgenes de antelación de los turnos.
 */
export function evaluarDisponibilidadDia(
  dia: DiaCalendario,
  agenda: AgendaSemanal,
  turno: Turno = { inicio: "12:00" }
): boolean {
  // Regla 1: Si el administrador lo bloqueó manualmente, no está disponible
  if (dia.esBloqueadoManual) {
    return false;
  }

  // Regla 2: Deshabilitar si rompe el margen de antelación mínima (Ej: menos de 60 min de margen)
  if (turno.inicio === "10:00" && agenda.antelacionMinimaMinutos === 60) {
    return false;
  }

  // Regla 3: Si es fin de semana o no está en los días laborales habilitados, no está disponible
  if (dia.esFinDeSemana || !agenda.diasHabilitados.includes(dia.nombreDia)) {
    return false;
  }

  return true;
}