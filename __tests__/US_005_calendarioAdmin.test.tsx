

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalendarioAdmin from '../components/US_005_calendarioAdmin';
import { guardarBloqueos } from '../services/persistenciaEstadoDia';

// Mockeamos el servicio para no pegarle a una base de datos real durante el test
jest.mock('../services/persistenciaEstadoDia');

// Mockeamos useRouter de Next.js
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

describe('US_005: Seleccionar días para bloquearlos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Escenario 1: Intentar interactuar con fechas pasadas', () => {
    render(<CalendarioAdmin fechaActual={new Date('2026-06-17')} />);
    
    // Buscamos el día pasado (10 de junio)
    const fechaPasada = screen.getByTestId('dia-2026-06-10');
    
    // Verificamos que tenga la clase visual de bloqueado
    expect(fechaPasada).toHaveClass('sombreado-bloqueado');
    
    // Intentamos hacer click y verificamos que no cambie a estado seleccionado
    fireEvent.click(fechaPasada);
    expect(fechaPasada).not.toHaveClass('seleccionado');
  });

  test('Escenario 2: Bloqueo de días sin reservas de turnos', async () => {
    // Simulamos que el guardado en la API es exitoso
    (guardarBloqueos as jest.Mock).mockResolvedValueOnce(true);
    
    render(<CalendarioAdmin fechaActual={new Date('2026-06-17')} reservas={[]} />);
    
    // Seleccionamos un día futuro (20 de junio)
    const diaFuturo = screen.getByTestId('dia-2026-06-20');
    fireEvent.click(diaFuturo);
    
    // Presionamos el botón de guardar
    const botonGuardar = screen.getByText('Guardar');
    fireEvent.click(botonGuardar);
    
    // Esperamos y verificamos el mensaje de éxito y el cambio de estilo
    const mensajeConfirmacion = await screen.findByText('Día bloqueado exitosamente');
    expect(mensajeConfirmacion).toBeInTheDocument();
    expect(diaFuturo).toHaveClass('estilo-bloqueado');
  });

  test('Escenario 3: Descarte de cambios', () => {
    render(<CalendarioAdmin fechaActual={new Date('2026-06-17')} />);
    
    // Seleccionamos un día futuro (25 de junio)
    const diaFuturo = screen.getByTestId('dia-2026-06-25');
    fireEvent.click(diaFuturo);
    expect(diaFuturo).toHaveClass('seleccionado-para-bloquear');
    
    // Presionamos el botón de descartar
    const botonDescartar = screen.getByText('Descartar');
    fireEvent.click(botonDescartar);
    
    // Verificamos que aparezca la advertencia
    const mensajeAdvertencia = screen.getByText('¿Está seguro de descartar los cambios?');
    expect(mensajeAdvertencia).toBeInTheDocument();
    
    // Confirmamos el descarte
    const confirmarDescarte = screen.getByText('Confirmar Descarte');
    fireEvent.click(confirmarDescarte);
    
    // Verificamos que el día vuelva a su estado original
    expect(diaFuturo).not.toHaveClass('seleccionado-para-bloquear');
    expect(diaFuturo).not.toHaveClass('estilo-bloqueado');
  });

  test('Escenario 4: Bloqueo de día con turnos reservados (CP-005-03) - Continuar', () => {
    // Simulamos que hay reservas
    const reservasSimuladas = [{ id: 1, hora: '10:00', cliente: 'Juan' }];
    render(<CalendarioAdmin fechaActual={new Date('2026-06-17')} reservas={reservasSimuladas} />);
    
    // Seleccionamos un día futuro (20 de junio)
    const diaFuturo = screen.getByTestId('dia-2026-06-20');
    fireEvent.click(diaFuturo);
    
    // Presionamos el botón de guardar
    const botonGuardar = screen.getByText('Guardar');
    fireEvent.click(botonGuardar);
    
    // Verificamos que aparezca la advertencia de reservas
    const modalAdvertencia = screen.getByTestId('modal-advertencia-reservas');
    expect(modalAdvertencia).toBeInTheDocument();
    expect(screen.getByText('Este día contiene turnos reservados. Si continúa, deberá reagendar los turnos. ¿Desea continuar?')).toBeInTheDocument();
    
    // Confirmamos continuar
    const botonContinuar = screen.getByText('Continuar');
    fireEvent.click(botonContinuar);
    
    // Verificamos redirección a /us_006
    expect(mockPush).toHaveBeenCalledWith('/us_006');
    // Verificamos que el modal se cierre
    expect(screen.queryByTestId('modal-advertencia-reservas')).not.toBeInTheDocument();
    // Verificamos que no se bloquea directamente
    expect(guardarBloqueos).not.toHaveBeenCalled();
    expect(diaFuturo).not.toHaveClass('estilo-bloqueado');
  });

  test('Escenario 5: Bloqueo de día con turnos reservados - Cancelar', () => {
    // Simulamos que hay reservas
    const reservasSimuladas = [{ id: 1, hora: '10:00', cliente: 'Juan' }];
    render(<CalendarioAdmin fechaActual={new Date('2026-06-17')} reservas={reservasSimuladas} />);
    
    // Seleccionamos un día futuro (20 de junio)
    const diaFuturo = screen.getByTestId('dia-2026-06-20');
    fireEvent.click(diaFuturo);
    
    // Presionamos el botón de guardar
    const botonGuardar = screen.getByText('Guardar');
    fireEvent.click(botonGuardar);
    
    // Verificamos que aparezca la advertencia de reservas
    const modalAdvertencia = screen.getByTestId('modal-advertencia-reservas');
    expect(modalAdvertencia).toBeInTheDocument();
    
    // Cancelamos
    const botonCancelar = screen.getByText('Cancelar');
    fireEvent.click(botonCancelar);
    
    // Verificamos que el modal se cierre
    expect(screen.queryByTestId('modal-advertencia-reservas')).not.toBeInTheDocument();
    // Verificamos que no haya redirección
    expect(mockPush).not.toHaveBeenCalled();
    // Verificamos que no se bloquea directamente
    expect(guardarBloqueos).not.toHaveBeenCalled();
  });

});