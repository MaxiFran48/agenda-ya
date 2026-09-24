describe('US_005: Seleccionar días para bloquearlos (Componente Gestión de Disponibilidad)', () => {
  beforeEach(() => {
    // Arrange: Visitar la página y asegurar que el calendario está visible
    cy.visit('/');
    cy.get('button[data-cy^="dia-202"]').should('have.length.greaterThan', 0);
  });

  it('No debería permitir interactuar con una fecha pasada', () => {
    // Arrange: Buscar el primer día pasado renderizado
    // Act: (En este caso no hay acción explícita posible porque está deshabilitado)
    // Assert: Verificar que el botón esté deshabilitado
    cy.get('button[data-cy^="dia-pasado-"]').first().should('be.disabled');
  });

  it('Debería bloquear un día futuro sin reservas al confirmar', () => {
    // Arrange: Identificar un día futuro que no tenga reservas asociadas
    cy.get('button[data-cy^="dia-202"]:not([title])')
      .first()
      .then(($btn) => {
        const numeroDia = $btn.text().trim();

        // Act: Hacer click en la fecha y luego confirmar el bloqueo
        cy.wrap($btn).click();
        cy.get('[data-cy="btn-guardar"]').should('be.visible').click();

        // Assert: Validar la aparición del mensaje de éxito y el cambio de estado de la fecha
        cy.get('[data-cy="mensaje-confirmacion"]').should('be.visible');
        cy.get(`button[data-cy="dia-pasado-${numeroDia}"]`).should('be.disabled');
      });
  });

  it('Debería descartar los cambios sin aplicar el bloqueo', () => {
    // Arrange: Identificar y capturar el estado original de un día futuro
    cy.get('button[data-cy^="dia-202"]:not([title])')
      .first()
      .then(($btn) => {
        const dataCy = $btn.attr('data-cy');

        // Act: Seleccionar la fecha y posteriormente descartar el cambio
        cy.wrap($btn).click();
        cy.get('[data-cy="btn-descartar"]').should('be.visible').click();

        // Assert: Validar que los controles desaparezcan y el botón retome su estado original
        cy.get('[data-cy="mensaje-confirmacion"]').should('not.exist');
        cy.get('[data-cy="btn-guardar"]').should('not.exist');
        cy.get(`button[data-cy="${dataCy}"]`).should('not.be.disabled');
      });
  });
});