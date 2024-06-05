import ConfirmationModal from "./modal-confirmation.po";

export default class PropertyDetails extends ConfirmationModal {
  get nameField() {
    return cy.get('[id="propertyName"]');
  }
  get defaultValueField() {
    return cy.get('[id="value"]');
  }
  get keyField() {
    return cy.get('[id="key"]');
  }
  get typeDropdown() {
    return cy.get('.modal-content .dropdown-toggle');
  }
  get TypeSelection() {
    return cy.get('.modal-content .dropdown-menu button').first();
  }
  get header() {
    return cy.get('.modal-title');
  }
  get closeButton() {
    return cy.get('.modal-header i');
  }
  get mandatoryCheckbox() {
    return cy.get('[formcontrolname="isRequired"] span.checkbox-tick');
  }
  get displayCheckbox() {
    return cy.get('[formcontrolname="display"] span.checkbox-tick');
  }
  get submitButton() {
    return cy.get('.modal-footer button');
  }

  addDynamicPropertyDetails(dynamicPropertie: any) {
    this.typeDropdown.click();
    this.TypeSelection.click();

    if (dynamicPropertie.propertyName !== undefined) {
      this.nameField.clear().type(dynamicPropertie.propertyName);
    }

    if (dynamicPropertie.defaultValue !== undefined) {
      this.defaultValueField.clear().type(dynamicPropertie.defaultValue);
    }

    if (dynamicPropertie.key !== undefined) {
      this.keyField.clear().type(dynamicPropertie.key);
    }
  }

  clickSubmitButton() {
    this.submitButton.click();
    cy.wait(2000);
  }

  editDynamicPropertyDetails() {
    this.nameField.type('EDITED');
    this.defaultValueField.type('EDITED');
    this.keyField.clear().type('EDITED');
    this.mandatoryCheckbox.click();
  }
}
