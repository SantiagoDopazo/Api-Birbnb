describe('AlojamientoPage E2E', () => {
  it('shows alojamientos list', () => {
  cy.intercept('GET', 'http://localhost:3000*', { fixture: 'alojamientos.json' }).as('getAlojamientos');

    cy.visit('http://localhost:3001/');

    cy.contains('Encuentra tu próximo destino');
  });
});