/// <reference types="cypress" />

describe('US_005: Seleccionar días para bloquearlos (Componente Gestión de Disponibilidad)', () => {
  beforeEach(() => {
    // Visitar la página de gestión de disponibilidad antes de cada test
    cy.visit('/');
  });

  // Devuelve el número de un día futuro del mes actual, sin reservas (hoy + 5 y
  // hoy + 8 están reservados según el entorno de datos), para usarlo como
  // objetivo de selección/bloqueo.
  function diaFuturoLibre(): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const reservas = [5, 8].map((offset) => {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + offset);
      return d.getDate();
    });

    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();

    for (let diaNum = hoy.getDate() + 1; diaNum <= ultimoDiaMes; diaNum++) {
      if (!reservas.includes(diaNum)) {
        return diaNum;
      }
    }
    throw new Error('No hay días futuros libres en el mes actual para probar el bloqueo');
  }

  it('No debería permitir interactuar con una fecha pasada', () => {
    // Arrange:
    // El día 1 del mes siempre es pasado (o hoy), por lo que está deshabilitado.
    const diaPasado = '[data-cy="dia-pasado-1"]';
    cy.get(diaPasado).should('be.disabled');

    // Act:
    // Intentamos hacer click sobre el día pasado.

    // Assert:
    // El elemento debe tener el atributo disabled (o estar marcado como no
    // interactuable), lo que indica que la acción fue bloqueada.
    cy.get(diaPasado).click({ force: true });
    cy.get(diaPasado).should('be.disabled');
  });

  it('Debería bloquear un día futuro sin reservas al confirmar', () => {
    // Arrange:
    // El día futuro está disponible para selección y el botón confirmar existe.
    const diaNum = diaFuturoLibre();
    const diaFuturo = `[data-cy="dia-futuro-${diaNum}"]`;
    const diaBloqueado = `[data-cy="dia-pasado-${diaNum}"]`;

    // Act:
    // Seleccionamos el día futuro y confirmamos el bloqueo.
    cy.get(diaFuturo).click();
    cy.get('[data-cy="btn-confirmar-bloqueo"]').click();

    // Assert:
    // Al bloquearse, el día pasa al estado "pasado/bloqueado" (data-cy "dia-pasado-N"),
    // cambia su estilo visual y aparece el mensaje de confirmación en pantalla.
    cy.get(diaBloqueado).should('have.class', 'bg-red-50');
    cy.get(diaBloqueado).should('be.disabled');
    cy.get('[data-cy="mensaje-confirmacion"]').should('be.visible');
  });

  it('Debería descartar los cambios sin aplicar el bloqueo', () => {
    // Arrange:
    // El día futuro está disponible y el botón descartar existe.
    const diaNum = diaFuturoLibre();
    const diaFuturo = `[data-cy="dia-futuro-${diaNum}"]`;

    // Act:
    // Seleccionamos el día futuro pero luego descartamos la acción.
    cy.get(diaFuturo).click();
    cy.get('[data-cy="btn-descartar"]').click();

    // Assert:
    // El día NO debe tener la clase de bloqueado y el mensaje de
    // confirmación no debe estar visible (los cambios fueron descartados).
    cy.get(diaFuturo).should('not.have.class', 'bg-red-50');
    cy.get('[data-cy="mensaje-confirmacion"]').should('not.exist');
  });
});