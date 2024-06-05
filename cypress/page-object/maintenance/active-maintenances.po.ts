export class ActiveMaintenances {
  get assetNameSpan() {
    return cy.get('span.label');
  }

  get procedureNameCell() {
    return cy.get('[col-id="procedureName"][role="gridcell"]');
  }

  get titleSearchInput() {
    return cy.get('ag-grid-text-search-floating-filter input');
  }

  get wrapper() {
    return cy.get('mnt-maintenance-executions .app-body');
  }

  get assetIdCell() {
    return cy.get('.ag-center-cols-clipper [col-id="asset.id"]');
  }

  get assetIdInput() {
    return cy.get('.ng-value-container [role="combobox"]>input').last();
  }

  get dropdownOptions() {
    return cy.get('div.ng-option');
  }

  get progressBar() {
    return cy.get('ngb-progressbar');
  }

  openAssetAndPlan(assetName, maintenanceName) {
    this.assetNameSpan.contains(assetName).click().wait(3000);
    this.procedureNameCell.contains(maintenanceName).should('be.visible').click();
  }

  openAssetPlan(assetName) {
    this.assetNameSpan.contains(assetName).click();
  }

  verifyPlansCountSteps(maintenanceName, countOfSteps) {
    this.procedureNameCell.contains(maintenanceName).parent().then(($row) => {
      const rowId = $row.attr('row-id')
      this.wrapper.find('.ag-center-cols-viewport [row-id=' + rowId + ']').find('[role="progressbar"]', {timeout: 30000})
        .invoke('attr', 'aria-valuenow')
        .should('equal', countOfSteps)
    });
  }
}
