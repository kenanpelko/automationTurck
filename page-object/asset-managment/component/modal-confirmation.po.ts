export default class ConfirmationModal {
    get wrapper() {
      return cy.get('div.modal-content');
    }
  
    get title() {
      return this.wrapper.find('.modal-title');
    }
  
    get message() {
      return this.wrapper.find('.modal-body > p');
    }
  
    get xButton() {
      return this.wrapper.find('.modal-header button');
    }
  
    get cancelButton() {
      return this.wrapper.find('.modal-footer .btn-outline-secondary');
    }
  
    get confirmationButton() {
      return this.wrapper.find('.modal-footer button:nth-child(2)');
    }

    get submitButton() { 
      return this.wrapper.find('.modal-footer .btn-primary');
    }
  }
