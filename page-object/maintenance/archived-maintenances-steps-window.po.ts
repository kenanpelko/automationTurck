export class ArchivedMaintenancesSteps {
  get navigationPanel() {
    return cy.get('div#navigation');
  }

  get stepDetailsWrapper() {
    return cy.get('mnt-maintenance-step-detail');
  }

  get wrapper() {
    return cy.get('mnt-maintenance-execution-detail');
  }

  get openDetailsBtn() {
    return cy.get('.card-body .btn-transparent');
  }

  get progressBar() {
    return cy.get('[role="progressbar"]');
  }
}
