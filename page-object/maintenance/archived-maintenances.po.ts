const data = require(`../../fixtures/i18n/maintenance/${Cypress.env('LANGUAGE')}`);
import { maintenancePath } from '../../support/constant/maintenance';

export class ArchivedMaintenancesTab {
  get mainTitle() {
    return cy.get('p.title');
  }

  get tableWrapper() {
    return cy.get('mnt-maintenance-executions-archive-table');
  }

  get loadingLabel() {
    return cy.get('span.ag-overlay-loading-center');
  }

  get dropdownArrow() {
    return cy.get('.pill-select .ng-arrow');
  }

  get dropdownPanelItems() {
    return cy.get('div.ng-dropdown-panel-items');
  }

  get assetIdCell() {
    return cy.get('[col-id="asset.id"]');
  }

  get tableHeaderCell() {
    return cy.get('.ag-header-cell-text');
  }
  
  get titleColumn() {
    return cy.get('.ag-pinned-left-cols-container');
  }

  get ascendingIcon() {
    return cy.get('[ref="eSortAsc"]');
  }

  verifyTabLoaded() {
    this.tableWrapper.should('be.visible');
    this.mainTitle.should('contain', data.archivedMaintenance.leftMainTitle).and('contain', data.archivedMaintenance.rightMainTitle);
    this.loadingLabel.should('not.exist');
  }

  planCreateAssign(planName, assetId) {
    cy.request('POST', Cypress.env('URL') + maintenancePath.maintenancePlansPath, 
    {
      "name": planName,
      "description": "standart test desc",
      "interval": '1',
      "intervalUnit": "hours",
      "assetTypeId": "97a9407c-ce04-4268-83cf-e1da782bcf13",
      "steps": [
        {
          "name": "step_01 " + planName,
          "mandatory": true,
          "skippable": true,
          "type": "description",
          "description": "step_01",
          "content": {
            "images": [],
            "documents": []
          }
        }
      ]
    }).its('body').then(body => {
      let id = body.data.id;
      cy.wrap(id).as('secondPlanId');
      cy.request('POST', Cypress.env('URL') + maintenancePath.maintenancePlansPath + '/' + id + '/assign/' + assetId);
    });
  }
}
