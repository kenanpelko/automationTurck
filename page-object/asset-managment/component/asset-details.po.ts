import ConfirmationModal from "./modal-confirmation.po";

export default class AliasDetails extends ConfirmationModal {
  get name() {
    return cy.get('#alias');
  }

  get typeDropdown() {
    return cy.get('#type');
  }

  get dropdownOption() {
    return cy.get('app-add-alias-modal ng-dropdown-panel[role="listbox"]');
  }

  get description() {
    return cy.get('app-add-alias-modal [id="aliasDescription"]');
  }

  get aliasPopupTitle() {
    return cy.get('app-add-alias-modal [class="modal-title"]');
  }

  get aliasSubmitButton() {
    return cy.get('.modal-content .btn-primary');
  }

  get aliasCancelButton() {
    return cy.get('.modal-content .btn-outline-secondary');
  }

  get aliasXButton() {
    return cy.get('.modal-content i');
  }
}
