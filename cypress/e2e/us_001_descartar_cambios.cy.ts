/// <reference types="cypress" />

describe('US_001 - CP-001-02: Descartar cambios en configuración semanal de días de trabajo', () => {

  beforeEach(() => {
    // Arrange: visitar la aplicación en estado inicial
    cy.visit('http://localhost:3000');
  });

  it('Debería revertir el estado del día Miércoles al descartar desde la advertencia de reservas (Escenario 4)', () => {

    // ── ARRANGE ──────────────────────────────────────────────────────────────
    // Pre-condición: Miércoles inicia HABILITADO (bg-white, checkbox marcado)
    // y tiene reservas registradas (tieneReservas: true en DIAS_INICIALES).
    cy.get('[data-cy="dia-contenedor-mi\u00e9rcoles"]').should('have.class', 'bg-white');
    cy.get('[data-cy="dia-checkbox-mi\u00e9rcoles"]').should('be.checked');

    // ── ACT ──────────────────────────────────────────────────────────────────
    // 1. El usuario desmarca el checkbox de Miércoles (cambio pendiente, no guardado)
    cy.get('[data-cy="dia-checkbox-mi\u00e9rcoles"]').click();

    // Verificación intermedia: el cambio se refleja visualmente
    cy.get('[data-cy="dia-checkbox-mi\u00e9rcoles"]').should('not.be.checked');
    cy.get('[data-cy="dia-contenedor-mi\u00e9rcoles"]').should('have.class', 'bg-gray-200');

    // 2. El usuario presiona "Guardar Cambios" — el sistema detecta reservas activas
    cy.get('[data-cy="btn-guardar-global"]').click();

    // Verificación intermedia: aparece el panel de advertencia de reservas
    cy.get('[data-cy="advertencia-reservas-global"]').should('be.visible');

    // 3. El usuario elige "Descartar Cambios" dentro de la advertencia
    cy.get('[data-cy="btn-confirmar-descartar-global"]').click();

    // ── ASSERT ───────────────────────────────────────────────────────────────
    // 4. La advertencia desaparece del DOM
    cy.get('[data-cy="advertencia-reservas-global"]').should('not.exist');

    // 5. El sistema revierte Miércoles a su estado guardado (habilitado)
    cy.get('[data-cy="dia-checkbox-mi\u00e9rcoles"]').should('be.checked');
    cy.get('[data-cy="dia-contenedor-mi\u00e9rcoles"]').should('have.class', 'bg-white');

    // 6. Aparece el mensaje de confirmación de descarte
    cy.get('[data-cy="mensaje-alerta-global"]')
      .should('be.visible')
      .and('contain.text', 'Cambios descartados');
  });
});
