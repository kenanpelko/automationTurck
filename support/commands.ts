/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): void;
    verifyURLContains(url: string): void;
    clickOnBreadcrumbLink(url: string): void;
    selectOptionFromDropdown(option: string): void;
    addNewTagFromDropdown(option: string): void;
    navigateToBaseURL(url: string): void;
    assignPlanToAsset(assetId: string): void;
    logout(): void;
    clearSessionStorage(): void;
    clearStorage(): void;
    clearStorageAndNavigate(url: string): void;
    setAppLanguage(language: string): void;
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
      email = Cypress.env("USERNAME");
      password = Cypress.env("PASSWORD")
      cy.get('#username').clear().type(email);
      cy.get('#password').clear().type(password);
      cy.get('#kc-login').click();
});

Cypress.Commands.add('navigateToBaseURL', (url: any) => {
  if (url.toLowerCase().indexOf('localhost') === -1) {
    cy.visit(Cypress.env('URL'));
    cy.login(Cypress.env("USERNAME"), Cypress.env("PASSWORD"));
  } else {
    cy.visit(Cypress.env('URL'));
  }
});

Cypress.Commands.add('verifyURLContains', (url: String) => {
  cy.url().should('contains', url);
});

Cypress.Commands.add('clickOnBreadcrumbLink', (breadcrumbText: string) => {
  cy.get('.navigation a u').contains(breadcrumbText).click({force: true});
});

Cypress.Commands.add('selectOptionFromDropdown', (option: string) => {
  cy.get('ng-dropdown-panel .ng-option').contains(option).click();
});

Cypress.Commands.add('addNewTagFromDropdown', (option) => {
  cy.get('ng-dropdown-panel div[role="option"]').find('span').contains(option).click();
});

Cypress.Commands.add('assignPlanToAsset', (assetId: any) => {
  cy.get('@planId').then((planId) => {
    cy.get(assetId).then(id => { 
      cy.request('POST', Cypress.env('URL') + '/service/maintenance/v1/procedures/'+ planId + '/assign/' + id);
    })
  })
});


Cypress.Commands.add('verifyURLContains', (url: string) => {
  cy.url().should('contains', url);
});

Cypress.Commands.add('logout', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.reload();
});

//Clearing session storage
Cypress.Commands.add("clearSessionStorage", () => {
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

Cypress.Commands.add("clearStorage", () => {
  cy.clearSessionStorage();
  cy.clearLocalStorage();
});

Cypress.Commands.add("clearStorageAndNavigate", (url = "/") => {
  cy.clearStorage();
  cy.clearCookies();
  cy.visit(url);
});

Cypress.Commands.add('setAppLanguage', () => {
  cy.window().then((win: any) => {
    win.localStorage.setItem('sf_language', Cypress.env('LANGUAGE'));
  });
});
