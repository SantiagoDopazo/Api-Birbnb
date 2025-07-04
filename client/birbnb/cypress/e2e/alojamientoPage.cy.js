describe('AlojamientoPage E2E', () => {
  it('shows alojamientos list', () => {
    cy.intercept('GET', 'http://localhost:3000/busquedaAlojamientos*');

    cy.visit('http://localhost:3001/busquedaAlojamientos');

    cy.contains('Descubre tu próximo destino');
    cy.get('.grid-alojamientos').children().should('have.length.greaterThan', 0);
    cy.contains('Hotel Fachero');
  });
});
