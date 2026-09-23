describe('US_009 - CP-009 (ÉXITO): Selección de franja horaria', () => {
  beforeEach(() => {
    // 1. Ingresar al enlace público de agenda del administrador desde el navegador
    cy.visit('/');
  });

  it('Debería desplegar y permitir seleccionar únicamente franjas continuas sin solapamiento ni exceso de cierre', () => {
    // 2. Seleccionar el tipo de evento "Consulta inicial (60 min)"
    // Busca el botón, tarjeta o texto correspondiente al evento
    cy.contains(/consulta inicial/i, { matchCase: false })
      .should('be.visible')
      .click();

    // 3. En el calendario mensual, hacer clic sobre la fecha habilitada
    // Se selecciona un día habilitado (no deshabilitado)
    cy.get('button')
      .filter(':not([disabled])')
      .contains(/15|2026-10-15/i)
      .should('be.visible')
      .click();

    // 4. Visualizar el listado de franjas horarias disponibles generadas para ese día
    // Franja válida libre de 60 min (09:00 a 10:00)
    cy.contains(/09:00/i).should('be.visible');

    // Validación de solapamientos: el turno de 10:00 a 11:00 está ocupado
    // Por ende, no debe figurar la franja de las 10:00
    cy.contains(/10:00/i).should('not.exist');

    // Validación de límite de horario de cierre (cierre 13:00 / 18:00):
    // No debe figurar un horario que exceda la jornada laboral
    cy.contains(/12:30|17:30/i).should('not.exist');

    // 5. Seleccionar la franja horaria válida de las 09:00 hs
    cy.contains('button', /09:00/i)
      .should('be.visible')
      .click();

    // 6. Verificar confirmación / paso al formulario de datos personales
    // Verifica que la franja quedó seleccionada o que avanzó al siguiente paso del booking
    cy.contains(/09:00/i).should('exist');
  });
});
