const { MainteancePage } = require('../../page-object/maintenance/maintenance.po');
const { MaintenaceStepLibraryPage } = require('../../page-object/maintenance/maintenance-step-library.po');
const { CreateMaintenanceSteps } = require('../../page-object/maintenance/create-maintenance-step.po');
const { AddImage } = require('../../page-object/maintenance/components/add-image.po');

import { faker } from '@faker-js/faker';
import { qase } from 'cypress-qase-reporter/dist/mocha';
import { maintenancePath } from '../../support/constant/maintenance';

const maintenance = new MainteancePage();
const maintenanceStep = new MaintenaceStepLibraryPage();
const createStep = new CreateMaintenanceSteps();
const image = new AddImage();
const data = require(`../../fixtures/i18n/maintenance/${Cypress.env('LANGUAGE')}`); 

describe('Step library - Form details', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToMaintenanceManager();
    maintenance.stepLibraryTab.click();
    maintenanceStep.wrapper.should('be.visible');
    maintenanceStep.createStep.click({ force: true });
  });

  qase(
    32,
    it('Verify that SAVE CHANGES button while Creating a New Maintenance step is working correctly', () => {
      let title = 'Save changes ' + faker.lorem.word() + faker.random.numeric(4);
      let description = faker.lorem.sentence();
      let tag = faker.lorem.word() + faker.random.numeric(5);
      cy.intercept('POST', Cypress.env('URL') + maintenancePath.newStepCreatedPath).as('stepCreated');

      createStep.titleField.type(title);
      createStep.descriptionField.type(description);
      createStep.tagsDropdown.click().type(tag);
      cy.addNewTagFromDropdown(data.tags.addTag);
      createStep.saveButton.click({ force: true });
      cy.wait('@stepCreated').its('response.body.data.id').as('stepId');
      cy.verifyURLContains('/steps-library');
      maintenanceStep.loadingLabel.should('not.exist');
      maintenanceStep.wrapper.should('be.visible');
      maintenanceStep.optionsColumn.should('be.visible');
      cy.verifyStepInTable(title, tag);
    }),
  );

  after(() => {
    cy.deleteMaintenanceStep('@stepId');
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});

describe('Step library - Images section', () => {
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToMaintenanceManager();
    maintenance.stepLibraryTab.click();
    maintenanceStep.wrapper.should('be.visible');
    maintenanceStep.createStep.click({ force: true });
  });

  qase(
    33,
    it('Verify that ADD IMAGE button while Creating a New Maintenance step  is working correctly', () => {
      image.uploadElement.attachFile('images/stockholm.jpeg');
      cy.wait(2000);
      image.verifyImageIsUploaded('stockholm.jpeg', true);
    }),
  );

  qase(
    34,
    it('Verify that DELETE button in Images Section is working correctly while Creating a New Maintenance step', () => {
      image.uploadElement.attachFile('images/stockholm.jpeg');
      cy.wait(5000);
      image.deleteImage('stockholm.jpeg');
      cy.wait(1000);
      image.verifyImageIsUploaded('stockholm.jpeg', false);
    }),
  );
});

describe('Step library - Create new step - Negative', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToMaintenanceManager();
    maintenance.stepLibraryTab.click();
    maintenanceStep.wrapper.should('be.visible');
    maintenanceStep.createStep.click({ force: true });
  });

  qase(
    90,
    it('Verify that user is not able to create step with Title longer than 100 characters', () => {
      let responseError = 'Request validation of body failed, because: \"name\" length must be less than or equal to 100 characters long'
      cy.intercept('POST', Cypress.env('URL') + maintenancePath.newStepCreatedPath).as('postError');
      createStep.titleField.type('Title 111 ' + faker.random.numeric(101));
      createStep.descriptionField.type(faker.lorem.sentence());
      createStep.saveButton.click();
      cy.wait('@postError').then(({ response }) => {
        expect(response.statusCode).to.eq(400)
        expect(response.body.error).to.eq(responseError)
      });
      maintenance.errorPopup.should('contain', 'Request validation of body failed, because: "name" length must be less than or equal to 100 characters long');
    }),
  );
});
