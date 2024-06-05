export class CreateDocumentPage {
    // Inputs
    get nameInput() {
      return cy.get('#name');
    }
    get fileInputField() {
      return cy.get('.btn-upload + input');
    }
  
    // Forms
    get documentCategoryDropdown() {
      return cy.get('.form-dropdown > .dropdown-toggle');
    }
  
    get documentCategory() {
      return cy.get('.form-dropdown-menu')
    }
  
    // Buttons
    get createButton() {
      return cy.get('button.btn-primary').contains('Create document');
    }
    get backBtn() {
      return cy.get('.panel-header > .btn');
    }
    get cancelBtn() {
      return cy.get('.panel-header-actions a');
    }
    get saveChangesBtn() {
      return cy.get('button.btn-primary').contains('Save changes');
    }
  
    // Methods
    selectFromDropdown(value: string) {
      cy.get('.form-dropdown-menu').find('button').contains(value).click();
    }
  
    fillForm(docName: string, docType: string) {
      this.nameInput.type(docName);
      this.documentCategoryDropdown.click();
      this.selectFromDropdown(docType);
    }
  }
  