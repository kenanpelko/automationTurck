const data = require(`../../../fixtures/i18n/maintenance/${Cypress.env('LANGUAGE')}`);

export class AssignMaintenancePlan {
  get header() {
    return cy.get('h4.modal-title');
  }

  get wrapper() {
    return cy.get('app-modal-assign-maintenance-plan');
  }

  get assignToSelectedAssetsBtn() {
    return cy.get('.modal-footer button');
  }

  get assetCheckbox() {
    return cy.get('span.checkbox-tick');
  }

  get checkboxText() {
    return cy.get('span.checkbox-text');
  }

  get closeButton() {
    return cy.get('.modal-header button');
  }

  chooseAssetByName(assetName: string) {
    this.checkboxText.contains(assetName).siblings().click();
  }

  verifyModalIsOpened() {
    this.wrapper.should('be.visible');
    this.header.should('contain.text', data.assignMaintenancePlanModal.header);
  }
}