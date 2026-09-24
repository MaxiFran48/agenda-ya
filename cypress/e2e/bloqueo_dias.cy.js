describe('Gestión de Bloqueos de Días', () => {
  const baseUrl = '/cp006'; 

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('CP-006-01: Confirmar bloqueo de día con turnos reservados', () => {
    cy.get('[data-cy="dia-20-06-2026"]').should('exist');
    cy.get('[data-cy="estado-turno-1"]').should('have.text', 'Activo');
    cy.get('[data-cy="estado-turno-2"]').should('have.text', 'Activo');

    cy.get('[data-cy="dia-20-06-2026"]').click();
    cy.get('[data-cy="btn-guardar"]').click();
    
    cy.get('[data-cy="modal-advertencia"]').should('be.visible');
    cy.get('[data-cy="btn-confirmar-bloqueo"]').click();

    cy.get('[data-cy="estado-turno-1"]').should('have.text', 'Cancelado');
    cy.get('[data-cy="estado-turno-2"]').should('have.text', 'Cancelado');
    cy.get('[data-cy="mensaje-estado"]').should('have.text', 'Bloqueo añadido, el mismo se notificará al guardar los cambios');
    cy.get('[data-cy="modal-advertencia"]').should('not.exist');
  });

  it('CP-006-02: Abortar bloqueo de día con turnos reservados', () => {
    cy.get('[data-cy="dia-20-06-2026"]').should('exist');
    cy.get('[data-cy="estado-turno-1"]').should('have.text', 'Activo');
    cy.get('[data-cy="estado-turno-2"]').should('have.text', 'Activo');

    cy.get('[data-cy="dia-20-06-2026"]').click();
    cy.get('[data-cy="btn-guardar"]').click();
    
    cy.get('[data-cy="modal-advertencia"]').should('be.visible');
    cy.get('[data-cy="btn-abortar-bloqueo"]').click();

    cy.get('[data-cy="estado-turno-1"]').should('have.text', 'Activo');
    cy.get('[data-cy="estado-turno-2"]').should('have.text', 'Activo');
    cy.get('[data-cy="mensaje-estado"]').should('not.exist');
    cy.get('[data-cy="modal-advertencia"]').should('not.exist');
  });
});
