import { constants } from "../../support/constant/user-management";
import { Role } from "../../support/role";

export default class RoleTable {
    //#region selectors
  
    get headerCreateNewRole() {
      return cy.get('[mode="primary"]');
    }
    get tableRow() {
      return cy.get(".table-row");
    }
    get tableRowCell() {
      return cy.get("lib-cell");
    }
  
    get tableTrashIcon(){
      return cy.get('[src="assets/icons/delete.svg"]')
    }
  
    get tableNameSort() {
      return cy.get('[libheadersort="name"]');
    }
  
    get tableDropDownItem(){
      return cy.get('[class="text-right dropdown-menu show"] [class="dropdown-item"]');
    }
  
    get userManagementHeader() {
      return cy.get("lib-panel-header h2");
    }
  
    get headerAllUsers() {
      return cy.get("lib-panel-header .tab").eq(0);
    }
  
    get headerRolesAndRights() {
      return cy.get("lib-panel-header .tab").eq(1);
    }
    get noRolesMessage() {
      return cy.get(".table-body-container .table-row span")
    }

    //#endregion selectors

  navigateToRoles(){
    cy.setAppLanguage("en_EN");
    cy.visit(constants.userConstants.roles);
    cy.setAppLanguage("en_EN");
    cy.reload();
    cy.verifyURLContains(constants.userConstants.roles);
    
  }

  startCreatingNewRole() {
    this.headerCreateNewRole.click();
    cy.url().should("include", "/user/#/roles/");
  }

  verifyUserTableRow(role: Role, index) {
    if (role.name != undefined) {
      this.tableRow.eq(index).find("lib-cell").eq(1).should("contain.text", role.name);
    }
  }

  startEditingRole(index, role = undefined) {
    cy.wait(2000);
    this.tableRow.eq(index).click();
    if (role != undefined) {
      cy.get('[class*="card-page-title"]').should("contain.text", role);
    }
  }

  startEditingRoleByName(name){
    cy.wait(2000);
    this.tableRow.contains(name).parents('lib-row').click();
    cy.get('[class*="card-page-title"]').should("contain.text", name);
  }

  deleteRoleByName(name){
    cy.wait(2000);
    this.tableRow.contains(name).find('[src="assets/icons/delete.svg"]').parent().click();       
    cy.get('[class*="card-page-title"]').should("contain.text", name);
  }

  verifyRoleDoesntExist(name){
    cy.wait(2000);
    this.tableRow.contains(name).should("not.exist");    
    
  }
}