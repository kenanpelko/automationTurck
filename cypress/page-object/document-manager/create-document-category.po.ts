const buttons = require(`../../fixtures/i18n/document-manager/${Cypress.env('LANGUAGE')}`); 

export class NewDocumentCategory {
  // All tabs
  get documentTable() {
    return cy.get('app-document-category .table');
  }
  get firstRowTable() {
    return cy.get('.table-body > lib-row:first-child > lib-cell:nth-of-type(1)')
  }

  // Inputs
  get nameInput() {
    return cy.get('#name');
  }
  get documentSearchInput() {
    return cy.get('.search > input.form-control')
  }

  // Buttons
  get openDocumentCardBtn() {
    return cy.get('app-tile-card:nth-child(2) > a').contains(buttons.openDocumentCard);
  }
  get documentCategoryBtn() {
    return cy.get('.tabs > :nth-child(2)');
  }
  get addDocumentCategoreBtn() {
    return cy.get('.panel-header-actions > .btn').contains('Add document category');
  }
  get backBtn() {
    return cy.get('.panel-header > .btn');
  }
  get cancelBtn() {
    return cy.get('.panel-header-actions a');
  }
  get createDocumentTypeBtn() {
    return cy.get('button.btn-primary').contains('Create document category');
  }
  get openDocumentCard() {
    return cy.get('app-tile-card:nth-child(2) > a').contains(buttons.openDocumentCard);
  }
  get saveChangesBtn() {
    return cy.get('.panel-header-actions > .btn-primary')
  }

  // Methods
  verifyDocumentTypeExist(documentCategory: string) {
    this.documentTable.find('.table-body').contains(documentCategory);
  }

  findExistingDocumentType(documentTypeName: string, mode: string) {
    this.documentTable
      .find('.table-body')
      .contains(documentTypeName)
      .siblings('lib-cell')
      .find('.btn-group > .text-right')
      .click({ force: true })
      .find('.dropdown-item')
      .contains(mode)
      .click({ force: true });
  }

  moveToDocumentCategory() {
    cy.login(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
    this.openDocumentCardBtn.click();
    this.documentCategoryBtn.click()
  }
}