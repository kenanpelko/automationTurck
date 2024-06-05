const buttons = require(`../../fixtures/i18n/document-manager/${Cypress.env('LANGUAGE')}`); 
import { documentPath } from '../../support/constant/document-manager/index';

export class DocumentPage {
  // All tabs
  get allDocumentsTab() {
    return cy.get('.tabs a:nth-child(1)');
  }
  get documentCategoryTab() {
    return cy.get('.tabs a:nth-child(2)');
  }
  get documentTable() {
    return cy.get('app-document .table');
  }
  get firstRowTable() {
    return cy.get('.table-body > lib-row:first-child > lib-cell:nth-of-type(1)')
  }

  // Inputs
  get documentSearchInput() {
    return cy.get('.search > input.form-control')
  }

  // Buttons
  get addDocumentBtn() {
    return cy.get('lib-panel-header-actions > button').contains(buttons.buttons.addDocument);
  }
  get addCategoryBtn() {
    return cy.get('lib-panel-header-actions > button').contains(buttons.buttons.addDocumentCategory);
  }
  get openDocumentCardBtn() {
    return cy.get('app-tile-card:nth-child(2) > a').contains(buttons.buttons.openDocumentCard);
  }
  get deleteDocumentBtn() {
    return cy.get('.btn-danger').contains(buttons.buttons.deleteDocument);
  }
  get cancelBtn() {
    return cy.get('.panel-header-actions .a-button');
  }
  get backBtn() {
    return cy.get('lib-panel-header>.btn.btn-transparent.btn-icon.me-3');
  }

  // Methods
  getDocumentOnPage(documentName: string, documentCategory: string) {
    return this.documentTable
      .find('.table-body')
      .contains(documentName)
      .siblings('lib-cell')
      .contains(documentCategory)
  }

  veryfyImageExists(documentName: string) {
    this.documentTable.find('.table-body').contains(documentName).click();
    cy.get('.img-wrapper > img');
  }

  findExistingDocument(documentName: string, mode: string) {
    this.documentTable
      .find('.table-body')
      .contains(documentName)
      .siblings('lib-cell')
      .find('.btn-group .dropdown-toggle .material-icons')
      .click({ force: true })
      cy.get('.dropdown-menu .dropdown-item')
      .contains(mode)
      .click({ force: true });
  }

  imageContainer(fileId:string) {
    return cy.get(`.image-container > a[href*="${documentPath.SRVC_FILE}/${fileId}"]`)
  }

  navigateToDocumentSection() {
    cy.visit(documentPath.DOCS);
    cy.verifyURLContains(documentPath.DOCS);
  }

  navigateToDocumentCategorySection() {
    cy.visit(documentPath.DOC_CATS);
    cy.verifyURLContains(documentPath.DOC_CATS);
  }
}
