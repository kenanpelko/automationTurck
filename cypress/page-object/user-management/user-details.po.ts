import { User } from "../../support/users";
import { constants } from "../../support/constant/user-management";

export default class CreateUser {
    //#region selectors
    get usernameTitle() {
      return cy.get('.card-page-body .form-wrapper .row > :nth-child(1) > :nth-child(1) .form-label');
    }
    get firstNameTitle() {
      return cy.get('.card-page-body .form-wrapper .row > :nth-child(1) > :nth-child(2) .form-label');
    }
    get surnameTitle() {
      return cy.get('.card-page-body .form-wrapper .row > :nth-child(1) > :nth-child(3) .form-label');
    }
    get emailTitle() {
      return cy.get('.card-page-body .form-wrapper .row > :nth-child(1) > :nth-child(4) .form-label');
    }
    get roleTitle() {
      return cy.get('.card-page-body .form-wrapper .row > :nth-child(1) > :nth-child(5) .form-label');
    }
    get setPass() {
      return cy.get('.card-page-body .form-wrapper .row > :nth-child(2) > :nth-child(1) .form-label');
    }
    get repeatPass() {
      return cy.get('.card-page-body .form-wrapper .row > :nth-child(2) > :nth-child(2) .form-label');
    }

    get headerLeftArrow() {
      return cy.get('[class*="back-arrow"]');
    }
    get headerTrashIcon() {
      return cy.get('[class="card-page-header"] [class*="btn-transparent"]');
    }
    get popupDeleteButton() {
      return cy.get('.custom-modal [class*="btn btn-confirm"]');
    }
    get headerCancelButton() {
      return cy.get('[class="card-page-header"] [class*="me-5"] u');
    }
    get headerSaveButton() {
      return cy.get('[class="card-page-header"] [class*="btn-primary"]');
    }
    get imageContainer() {
      return cy.get('[class="image-wrapper"] img');
    }
    get imageClearImageButton() {
      return cy.get('.button-group > .me-2')
    }
    get imageUploadImageButton() {
      return cy.get('div[class*="user-pic"] [class="btn btn-primary"]');
    }
    get imageUploadInput(){
      return cy.get('input[type="file"]');
    }
    get userUserName() {
      return cy.get('[id="username"]');
    }
    get userFirstName() {
      return cy.get('[id="firstName"]');
    }
    get userSurname() {
      return cy.get('[id="lastName"]');
    }
    get userEmail() {
      return cy.get('[id="email"]');
    }
    get userRolesDropdown() {
      return cy.get('[class="ng-select-container"] [class="ng-arrow-wrapper"]');
    }
    get userRolesRemove(){
      return cy.get('[class="ng-clear-wrapper"]');
    }
    get userRoleValueField(){
      return cy.get('[formcontrolname="roles"] [class="ng-value"]');
    }
    get userRolesDropdownElement() {
      return cy.get('[role="option"]');
    }
    get userRolesContainer(){
      return cy.get('[class*="ng-select-container"]');
    }
    get setANewPassword() {
      return cy.get('input[id="password"]');
    }
    get repeatPassword() {
      return cy.get('input[id="confirmPassword"]');
    }
     //#endregion selectors

  clickBackArrow(){
    this.headerLeftArrow.click();
    cy.url().should('include','/user/#/users').should('not.include','/user/#/users/');
  }

  clickBackButton(){
    this.headerCancelButton.click();
    cy.url().should('include','/user/#/users').should('not.include','/user/#/users/');
  }

  clickSaveButton(){

    cy.intercept("POST", constants.user.users).as("createNewUser");

    this.headerSaveButton.should('be.enabled').click();

    cy.wait("@createNewUser").then((data: any) => {
        expect(data.response.statusCode).to.equal(201);
        cy.url().should('include','/user/#/users').should('not.include','/user/#/users/');
    });
  }

  saveEditedChanges(){
    cy.intercept("PUT", constants.user.userIdentity).as("editUser");

    this.headerSaveButton.should('be.enabled').click();

    cy.wait("@editUser").then((data: any) => {
        expect(data.response.statusCode).to.equal(200);
        cy.url().should('include','/user/#/users').should('not.include','/user/#/users/');
    });
  }

  addUserDetails(user: User){

    if(user.userName != undefined){
        this.userUserName.clear().type(user.userName);
    }

    if(user.firstName != undefined){
        this.userFirstName.clear().type(user.firstName);
    }

    if(user.lastName != undefined){
        this.userSurname.clear().type(user.lastName);
    }

    if(user.email != undefined){
        this.userEmail.clear().type(user.email);
    }
    if(user.roles != undefined){

      user.roles.forEach(role => {

          this.userRolesDropdown.click();
          this.userRolesDropdownElement.contains(role).click();
          cy.wait(500);
      });
    }

    if(user.password != undefined){
        this.setANewPassword.clear().type(user.password);
    }

    if(user.passwordRepeat != undefined){
        this.repeatPassword.eq(0).clear().type(user.passwordRepeat);
    }
  }

  verifyUserDetails(user: User){

    if(user.userName != undefined){
      this.userUserName.should("have.value", user.userName);
    }

  if(user.firstName != undefined){
      this.userFirstName.should("have.value", user.firstName);
  }

  if(user.lastName != undefined){
      this.userSurname.should("have.value", user.lastName);
  }

  if(user.email != undefined){
      this.userEmail.should("have.value", user.email);
  }
  if(user.roles != undefined){

    user.roles.forEach(role => {

        this.userRolesDropdownElement.should("contain.text", role);
        cy.wait(500);
    });
  }
  }

  deleteUser(){
    cy.intercept("DELETE", constants.user.userIdentity).as("deleteUser");
    cy.wait(2500);
    this.headerTrashIcon.should('be.visible').click()
    this.popupDeleteButton.should('be.enabled').click();
    cy.wait(5000)
    cy.wait("@deleteUser").then((data: any) => {
      expect(data.response.statusCode).to.equal(204);
      cy.url().should('include','/user/#/users').should('not.include','/user/#/users/');
  });
  }

  uploadImage(imageUrl: string, config = { verify: true }) {
    cy.wait(2000);
    this.imageUploadImageButton.click();
    this.imageUploadInput.attachFile(imageUrl);
    cy.wait(5000);
    if (config.verify === true) {
      this.verifyImageExists();
    }
  }

  verifyImageExists(url=undefined) {
    this.imageContainer.should('not.have.attr','src','assets/icons/incognito.svg');
    this.imageContainer.invoke("attr", "src").then((ele) => {

      if(url != undefined){
        expect(ele).to.equal(url);
      }
      cy.wrap(ele).as("imageUrl");
    });
  }

  verifyImageDoesntExist() {
    this.imageContainer.should('have.attr','src','assets/icons/incognito.svg');
  }

}