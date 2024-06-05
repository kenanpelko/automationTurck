import { constants } from "../../support/constant/user-management";
import { User } from "../../support/users";

export default class UserTable {
    //#region selectors
    get headerSearchUsers() {
      return cy.get('[class="search"] input');
    }
    get headerCreateNewUser() {
      return cy.get('[mode="primary"]');
    }
    get tableRow() {
      return cy.get('div lib-row');
    }
    get tableRowImage() {
      return cy.get('div lib-row [class="image"]');
    }
    get tableRowCell() {
      return cy.get('lib-cell');
    }
    get tableRowEmpty() {
      return cy.get('[class="table-row table-row-empty"]');
    }
  
    get tableNameSort(){
      return cy.get('[libheadersort="name"]');
    }
  
    get tableEmailSort(){
      return cy.get('[libheadersort="email"]');
    }
  
    get userManagementHeader() {
      return cy.get('lib-panel-header h2');
    }
  
    get headerAllUsers() {
      return cy.get('lib-panel-header .tab').eq(0);
    }
  
    get headerRolesAndRights(){
      return cy.get("lib-panel-header .tab").eq(1)
    }

    get noUsersMessage() {
      return cy.get(".table-body-container .table-row span")
    }

     //#endregion selectors

  navigateToUsers() {
    cy.visit(constants.userConstants.user);
    cy.verifyURLContains(constants.userConstants.user);
  }

  startCreatingNewUser(){

    this.headerCreateNewUser.click();
    cy.url().should('include','/user/#/users/create');
  }

  searchUser(query: string, searchIndex = -1, config: any = { verify: true }) {
    this.headerSearchUsers.should("be.enabled").clear().type(query);
    cy.wait(2500);
    if (config.verify == true) {
      cy.get('[class="table-row table-row-empty"]').should('not.exist');
      this.tableRow.eq(searchIndex).find('lib-cell').eq(1).should("contain.text", query);
    }
  }

  verifyUserTableRow(user: User, index){
    if(user.userName != undefined){
      this.tableRow.eq(index).find("lib-cell").eq(1).should('contain.text',user.userName);
    }

    if(user.email != undefined){
      this.tableRow.eq(index).find("lib-cell").eq(2).should('contain.text',user.email);
    }

    user.roles.forEach((role) => {
      this.tableRow.eq(index).find("lib-cell").eq(4).should('contain.text',role);
    });
  }

  startEditingUser(index,user=undefined){
    this.tableRow.eq(index).find("lib-cell").eq(1).click();
    if(user != undefined){
      cy.get('[class*="card-page-title"]').should('contain.text',user);
    }
  }

}