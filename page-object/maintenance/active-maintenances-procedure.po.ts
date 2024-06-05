export class ActiveMaintenancesProcedureWindow {
  get stepsHeader() {
    return cy.get('div.steps-header');
  }

  get stepsBody() {
    return cy.get('div.steps-body');
  }

  get backButton() {
    return cy.get('a.btn>u');
  }

  get markStepErrorBtn() {
    return cy.get('.btn-danger');
  }

  get skipStepBtn() {
    return cy.get('.btn-warning');
  }

  get markStepDoneBtn() {
    return cy.get('.btn-success');
  }

  get stepListItem() {
    return cy.get('div.step-list-item');
  }

  get stepList() {
    return cy.get('div.step-list');
  }

  get stepDone() {
    return cy.get('div.done');
  }

  get statusIcon() {
    return cy.get('span.badge');
  }

  get markMaintenanceDoneBtn() {
    return cy.get('button.btn-primary');
  }

  checkStatusIcon(backColor, iconText) {
    this.statusIcon.should('be.visible')
      .and('have.css', 'background-color', backColor)
      .and('contain', iconText)
  }
}
