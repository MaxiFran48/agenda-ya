describe('Gestión de Bloqueos de Días', () => {
  // Nota: Ajustar la URL a donde se monte el componente en tu app (ej. '/' o '/gestion-bloqueos')
  const baseUrl = '/'; 

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('CP-006-01: Confirmar bloqueo de día con turnos reservados', () => {
    // Arrange:
    // Asegurarse de que el día y los turnos iniciales existan en su estado por defecto
    cy.get('[data-cy="dia-20-06-2026"]').should('exist');
    cy.get('[data-cy="estado-turno-1"]').should('have.text', 'Activo');
    cy.get('[data-cy="estado-turno-2"]').should('have.text', 'Activo');

    // Act:
    // Seleccionar el día
    cy.get('[data-cy="dia-20-06-2026"]').click();
    
    // Clic en el botón guardar general
    cy.get('[data-cy="btn-guardar"]').click();
    
    // Confirmar en el modal de advertencia
    cy.get('[data-cy="modal-advertencia"]').should('be.visible');
    cy.get('[data-cy="btn-confirmar-bloqueo"]').click();

    // Assert:
    // Verificar que los turnos hayan cambiado de estado a 'Cancelado'
    cy.get('[data-cy="estado-turno-1"]').should('have.text', 'Cancelado');
    cy.get('[data-cy="estado-turno-2"]').should('have.text', 'Cancelado');
    
    // Verificar que se muestre el mensaje de éxito correcto
    cy.get('[data-cy="mensaje-estado"]').should('have.text', 'Bloqueo añadido, el mismo se notificará al guardar los cambios');
    
    // Verificar que el modal haya desaparecido
    cy.get('[data-cy="modal-advertencia"]').should('not.exist');
  });

  it('CP-006-02: Abortar bloqueo de día con turnos reservados', () => {
    // Arrange:
    // Asegurarse de que el día y los turnos iniciales existan en su estado por defecto
    cy.get('[data-cy="dia-20-06-2026"]').should('exist');
    cy.get('[data-cy="estado-turno-1"]').should('have.text', 'Activo');
    cy.get('[data-cy="estado-turno-2"]').should('have.text', 'Activo');

    // Act:
    // Seleccionar el día
    cy.get('[data-cy="dia-20-06-2026"]').click();
    
    // Clic en el botón guardar general
    cy.get('[data-cy="btn-guardar"]').click();
    
    // Clic en cancelar/abortar en el modal de advertencia
    cy.get('[data-cy="modal-advertencia"]').should('be.visible');
    cy.get('[data-cy="btn-abortar-bloqueo"]').click();

    // Assert:
    // Verificar que los turnos sigan en su estado original ('Activo')
    cy.get('[data-cy="estado-turno-1"]').should('have.text', 'Activo');
    cy.get('[data-cy="estado-turno-2"]').should('have.text', 'Activo');
    
    // Verificar que NO se muestre mensaje de estado/confirmación en la interfaz
    cy.get('[data-cy="mensaje-estado"]').should('not.exist');
    
    // Verificar que el modal haya desaparecido
    cy.get('[data-cy="modal-advertencia"]').should('not.exist');
  });
});
