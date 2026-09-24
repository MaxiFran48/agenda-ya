describe('US_005: Seleccionar días para bloquearlos (Componente Gestión de Disponibilidad)', () => {
  beforeEach(() => {
    cy.visit('/');
    // Validamos que el componente haya cargado y dibujado el calendario.
    // El data-cy de los días futuros ahora es "dia-YYYY-MM-DD".
    cy.get('[data-cy^="dia-202"]').should('have.length.greaterThan', 0);
  });

  it('No debería permitir interactuar con una fecha pasada', () => {
    // Arrange:
    // El primer día pasado del mes siempre está deshabilitado.
    
    // Act:
    
    // Assert:
    cy.get('[data-cy^="dia-pasado-"]').first().should('be.disabled');
  });

  it('Debería bloquear un día futuro sin reservas al confirmar', () => {
    // Arrange:
    // Buscamos un día futuro excluyendo los que tienen el atributo "title" (los que tienen reservas)
    cy.get('[data-cy^="dia-202"]:not([title])')
      .first()
      .then(($btn) => {
        // Guardamos el data-cy original para las aserciones finales
        const dataCy = $btn.attr('data-cy');
        const numeroDia = $btn.text().trim();

        // Act:
        // Clic natural directo al nodo de React sin forzar
        cy.wrap($btn).click();

        // Esperamos a que la interfaz actualice el estado y clickeamos confirmar bloqueo
        cy.get('[data-cy="btn-guardar"]').should('be.visible').click();

        // Assert:
        // Validamos que el mensaje de éxito aparezca
        cy.get('[data-cy="mensaje-confirmacion"]').should('be.visible');

        // Validamos que el día específico ahora esté deshabilitado y figure como bloqueado
        cy.get(`[data-cy="dia-pasado-${numeroDia}"]`).should('be.disabled');
      });
  });

  it('Debería descartar los cambios sin aplicar el bloqueo', () => {
    // Arrange:
    cy.get('[data-cy^="dia-202"]:not([title])')
      .first()
      .then(($btn) => {
        const dataCy = $btn.attr('data-cy');

        // Act:
        cy.wrap($btn).click();
        // Click en descartar
        cy.get('[data-cy="btn-descartar"]').should('be.visible').click();

        // Assert:
        // El panel inferior de confirmación debe desaparecer
        cy.get('[data-cy="mensaje-confirmacion"]').should('not.exist');
        cy.get('[data-cy="btn-guardar"]').should('not.exist');

        // El día debe permanecer habilitado y con su data-cy original
        cy.get(`[data-cy="${dataCy}"]`).should('not.be.disabled');
      });
  });
});