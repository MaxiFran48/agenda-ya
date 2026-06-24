
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalendarioAdmin from '../components/US_005_calendarioAdmin';
import { guardarBloqueos } from '../services/persistenciaEstadoDia';

// Mockeamos el servicio para no pegarle a una base de datos real durante el test
jest.mock('../services/persistenciaEstadoDia');

describe('US_005: Seleccionar días para bloquearlos', () => {

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

});