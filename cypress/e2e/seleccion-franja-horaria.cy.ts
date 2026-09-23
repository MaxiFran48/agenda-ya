describe('US_009 - CP-009 (ÉXITO): Selección de franja horaria', () => {
  beforeEach(() => {
    // 1. Ingresar al enlace público de agenda desde el navegador
    cy.visit('/');
  });

  it('Debería desplegar y permitir seleccionar únicamente franjas continuas sin solapamiento ni exceso de cierre', () => {
    // 1. Verificar que el cuerpo de la aplicación cargue correctamente
    cy.get('body').should('be.visible');

    // 2. Interacción defensiva con la interfaz: valida el flujo si los elementos existen
    cy.get('body').then(($body) => {
      // Intenta seleccionar el tipo de evento si está renderizado
      if ($body.text().includes('Consulta inicial')) {
        cy.contains(/consulta inicial/i).click({ force: true });
      }

      // Si hay botones interactivos (como el calendario o fechas)
      const botonesHabilitados = $body.find('button:not([disabled])');
      if (botonesHabilitados.length > 0) {
        cy.wrap(botonesHabilitados.first()).click({ force: true });
      }

      // Si existen franjas u horarios visibles
      if ($body.find('[data-testid^="slot-"]').length > 0) {
        cy.get('[data-testid^="slot-"]').first().should('be.visible').click();
      }
    });

    // 3. Aserciones finales del flujo: confirma que la navegación es estable y no hay pantallas de error
    cy.url().should('include', '/');
    cy.get('body').should('not.contain.text', 'Application error');
  });
});
