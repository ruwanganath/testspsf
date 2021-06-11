describe('User register page test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/displayRegister');
  });
  it('contains correct user register page', () => {
    cy.get('.waves-effect').contains('Register').should('be.visible');
  });
  it('contains the correct title', () => {
    cy.get('.register')
      .children('h5')
      .invoke('text')
      .should('equal', 'Register');
  });
  it('contains username input field', () => {
    cy.get('#username')
      .type('cytest')
      .should('have.focus')
      .should('have.value', 'cytest');
  });
  it('contains email input field', () => {
    cy.get('#email')
      .type('cytest@mail.com')
      .should('have.focus')
      .should('have.value', 'cytest@mail.com');
  });
  it('contains password input field', () => {
    cy.get('#password')
      .type('test')
      .should('have.focus')
      .should('have.value', 'test');
  });
  it('contains confirm password input field', () => {
    cy.get('#confirmpassword')
      .type('test')
      .should('have.focus')
      .should('have.value', 'test');
  });
  it('contains copyrigth text', () => {
    cy.contains('© 2021 SPSF, All rights reserved.').should('be.visible');
  });
  it('contains REGISTER button', () => {
    cy.get('#btn-register')
      .should('be.visible')
      .click('left')
      .click('center')
      .click('right');
  });

  it('Register into user account', () => {
    cy.get('#username').type('cytest');
    cy.get('#email').type('cytest@mail.com');
    cy.get('#password').type('test');
    cy.get('#confirmpassword').type('test');
    cy.get('#btn-register').click();
    cy.url().should('include', '/');
    cy.url().should('include', 'http://localhost:3000/');
    //cy.get('header nav li a img').click();
  });
});