describe('CP-006: Confirmar/Abortar bloqueo de días con reservas', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  const getDiaRelativoConReserva = () => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().slice(0, 10);
  };

  it('CP-006-01: Debería abrir modal, confirmar el bloqueo y cancelar turnos visualmente', () => {
    // Arrange:
    const fecha = getDiaRelativoConReserva();

    // Act:
    cy.get(`[data-cy="dia-${fecha}"]`).click();
    cy.get('[data-cy="btn-guardar"]').click();

    // Assert:
    cy.get('[data-cy="modal-advertencia"]').should('be.visible');
    
    // Arrange: turnos mockeados 1 y 2 están en el día relativo 5
    // Act: confirmar bloqueo
    cy.get('[data-cy="btn-confirmar-bloqueo"]').click();
    
    // Assert: los turnos se cancelan visualmente antes de cerrarse
    cy.get('[data-cy="estado-turno-1"]').should('contain.text', 'Cancelado');
    cy.get('[data-cy="estado-turno-2"]').should('contain.text', 'Cancelado');
    
    // Assert: el modal se cierra y aparece el mensaje de éxito
    cy.get('[data-cy="modal-advertencia"]').should('not.exist');
    cy.get('[data-cy="mensaje-confirmacion"]').should(
      'contain.text', 
      'Bloqueo añadido, el mismo se notificará al guardar los cambios'
    );
  });

  it('CP-006-02: Debería abrir modal, abortar el bloqueo y mantener turnos intactos', () => {
    // Arrange:
    const fecha = getDiaRelativoConReserva();

    // Act:
    cy.get(`[data-cy="dia-${fecha}"]`).click();
    cy.get('[data-cy="btn-guardar"]').click();

    // Assert:
    cy.get('[data-cy="modal-advertencia"]').should('be.visible');
    
    // Arrange: 
    // Act: abortar bloqueo
    cy.get('[data-cy="btn-abortar-bloqueo"]').click();

    // Assert: modal desaparece, no hay mensaje y se puede ver en la UI principal
    cy.get('[data-cy="modal-advertencia"]').should('not.exist');
    cy.get('[data-cy="mensaje-confirmacion"]').should('not.exist');
    
    // También el día sigue seleccionado y esperando
    cy.get(`[data-cy="dia-${fecha}"]`).should('have.class', 'bg-blue-500');
  });
});
