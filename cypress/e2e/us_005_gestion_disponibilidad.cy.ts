describe('US_005: Seleccionar días para bloquearlos (Componente Gestión de Disponibilidad)', () => {
  beforeEach(() => {
    cy.visit('/');
    // Validamos que el componente haya cargado y dibujado el calendario
    cy.get('button[data-cy="dia-futuro-15"]').should('have.length.greaterThan', 0);
  });

  it('No debería permitir interactuar con una fecha pasada', () => {
    cy.get('[data-cy="dia-pasado"]').first().should('be.disabled');
  });

  it('Debería bloquear un día futuro sin reservas al confirmar', () => {
    // Buscamos un día futuro excluyendo los que tienen el atributo "title" (los que tienen reservas)
    cy.get('button[data-cy="dia-futuro-15"]:not([title])')
      .first()
      .then(($btn) => {
        // Guardamos el número del día para las aserciones finales
        const numeroDia = $btn.text().trim();

        // Clic natural directo al nodo de React sin forzar
        cy.wrap($btn).click();

        // Esperamos a que la interfaz actualice el estado y clickeamos guardar
        cy.get('[data-cy="btn-guardar"]').should('be.visible').click();

        // Validamos que el mensaje de éxito aparezca
        cy.get('[data-cy="mensaje-confirmacion"]').should('be.visible');

        // Validamos que el día específico ahora esté deshabilitado y figure como "pasado" (bloqueado)
        cy.contains('button[data-cy="dia-pasado"]', numeroDia).should('be.disabled');
      });
  });

  it('Debería descartar los cambios sin aplicar el bloqueo', () => {
    cy.get('button[data-cy="dia-futuro-15"]:not([title])')
      .first()
      .then(($btn) => {
        const numeroDia = $btn.text().trim();

        cy.wrap($btn).click();

        // Click en descartar
        cy.get('[data-cy="btn-descartar"]').should('be.visible').click();

        // El menú inferior debe desaparecer
        cy.get('[data-cy="mensaje-confirmacion"]').should('not.exist');
        cy.get('[data-cy="btn-guardar"]').should('not.exist');

        // El día debe permanecer habilitado y con su data-cy original
        cy.contains('button[data-cy="dia-futuro-15"]', numeroDia).should('not.be.disabled');
      });
  });
});