/// <reference types="cypress" />

describe('US_008: Visualización de calendario público (Componente Visualización de Calendario)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Debería mostrar la sección de visualización de calendario como componente enumerado', () => {
    cy.contains('h2', '6. Visualización de calendario (US_008)').should('be.visible');
    cy.get('[data-cy="dia-15"]').should('be.visible');
    cy.get('[data-cy="dia-15"]').should('be.enabled');
  });

  it('Debería permitir seleccionar un día con turnos disponibles (CP-008-01)', () => {
    // Act: el día 15 está disponible, hacemos click
    cy.get('[data-cy="dia-15"]').click();

    // Assert: aparece el mensaje de confirmación de la selección
    cy.get('[data-cy="mensaje-seleccion"]')
      .should('be.visible')
      .and('contain', 'Has seleccionado el día 15');
  });

  it('No debería permitir seleccionar un día sin turnos disponibles (CP-008-02)', () => {
    // Arrange: el día 20 no tiene turnos configurados
    const diaNoDisponible = cy.get('[data-cy="dia-20"]');

    // Act: intentamos hacer click sobre el día no disponible
    diaNoDisponible.click({ force: true });

    // Assert: el día está deshabilitado y no aparece mensaje de selección
    diaNoDisponible.should('be.disabled');
    cy.get('[data-cy="mensaje-seleccion"]').should('not.exist');
  });
});