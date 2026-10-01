import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfiguracionSemanal from '../components/US_001_configuracionSemanal';
import { guardarEstadoDia } from '../services/persistenciaEstadoDia';

// Mock del servicio de API
jest.mock('../services/persistenciaEstadoDia');

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

  test('Escenario 5: Guardado sin cambios pendientes, el día vuelve a su estado original (Martes)', async () => {
    // Arrange: preparar el estado inicial
    render(<ConfiguracionSemanal />);

    const contenedorMartes = screen.getByTestId('dia-contenedor-martes');
    const checkboxMartes = screen.getByTestId('dia-checkbox-martes');
    expect(contenedorMartes).toHaveClass('bg-white');
    expect(checkboxMartes).toBeChecked();

    // Act: ejecutar la acción principal
    // Se deshabilita Martes y luego se vuelve a habilitar, dejando el día
    // igual que en el estado guardado (no queda ningún cambio pendiente).
    fireEvent.click(checkboxMartes);
    expect(checkboxMartes).not.toBeChecked();
    expect(contenedorMartes).toHaveClass('bg-gray-200');

    fireEvent.click(checkboxMartes);
    expect(checkboxMartes).toBeChecked();
    expect(contenedorMartes).toHaveClass('bg-white');

    // Se intenta guardar sin cambios reales.
    fireEvent.click(screen.getByTestId('btn-guardar-global'));

    // Assert: verificar el resultado esperado
    // No se dispara la API porque no hay diferencias contra el estado guardado.
    await waitFor(() => {
      expect(screen.getByTestId('mensaje-alerta-global')).toHaveTextContent(
        'No hay cambios pendientes'
      );
    });
    expect(guardarEstadoDia).not.toHaveBeenCalled();
  });
});
