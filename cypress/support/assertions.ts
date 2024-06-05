declare namespace Cypress {
  interface Chainable {
    verifySuccessToasterMessage(message: string): void;
    reloadPage(): void;
    verifyToasterMessage(message: string): void;
  }
}


Cypress.Commands.add('verifySuccessToasterMessage', (message: string) => {
  cy.get('#toast-container .toast-message').should('contain', message).and('be.visible')
});

Cypress.Commands.add('reloadPage', () => {
  cy.reload().wait(2000)
});

Cypress.Commands.add('verifyToasterMessage', (message: string) => { 
  cy.get('[id="toast-container"]').should('contain.text', message);
})