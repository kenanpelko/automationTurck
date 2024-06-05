export class MainteancePage {
  get activeTab() {
    return cy.get('.navigation li:nth-child(1)');
  }
  get archiveTab() {
    return cy.get('.navigation li:nth-child(2)');
  }
  get plansTab() {
    return cy.get('.navigation li:nth-child(3)');
  }
  get stepLibraryTab() {
    return cy.get('.navigation li:nth-child(4)');
  }

  get loadingLabel() {
    return cy.get('.ag-overlay-loading-center');
  }
  get navigationTabs() {
    return cy.get('mnt-nav-tabs');
  }
   get errorPopup(){
    return cy.get('[id=toast-container] .toast-message');
  }
}
