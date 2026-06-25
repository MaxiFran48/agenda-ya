import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EliminarTurno from '../components/US_003_eliminarTurno';
import { eliminarTurnoAPI } from '../services/turnos';
import { useRouter } from 'next/navigation';

// Mock del servicio de API
jest.mock('../services/turnos', () => ({
  eliminarTurnoAPI: jest.fn()
}));

// Mock del router de Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('US_003: Eliminar turno', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('Escenario 1: Eliminación de turno sin reservas', async () => {
    (eliminarTurnoAPI as jest.Mock).mockResolvedValueOnce(true);

    const turnoSinReservas = {
      id: '1',
      horario: '10:00 - 11:00',
      tieneReservas: false,
    };

    render(<EliminarTurno turnoInicial={turnoSinReservas} />);

    // El elemento gráfico del turno debe estar visible
    const elementoTurno = screen.getByTestId('turno-elemento');
    expect(elementoTurno).toBeInTheDocument();

    // El administrador elimina el turno
    const btnEliminar = screen.getByTestId('btn-eliminar');
    fireEvent.click(btnEliminar);

    // Verificaciones:
    await waitFor(() => {
      // Guarda los cambios
      expect(eliminarTurnoAPI).toHaveBeenCalledWith('1', false, 'none');
      // El elemento gráfico desaparece
      expect(screen.queryByTestId('turno-elemento')).not.toBeInTheDocument();
      // Se muestra el mensaje "Cambios guardados exitosamente"
      expect(screen.getByTestId('mensaje-alerta')).toHaveTextContent('Cambios guardados exitosamente');
    });
  });

  test('Escenario 2: Eliminación de turno con reservas (Cancelando)', async () => {
    (eliminarTurnoAPI as jest.Mock).mockResolvedValueOnce(true);

    const turnoConReservas = {
      id: '2',
      horario: '14:00 - 15:00',
      tieneReservas: true,
    };

    render(<EliminarTurno turnoInicial={turnoConReservas} />);

    // El elemento gráfico del turno debe estar visible
    expect(screen.getByTestId('turno-elemento')).toBeInTheDocument();

    // El administrador elimina un turno con reservas
    const btnEliminar = screen.getByTestId('btn-eliminar');
    fireEvent.click(btnEliminar);

    // Ante la advertencia
    const advertencia = screen.getByTestId('advertencia-reservas');
    expect(advertencia).toBeInTheDocument();

    // Elige cancelar los turnos
    const btnCancelarReservas = screen.getByTestId('btn-cancelar-reservas');
    fireEvent.click(btnCancelarReservas);

    // Verificaciones:
    await waitFor(() => {
      // Guarda los cambios
      expect(eliminarTurnoAPI).toHaveBeenCalledWith('2', true, 'cancelar');
      
      // El elemento gráfico desaparece
      expect(screen.queryByTestId('turno-elemento')).not.toBeInTheDocument();
      
      // Muestra "Cambios guardados exitosamente" y "Reservas para el día Y canceladas"
      // (En la implementación mock se concatenaron en el mismo mensaje para facilitar el testeo,
      // pero se verifica que ambos textos estén presentes).
      const mensajeAlerta = screen.getByTestId('mensaje-alerta');
      expect(mensajeAlerta.textContent).toContain('Cambios guardados exitosamente');
      expect(mensajeAlerta.textContent).toContain('Reservas para el día Y canceladas');
      
      // Redirige a la funcionalidad de reprogramar turnos
      expect(mockPush).toHaveBeenCalledWith('/reprogramar-turnos');
    });
  });

  test('Escenario 3: Eliminación de turno con reservas (Descartando)', async () => {
    const turnoConReservas = {
      id: '3',
      horario: '16:00 - 17:00',
      tieneReservas: true,
    };

    render(<EliminarTurno turnoInicial={turnoConReservas} />);

    // El elemento gráfico del turno debe estar visible
    const elementoTurno = screen.getByTestId('turno-elemento');
    expect(elementoTurno).toBeInTheDocument();

    // El administrador intenta eliminar
    const btnEliminar = screen.getByTestId('btn-eliminar');
    fireEvent.click(btnEliminar);

    // Ante la advertencia
    const advertencia = screen.getByTestId('advertencia-reservas');
    expect(advertencia).toBeInTheDocument();

    // Elige descartar los cambios
    const btnDescartarCambios = screen.getByTestId('btn-descartar-cambios');
    fireEvent.click(btnDescartarCambios);

    // Verificaciones:
    await waitFor(() => {
      // El elemento gráfico del turno vuelve a aparecer (o se mantiene)
      expect(screen.getByTestId('turno-elemento')).toBeInTheDocument();
      
      // Muestra "Cambios descartados"
      expect(screen.getByTestId('mensaje-alerta')).toHaveTextContent('Cambios descartados');
      
      // No se guarda nada
      expect(eliminarTurnoAPI).not.toHaveBeenCalled();
    });
  });
});
