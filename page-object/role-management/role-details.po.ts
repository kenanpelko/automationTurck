import { constants } from "../../support/constant/user-management";
import { Role } from "../../support/role";

export default class RoleDetails {
    //#region selectors

    get nameTitle() {
      return cy.get('.label')
    }
    get assignedRightsTitle() {
      return cy.get('.form-label');
    }
    get roleInput() {
      return cy.get('.inputs .inside-input');
    }
    get roleAssignRight() {
      return cy.get('.column .form-check-label');
    }
    get headerText() {
      return cy.get('[class*="card-page-title"]');
    }
    get headerTrashbinIcon() {
      return cy.get('.header .btn');
    }
    get popupTrashbinIcon() {
        return cy.get('[class="btn btn-danger"]');
    }
    get headerCancelButton() {
      return cy.get('[href="#/roles"]');
    }
    get headerBackButton() {
      return cy.get('[class*="back-arrow"]');
    }
    get headerSaveButton() {
      return cy.get('.card-page-header lib-button');
    }

    //#endregion selectors

  updateRoleDetails(role: Role) {
    if (role.name != undefined) {
      this.roleInput.clear().type(role.name);
    }

    role.assignedRights.forEach((ele: any) => {
      this.roleAssignRight.contains(ele.description["en-EN"].split(" ")[1]).parent().parent().find('[type="checkbox"]').check({force:true});
    });
  }

  uncheckAllRoles(){
  
    this.roleAssignRight.parent().find('.form-check-input').each((ele:any)=>{
      cy.get(ele).uncheck({force:true});
    });
  }

  verifyRoleDetails(role: Role){
    if (role.name != undefined) {
      this.roleInput.should("have.value",role.name);
    }

    role.assignedRights.forEach((ele: any) => {
      this.roleAssignRight.contains(ele.description["en-EN"].split(" ")[1]).parent().parent().find('[type="checkbox"]').should("be.checked");
    });
  }

  clickCancelButton() {
    cy.url().should("include", "/user/#/roles/");
    this.headerCancelButton.click();
    cy.url().should("not.include", "/user/#/roles/").should("include", "/user/#/roles");
  }

  clickBackButton() {
    cy.url().should("include", "/user/#/roles/");
    this.headerBackButton.click();
    cy.url().should("not.include", "/user/#/roles/").should("include", "/user/#/roles");
  }

  clickSaveButton() {
    cy.intercept("POST", constants.endpoints.roles).as("createRole");

    this.headerSaveButton.click();

    cy.wait("@createRole").then((data: any) => {
      expect(data.response.statusCode).to.equal(201);
      cy.url().should("not.include", "/user/#/roles/").should("include", "/user/#/roles");
    });
  }

  editRole() {
    cy.intercept("PUT", constants.endpoints.roleIdentity).as("createRole");

    this.headerSaveButton.click();

    cy.wait("@createRole").then((data: any) => {
      expect(data.response.statusCode).to.equal(200);
      cy.url().should("not.include", "/user/#/roles/").should("include", "/user/#/roles");
    });
  }

  deleteRole() {
    cy.intercept("DELETE", constants.endpoints.roleIdentity).as("deleteRole");
    cy.wait(2500);
    this.headerTrashbinIcon.click();
    cy.wait("@deleteRole").then((data: any) => {
      expect(data.response.statusCode).to.equal(204);
      cy.url().should("not.include", "/user/#/roles/").should("include", "/user/#/roles");
    });
  }

}