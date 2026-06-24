import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfiguracionSemanal from '../components/US_001_configuracionSemanal';
import { guardarEstadoDia } from '../services/US_001_persistenciaEstadoDia';

// Mock del servicio de API
jest.mock('../services/api');

describe('US_001: Deshabilitar/habilitar días de trabajo (Global)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Escenario 1: Habilitación de día (Sábado)', async () => {
    (guardarEstadoDia as jest.Mock).mockResolvedValueOnce(true);

    render(<ConfiguracionSemanal />);

    const contenedorSabado = screen.getByTestId('dia-contenedor-sábado');
    expect(contenedorSabado).toHaveClass('bg-gray-200');

    // Buscamos y marcamos el checkbox de Sábado
    const checkboxSabado = screen.getByTestId('dia-checkbox-sábado');
    expect(checkboxSabado).not.toBeChecked();
    fireEvent.click(checkboxSabado);
    expect(checkboxSabado).toBeChecked();

    // Guardamos cambios globalmente
    const btnGuardarGlobal = screen.getByTestId('btn-guardar-global');
    fireEvent.click(btnGuardarGlobal);

    // Verificaciones
    await waitFor(() => {
      expect(guardarEstadoDia).toHaveBeenCalledWith('Sábado', true, false);
      expect(contenedorSabado).toHaveClass('bg-white');
      expect(screen.getByTestId('mensaje-alerta-global')).toHaveTextContent(
        'Cambios guardados exitosamente'
      );
    });
  });

  test('Escenario 2: Deshabilitación de día sin turnos reservados (Jueves)', async () => {
    (guardarEstadoDia as jest.Mock).mockResolvedValueOnce(true);

    render(<ConfiguracionSemanal />);

    const contenedorJueves = screen.getByTestId('dia-contenedor-jueves');
    expect(contenedorJueves).toHaveClass('bg-white');

    // Desmarcamos el checkbox de Jueves (no tiene reservas)
    const checkboxJueves = screen.getByTestId('dia-checkbox-jueves');
    expect(checkboxJueves).toBeChecked();
    fireEvent.click(checkboxJueves);
    expect(checkboxJueves).not.toBeChecked();

    // Guardamos cambios globalmente
    const btnGuardarGlobal = screen.getByTestId('btn-guardar-global');
    fireEvent.click(btnGuardarGlobal);

    // Verificaciones
    await waitFor(() => {
      expect(guardarEstadoDia).toHaveBeenCalledWith('Jueves', false, false);
      expect(contenedorJueves).toHaveClass('bg-gray-200');
      expect(screen.getByTestId('mensaje-alerta-global')).toHaveTextContent(
        'Cambios guardados exitosamente'
      );
    });
  });

  test('Escenario 3: Deshabilitación de día con turnos reservados, donde se cancelan las reservas (Lunes)', async () => {
    (guardarEstadoDia as jest.Mock).mockResolvedValueOnce(true);

    render(<ConfiguracionSemanal />);

    const contenedorLunes = screen.getByTestId('dia-contenedor-lunes');
    expect(contenedorLunes).toHaveClass('bg-white');

    // Intentamos desmarcar Lunes (tiene reservas)
    const checkboxLunes = screen.getByTestId('dia-checkbox-lunes');
    fireEvent.click(checkboxLunes);

    // Intentamos guardar cambios globalmente
    const btnGuardarGlobal = screen.getByTestId('btn-guardar-global');
    fireEvent.click(btnGuardarGlobal);

    // Debe mostrar la advertencia global y no disparar la API todavía
    const advertenciaGlobal = screen.getByTestId('advertencia-reservas-global');
    expect(advertenciaGlobal).toBeInTheDocument();
    expect(guardarEstadoDia).not.toHaveBeenCalled();

    // Confirmamos cancelar turnos
    const btnConfirmarCancelar = screen.getByTestId('btn-confirmar-cancelar-global');
    fireEvent.click(btnConfirmarCancelar);

    // Verificaciones
    await waitFor(() => {
      expect(guardarEstadoDia).toHaveBeenCalledWith('Lunes', false, true);
      expect(contenedorLunes).toHaveClass('bg-gray-200');
      expect(screen.getByTestId('mensaje-alerta-global')).toHaveTextContent(
        'Reservas para el día Lunes canceladas'
      );
    });
  });

  test('Escenario 4: Deshabilitación de día con turnos reservados, pero se descartan los cambios (Miércoles)', async () => {
    render(<ConfiguracionSemanal />);

    const contenedorMiercoles = screen.getByTestId('dia-contenedor-miércoles');
    expect(contenedorMiercoles).toHaveClass('bg-white');

    // Intentamos desmarcar Miércoles (tiene reservas)
    const checkboxMiercoles = screen.getByTestId('dia-checkbox-miércoles');
    fireEvent.click(checkboxMiercoles);

    // Intentamos guardar cambios globalmente
    const btnGuardarGlobal = screen.getByTestId('btn-guardar-global');
    fireEvent.click(btnGuardarGlobal);

    // Debe mostrar la advertencia global
    const advertenciaGlobal = screen.getByTestId('advertencia-reservas-global');
    expect(advertenciaGlobal).toBeInTheDocument();

    // Descartamos cambios
    const btnConfirmarDescartar = screen.getByTestId('btn-confirmar-descartar-global');
    fireEvent.click(btnConfirmarDescartar);

    // Verificaciones: debe volver al estado activo inicial
    expect(contenedorMiercoles).toHaveClass('bg-white');
    expect(checkboxMiercoles).toBeChecked();
    expect(screen.getByTestId('mensaje-alerta-global')).toHaveTextContent(
      'Cambios descartados'
    );
    expect(guardarEstadoDia).not.toHaveBeenCalled();
  });
});
