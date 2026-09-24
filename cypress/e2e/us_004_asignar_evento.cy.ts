/// <reference types="cypress" />

describe('US_004: Agregar/quitar tipos de eventos de turno en día de trabajo (Componente Asignar Evento a Turno)', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000') 
  })

  it('Habilitar tipo de evento en un turno (Caso Positivo)', () => {
    cy.get('[data-cy="dia-checkbox-lunes"]').check()
    cy.get('[data-cy="input-hora-inicio-lunes"]').type('10:00')
    cy.get('[data-cy="input-hora-fin-lunes"]').type('12:00')
    cy.get('[data-cy="btn-agregar-turno-lunes"]').click()

    cy.get('[data-cy="select-siguiente-turno"]').select('Lunes: 10:00 - 12:00')
    
    // Seleccionar evento predefinido: "Consulta General (45 min)" tiene el value "1"
    cy.get('[data-cy="select-tipo-evento"]').select('1')
    
    cy.wait(200)
    cy.get('[data-cy="btn-guardar-evento"]').click()

    cy.get('[data-cy="mensaje-resultado"]')
      .should('be.visible')
      .and('have.class', 'text-green-700')
      .and('contain', 'Evento "Consulta General" asignado exitosamente')

    cy.get('[data-cy="turno-item-lunes"]').should('contain', 'Consulta General (45m)')
  })

  it('Error al habilitar tipo de evento con superposición (Caso Negativo)', () => {
    cy.get('[data-cy="dia-checkbox-jueves"]').check()
    cy.get('[data-cy="input-hora-inicio-jueves"]').type('10:00')
    cy.get('[data-cy="input-hora-fin-jueves"]').type('10:30')
    cy.get('[data-cy="btn-agregar-turno-jueves"]').click()

    cy.get('[data-cy="select-siguiente-turno"]').select('Jueves: 10:00 - 10:30')
    
    // Seleccionamos un evento que dura 60 min, e.g. "Consulta Larga" (value "3")
    cy.get('[data-cy="select-tipo-evento"]').select('3')
    
    cy.wait(200)
    cy.get('[data-cy="btn-guardar-evento"]').click()

    cy.get('[data-cy="mensaje-resultado"]')
      .should('be.visible')
      .and('have.class', 'text-red-700')
      .and('contain', 'La duración excede el turno y se superpone con el siguiente.')
  })

  it('Error al guardar si falta completar un campo (Validación)', () => {
    cy.get('[data-cy="dia-checkbox-martes"]').check()
    cy.get('[data-cy="input-hora-inicio-martes"]').type('14:00')
    cy.get('[data-cy="input-hora-fin-martes"]').type('16:00')
    cy.get('[data-cy="btn-agregar-turno-martes"]').click()

    cy.get('[data-cy="select-siguiente-turno"]').select('Martes: 14:00 - 16:00')
    
    // No completamos el tipo de evento
    cy.wait(200)
    cy.get('[data-cy="btn-guardar-evento"]').click()

    cy.get('[data-cy="mensaje-resultado"]')
      .should('be.visible')
      .and('have.class', 'text-red-700')
      .and('contain', 'Debe seleccionar el turno y el tipo de evento')
  })
})
