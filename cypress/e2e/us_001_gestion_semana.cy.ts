describe('AgendaYA - US_001 - CP-001-01: Habilitación de día para trabajar (Componente GestionSemana)', () => {
  beforeEach(() => {
    // Arrange: preparar el estado inicial
    // Pre-requisito: el usuario administrador está autenticado y los datos de
    // prueba del CP-001-01 están cargados en la grilla semanal de la landing.
    // (La app no posee auth; se asume sesión de administrador iniciada.)
    cy.visit('http://localhost:3000'); // URL local del frontend
  });

  it('Habilita el día "Martes", agrega/elimina turnos y persiste los cambios', () => {
    // Arrange: preparar el estado inicial
    // 1. El dashboard muestra los días: habilitados en blanco y deshabilitados en gris.
    //    Martes inicia deshabilitado (gris) y sin casilla marcada.
    cy.get('[data-cy="dia-contenedor-martes"]').should('have.class', 'bg-gray-200');
    cy.get('[data-cy="dia-checkbox-martes"]').should('not.be.checked');

    // Sanity: Miércoles comienza habilitado (blanco).
    cy.get('[data-cy="dia-contenedor-miércoles"]').should('have.class', 'bg-white');

    // Act: ejecutar la acción principal
    // 2. Click en el checkbox desmarcado del día "Martes":
    //    - Se marca la casilla.
    //    - El recuadro del día pasa a blanco.
    //    - Queda disponible agregar/eliminar turnos del día.
    cy.get('[data-cy="dia-checkbox-martes"]').click();

    // Assert: verificar el resultado esperado
    cy.get('[data-cy="dia-checkbox-martes"]').should('be.checked');
    cy.get('[data-cy="dia-contenedor-martes"]').should('have.class', 'bg-white');
    cy.get('[data-cy="btn-agregar-turno-martes"]').should('be.visible');

    // Act: agregar un turno con horario al día Martes
    cy.get('[data-cy="input-hora-inicio-martes"]').type('09:00');
    cy.get('[data-cy="input-hora-fin-martes"]').type('10:00');
    cy.get('[data-cy="btn-agregar-turno-martes"]').click();

    // Assert: verificar el turno agregado
    cy.get('[data-cy="turno-item-martes"]')
      .should('contain.text', '09:00 - 10:00')
      .and('be.visible');

    // Act: eliminar el turno recién agregado
    cy.get('[data-cy="btn-eliminar-turno-martes"]').click();

    // Assert: verificar que el turno fue eliminado
    cy.get('[data-cy="turno-item-martes"]').should('not.exist');

    // Act: persistir los cambios en "Guardar cambios"
    // 3. Click en "Guardar cambios":
    //    - Se registra la habilitación del día.
    //    - Se muestra el mensaje "Cambios guardados exitosamente".
    cy.get('[data-cy="btn-guardar-global"]').click();

    // Assert: verificar el resultado esperado
    cy.get('[data-cy="mensaje-alerta-global"]').should(
      'contain.text',
      'Cambios guardados exitosamente'
    );

    // Assert: post-condiciones, Martes quedó marcado y en blanco
    cy.get('[data-cy="dia-checkbox-martes"]').should('be.checked');
    cy.get('[data-cy="dia-contenedor-martes"]').should('have.class', 'bg-white');
  });
});