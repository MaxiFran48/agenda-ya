describe('US_011: Configuración de Antelación Mínima (Componente Configurar Antelación Mínima)', () => {
  it('Debería configurar y guardar la antelación mínima exitosamente', () => {
    cy.visit('/');
    cy.get('[data-cy="input-antelacion-horas"]').should('have.value', '0');
    cy.get('[data-cy="input-antelacion-horas"]').clear().type('2');
    cy.get('[data-cy="btn-guardar-reglas"]').click();
    cy.get('[data-cy="mensaje-exito"]').should('be.visible').and('contain', 'Regla de antelación guardada exitosamente');
  });
  it('Debería mostrar error si se intenta guardar con el campo vacío', () => {
    cy.visit('/');
    cy.get('[data-cy="input-antelacion-horas"]').clear();
    cy.get('[data-cy="btn-guardar-reglas"]').click();
    cy.get('[data-cy="mensaje-error-antelacion"]').should('be.visible').and('contain', 'Debe ingresar un valor');
    cy.get('[data-cy="mensaje-exito"]').should('not.exist');
  });
});
