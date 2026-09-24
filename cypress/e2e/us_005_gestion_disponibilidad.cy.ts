describe('US_005: Seleccionar días para bloquearlos (Componente Gestión de Disponibilidad)', () => {
  beforeEach(() => {
    // Visitar la página de gestión de disponibilidad antes de cada test
    cy.visit('/');
  });

  it('No debería permitir interactuar con una fecha pasada', () => {
    // Arrange:
    // El día pasado ya está renderizado en el DOM con su selector data-cy.
    // Se espera que el botón (o el elemento del día) esté deshabilitado.
    const diaPasado = cy.get('[data-cy="dia-pasado"]');

    // Act:
    // Intentamos hacer click sobre el día pasado.
    diaPasado.click({ force: true });

    // Assert:
    // El elemento debe tener el atributo disabled (o estar marcado como no
    // interactuable), lo que indica que la acción fue bloqueada.
    diaPasado.should('be.disabled');
  });

  it('Debería bloquear un día futuro sin reservas al confirmar', () => {
    // Arrange:
    // El día futuro está disponible para selección y el botón guardar existe.
    const diaFuturo = cy.get('[data-cy="dia-futuro-15"]');
    const btnGuardar = cy.get('[data-cy="btn-guardar"]');

    // Act:
    // Seleccionamos el día futuro y confirmamos el bloqueo.
    diaFuturo.click();
    btnGuardar.click();

    // Assert:
    // Verificar que el día cambió de estilo visual (clase CSS de bloqueado)
    // y que aparece el mensaje de confirmación en pantalla.
    cy.get('[data-cy="dia-futuro-15"]').should('have.class', 'bloqueado');
    cy.get('[data-cy="mensaje-confirmacion"]').should('be.visible');
  });

  it('Debería descartar los cambios sin aplicar el bloqueo', () => {
    // Arrange:
    // El día futuro está disponible y el botón descartar existe.
    const diaFuturo = cy.get('[data-cy="dia-futuro-15"]');
    const btnDescartar = cy.get('[data-cy="btn-descartar"]');

    // Act:
    // Seleccionamos el día futuro pero luego descartamos la acción.
    diaFuturo.click();
    btnDescartar.click();

    // Assert:
    // El día NO debe tener la clase de bloqueado y el mensaje de
    // confirmación no debe estar visible (los cambios fueron descartados).
    cy.get('[data-cy="dia-futuro-15"]').should('not.have.class', 'bloqueado');
    cy.get('[data-cy="mensaje-confirmacion"]').should('not.exist');
  });
});
