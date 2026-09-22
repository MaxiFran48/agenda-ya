describe('Flujo de Error', () => {
  it('Debería mostrar un error si se intenta una acción inválida', () => {
    // 1. Visitar la aplicación
    cy.visit('/');
    
    // 2. Ejecutar alguna acción inválida (por ejemplo, enviar un formulario vacío)
    // cy.get('button[type="submit"]').click();
    
    // 3. Verificar que aparece el mensaje de error correspondiente
    // cy.contains('El campo es requerido').should('be.visible');
  });
});
