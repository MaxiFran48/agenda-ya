/// <reference types="cypress" />

describe('US_004: Agregar/quitar tipos de eventos de turno en día de trabajo (Componente Asignar Evento a Turno)', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000') 
  })

  it('Habilitar tipo de evento en un turno (Caso Positivo)', () => {
    // 1. Asegurar que haya un turno disponible (por ejemplo en Lunes)
    // Primero, hacemos click en habilitar el lunes por si acaso
    // (Por defecto el Lunes está desactivado en page.tsx test data: { diaSemana: 'Lunes', habilitado: false })
    // Ah, esperá, en el array DIAS_INICIALES de page.tsx Lunes está en false.
    // Habilitemos Lunes
    cy.get('[data-cy="dia-checkbox-lunes"]').check()
    
    // Agregamos un turno en lunes
    cy.get('[data-cy="input-hora-inicio-lunes"]').type('10:00')
    cy.get('[data-cy="input-hora-fin-lunes"]').type('12:00')
    cy.get('[data-cy="btn-agregar-turno-lunes"]').click()

    // 2. Seleccionar el turno recién creado
    // Cypress seleccionará la opción que contenga el texto dado (por ejemplo 'Lunes: 10:00 - 12:00')
    cy.get('[data-cy="select-siguiente-turno"]').select('Lunes: 10:00 - 12:00')
    
    // 3. Completar nombre y duración
    cy.get('[data-cy="input-nombre-evento"]').type('Consulta General')
    cy.get('[data-cy="select-tipo-evento"]').select('45')
    
    // Guardar
    cy.wait(200)
    cy.get('[data-cy="btn-guardar-evento"]').click()

    // Verificar éxito
    cy.get('[data-cy="mensaje-resultado"]')
      .should('be.visible')
      .and('have.class', 'text-green-700')
      .and('contain', 'Evento "Consulta General" asignado exitosamente')

    // Verificar que el evento aparece en el turno
    cy.get('[data-cy="turno-item-lunes"]').should('contain', 'Consulta General (45m)')
  })

  it('Error al habilitar tipo de evento con superposición (Caso Negativo)', () => {
    // Creamos un turno corto de 30 mins
    cy.get('[data-cy="dia-checkbox-jueves"]').check()
    cy.get('[data-cy="input-hora-inicio-jueves"]').type('10:00')
    cy.get('[data-cy="input-hora-fin-jueves"]').type('10:30')
    cy.get('[data-cy="btn-agregar-turno-jueves"]').click()

    // Intentamos asignar un evento de 60 mins a un turno de 30 mins
    cy.get('[data-cy="select-siguiente-turno"]').select('Jueves: 10:00 - 10:30')
    cy.get('[data-cy="input-nombre-evento"]').type('Consulta Larga')
    cy.get('[data-cy="select-tipo-evento"]').select('60')
    
    cy.wait(200)
    cy.get('[data-cy="btn-guardar-evento"]').click()

    // Assert: Debe mostrar error de superposición
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
    
    // No completamos nombre de evento ni duración
    cy.wait(200)
    cy.get('[data-cy="btn-guardar-evento"]').click()

    // Assert: el mensaje de validación debe aparecer
    cy.get('[data-cy="mensaje-resultado"]')
      .should('be.visible')
      .and('have.class', 'text-red-700')
      .and('contain', 'Debe completar todos los campos (turno, nombre y duración)')
  })
})
