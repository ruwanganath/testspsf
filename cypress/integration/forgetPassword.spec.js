describe('forget page test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('#forget').click();
  });
  it('contains correct user login page', () => {
    cy.get('.waves-effect').contains('Send Password').should('be.visible');
  });
  it('contains the correct title', () => {
    cy.get('.sendpassword')
      .children('h5')
      .invoke('text')
      .should('equal', 'Send Password');
  });
  it('contains username input field', () => {
    cy.get('#email')
      .type('cytest@mail.com')
      .should('have.focus')
      .should('have.value', 'cytest@mail.com');
  });
  it('contains copyrigth text', () => {
    cy.contains('© 2021 SPSF, All rights reserved.').should('be.visible');
  });
  it('contains RESET button', () => {
    cy.get('#btn-sendpassword')
      .should('be.visible')
      .click('left')
      .click('center')
      .click('right');
  });

  it('Login into user account', () => {
    cy.get('#email').type('leeleelaka@gmail.com');
    cy.get('#btn-sendpassword').click();
    cy.url().should('include', '/');
    cy.url().should('include', 'http://localhost:3000/');
    cy.get('header nav li a img').click();
  });
});