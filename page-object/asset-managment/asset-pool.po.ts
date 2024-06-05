export default class AssetPoolTab {
  get tableHeaderName() {
    return cy.get('[libheadersort="name"]');
  }
  get tableHeaderType() {
    return cy.get('[libheadersort="assetType.name"]');
  }
  get tableHeaderId() {
    return cy.get('[libheadersort="id"]');
  }
  get tableHeaderDocument() {
    return cy.get('[libheadersort="documents"]');
  }
  get tableHeaderCreatedAt() {
    return cy.get('[libheadersort="createdAt"]');
  }
  get tableRow() {
    return cy.get('[class="table-body-container"] lib-row');
  }
  get dropdownToggle() {
    return cy.get('[class*="dropdown-toggle"]');
  }
  get threeDots() {
    return cy.get('[class="dropdown-toggle btn btn-transparent btn-icon"]');
  }
  get dropDownDeleteButton() {
    return cy.get('.dropup button.text-danger')
  }

  get createNewAssetButton() {
    return cy.get('app-asset-tabs-outlet [class="btn btn-primary"]');
  }
}