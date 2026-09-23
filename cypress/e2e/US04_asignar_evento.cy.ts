describe('AgendaYA - M02: Asignar Evento a Turno', () => {
  
  beforeEach(() => {
    // Reemplaza esto con la URL o el archivo local donde está corriendo tu frontend
    cy.visit('http://localhost:3000') 
  })

  it('Habilitar tipo de evento en un turno sin superposición (Caso Positivo)', () => {
    // Arrange: preparar el estado inicial
    // Seleccionamos que el siguiente turno empieza a las 11:00 y el evento dura 45 min
    cy.get('[data-cy="select-siguiente-turno"]').select('11:00')
    cy.get('[data-cy="select-tipo-evento"]').select('45')

    // Act: ejecutar la acción principal
    cy.get('[data-cy="btn-guardar"]').click()

    // Assert: verificar el resultado esperado
    // Buscamos que el mensaje sea visible, tenga color de éxito y el texto correcto
    cy.get('[data-cy="mensaje-resultado"]')
      .should('be.visible')
      .and('have.class', 'success')
      .and('contain', 'Cambios guardados exitosamente')
  })

  it('Error al habilitar tipo de evento con superposición (Caso Negativo)', () => {
    // Arrange: preparar el estado inicial
    // Seleccionamos que el siguiente turno empieza a las 10:30 y el evento dura 60 min
    cy.get('[data-cy="select-siguiente-turno"]').select('10:30')
    cy.get('[data-cy="select-tipo-evento"]').select('60')

    // Act: ejecutar la acción principal
    cy.get('[data-cy="btn-guardar"]').click()

    // Assert: verificar el resultado esperado
    // Buscamos que el mensaje sea visible, tenga color de error y el texto de superposición
    cy.get('[data-cy="mensaje-resultado"]')
      .should('be.visible')
      .and('have.class', 'error')
      .and('contain', 'Superposición entre los turnos 10:00 y 10:30')
  })
})
