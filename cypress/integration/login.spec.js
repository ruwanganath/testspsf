describe('User login page test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });
  it('contains correct user login page', () => {
    cy.get('.waves-effect').contains('Login').should('be.visible');
  });
  it('contains the correct title', () => {
    cy.get('.signin')
      .children('h5')
      .invoke('text')
      .should('equal', 'Sign In');
  });
  it('contains username input field', () => {
    cy.get('#username')
      .type('test')
      .should('have.focus')
      .should('have.value', 'test');
  });
  it('contains password input field', () => {
    cy.get('#password')
      .type('test')
      .should('have.focus')
      .should('have.value', 'test');
  });
  it('contains forgot password', () => {
    cy.get('.signin').contains('Forgot Password?').should('be.visible');
  });
  it('contains copyrigth text', () => {
    cy.contains('© 2021 SPSF, All rights reserved.').should('be.visible');
  });
  it('contains LOGIN button', () => {
    cy.get('#btn-signin')
      .should('be.visible')
      .click('left')
      .click('center')
      .click('right');
  });

  it('Login into user account', () => {
    cy.get('#username').type('test');
    cy.get('#password').type('test');
    cy.get('#btn-signin').click();
    cy.url().should('include', '/');
    cy.url().should('include', 'http://localhost:3000/');
    cy.get('header nav li a img').click();
  });
});