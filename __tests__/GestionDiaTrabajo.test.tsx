import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GestionDiaTrabajo from '../components/GestionDiaTrabajo';
import { guardarEstadoDia } from '../services/api';

// Mock del servicio de API
jest.mock('../services/api');

describe('US_001: Deshabilitar/habilitar días de trabajo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Escenario 1: Habilitación de día', async () => {
    (guardarEstadoDia as jest.Mock).mockResolvedValueOnce(true);

    render(
      <GestionDiaTrabajo
        diaSemana="lunes"
        habilitadoInicial={false}
        tieneReservasInicial={false}
      />
    );

    const contenedor = screen.getByTestId('dia-contenedor');
    expect(contenedor).toHaveClass('bg-gray-200');
    expect(screen.queryByTestId('btn-agregar-turno')).not.toBeInTheDocument();

    // Marcamos el checkbox para habilitar
    const checkbox = screen.getByTestId('dia-checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Guardamos los cambios
    const btnGuardar = screen.getByTestId('btn-guardar');
    fireEvent.click(btnGuardar);

    // Verificaciones
    await waitFor(() => {
      expect(guardarEstadoDia).toHaveBeenCalledWith('lunes', true, false);
      expect(contenedor).toHaveClass('bg-white');
      expect(screen.getByTestId('btn-agregar-turno')).toBeInTheDocument();
      expect(screen.getByTestId('mensaje-alerta')).toHaveTextContent(
        'Cambios guardados exitosamente'
      );
    });
  });

  test('Escenario 2: Deshabilitación de día sin turnos reservados', async () => {
    (guardarEstadoDia as jest.Mock).mockResolvedValueOnce(true);

    render(
      <GestionDiaTrabajo
        diaSemana="martes"
        habilitadoInicial={true}
        tieneReservasInicial={false}
      />
    );

    const contenedor = screen.getByTestId('dia-contenedor');
    expect(contenedor).toHaveClass('bg-white');
    expect(screen.getByTestId('btn-agregar-turno')).toBeInTheDocument();

    const turnos = screen.getAllByTestId('turno-item');
    turnos.forEach((turno) => expect(turno).toHaveClass('bg-blue-50'));

    // Desmarcamos el checkbox
    const checkbox = screen.getByTestId('dia-checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    // Guardamos los cambios
    const btnGuardar = screen.getByTestId('btn-guardar');
    fireEvent.click(btnGuardar);

    // Verificaciones
    await waitFor(() => {
      expect(guardarEstadoDia).toHaveBeenCalledWith('martes', false, false);
      expect(contenedor).toHaveClass('bg-gray-200');
      expect(screen.queryByTestId('btn-agregar-turno')).not.toBeInTheDocument();
      turnos.forEach((turno) => expect(turno).toHaveClass('bg-gray-100'));
      expect(screen.getByTestId('mensaje-alerta')).toHaveTextContent(
        'Cambios guardados exitosamente'
      );
    });
  });

  test('Escenario 3: Deshabilitación de día con turnos reservados, donde se cancelan las reservas', async () => {
    (guardarEstadoDia as jest.Mock).mockResolvedValueOnce(true);

    render(
      <GestionDiaTrabajo
        diaSemana="miércoles"
        habilitadoInicial={true}
        tieneReservasInicial={true}
      />
    );

    const contenedor = screen.getByTestId('dia-contenedor');

    // Intentamos deshabilitar
    const checkbox = screen.getByTestId('dia-checkbox');
    fireEvent.click(checkbox);

    // Guardamos
    const btnGuardar = screen.getByTestId('btn-guardar');
    fireEvent.click(btnGuardar);

    // Debe mostrar la advertencia sin llamar a la API todavía
    const advertencia = screen.getByTestId('advertencia-reservas');
    expect(advertencia).toBeInTheDocument();
    expect(guardarEstadoDia).not.toHaveBeenCalled();

    // Elegimos cancelar turnos en el diálogo
    const btnConfirmar = screen.getByTestId('btn-confirmar-cancelar');
    fireEvent.click(btnConfirmar);

    // Verificaciones finales
    await waitFor(() => {
      expect(guardarEstadoDia).toHaveBeenCalledWith('miércoles', false, true);
      expect(contenedor).toHaveClass('bg-gray-200');
      expect(screen.queryByTestId('btn-agregar-turno')).not.toBeInTheDocument();
      expect(screen.getByTestId('mensaje-alerta')).toHaveTextContent(
        'Reservas para el día miércoles canceladas'
      );
    });
  });

  test('Escenario 4: Deshabilitación de día con turnos reservados, pero se descartan los cambios', async () => {
    render(
      <GestionDiaTrabajo
        diaSemana="jueves"
        habilitadoInicial={true}
        tieneReservasInicial={true}
      />
    );

    const contenedor = screen.getByTestId('dia-contenedor');

    // Intentamos deshabilitar
    const checkbox = screen.getByTestId('dia-checkbox');
    fireEvent.click(checkbox);

    // Guardamos
    const btnGuardar = screen.getByTestId('btn-guardar');
    fireEvent.click(btnGuardar);

    // Mostrar advertencia
    const advertencia = screen.getByTestId('advertencia-reservas');
    expect(advertencia).toBeInTheDocument();

    // Elegimos descartar cambios
    const btnDescartar = screen.getByTestId('btn-confirmar-descartar');
    fireEvent.click(btnDescartar);

    // Verificaciones: debe revertir al estado inicial activo
    expect(contenedor).toHaveClass('bg-white');
    expect(checkbox).toBeChecked();
    expect(screen.getByTestId('btn-agregar-turno')).toBeInTheDocument();
    expect(screen.getByTestId('mensaje-alerta')).toHaveTextContent(
      'Cambios descartados'
    );
    expect(guardarEstadoDia).not.toHaveBeenCalled();
  });
});
