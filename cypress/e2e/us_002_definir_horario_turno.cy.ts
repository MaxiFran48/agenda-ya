/// <reference types="cypress" />

describe('US_002 - Definir horario de turno y validar superposición', () => {
  beforeEach(() => {
    // Arrange: Entrar a la página principal.
    // Asumimos que el día Miércoles ya viene encendido por defecto (según DIAS_INICIALES).
    cy.visit('http://localhost:3000');
  });

  it('Debería crear un turno correctamente en un día habilitado (Flujo Exitoso)', () => {
    // Arrange: Eliminar el turno precargado del Miércoles para que no haya superposición
    cy.get('[data-cy="btn-eliminar-turno-miércoles"]').click();

    // Arrange: Identificar los inputs del Miércoles
    const inputInicio = cy.get('[data-cy="input-hora-inicio-miércoles"]');
    const inputFin = cy.get('[data-cy="input-hora-fin-miércoles"]');

    // Act: Escribir horas limpiando previamente y hacer clic en agregar
    inputInicio.clear().type('09:00');
    inputFin.clear().type('10:00');
    cy.get('[data-cy="btn-agregar-turno-miércoles"]').click();

    // Assert: Validar que el turno aparece en la lista
    cy.get('[data-cy="turno-item-miércoles"]')
      .should('contain.text', '09:00 - 10:00')
      .and('be.visible');
    
    // Act: Guardar cambios generales
    cy.get('[data-cy="btn-guardar-global"]').click();
    
    // Assert: Validar mensaje global de que la página respondió bien
    cy.get('[data-cy="mensaje-alerta-global"]')
      .should('be.visible')
      .and('contain.text', 'No hay cambios pendientes');
  });

  it('No debería permitir crear un turno que se superponga con otro existente (Flujo de Error)', () => {
    // Arrange: Preparar el estado inicial con un turno válido ya creado
    const inputInicio = cy.get('[data-cy="input-hora-inicio-miércoles"]');
    const inputFin = cy.get('[data-cy="input-hora-fin-miércoles"]');
    
    inputInicio.clear().type('09:00');
    inputFin.clear().type('10:00');
    cy.get('[data-cy="btn-agregar-turno-miércoles"]').click();

    // Act: Intentar agregar un nuevo turno que se superpone con el anterior
    inputInicio.clear().type('09:30');
    inputFin.clear().type('11:00');
    cy.get('[data-cy="btn-agregar-turno-miércoles"]').click();

    // Assert: Validar que el sistema rechaza la superposición
    // 1. El turno no se agrega a la lista (sigue habiendo 1 solo turno)
    cy.get('[data-cy="turno-item-miércoles"]').should('have.length', 1); 
    
    // 2. Aparece el mensaje de error correspondiente
    cy.get('[data-cy="mensaje-error-turno-miércoles"]')
      .should('be.visible')
      .and('contain.text', 'Superposición entre turnos');
  });
});
