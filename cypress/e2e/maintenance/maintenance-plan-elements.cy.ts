import { qase } from 'cypress-qase-reporter/dist/mocha';
import { faker } from '@faker-js/faker';

const { MainteancePage } = require('../../page-object/maintenance/maintenance.po');
const { MaintenanceLibrary } = require('../../page-object/maintenance/maintenance-library.po');
const { AssignMaintenancePlan } = require('../../page-object/maintenance/components/assign-maintenance-modal.po');
const { NewMaintenancePlan } = require('../../page-object/maintenance/create-maintenance-plan.po');
const { ConfirmationModal } = require('../../page-object/maintenance/components/confirmation-modal.po');
const { AddDocumentModal } = require('../../page-object/maintenance/components/add-document-modal.po');

const maintenance = new MainteancePage();
const maintenanceLibrary = new MaintenanceLibrary();
const assignMaintenancePlanModal = new AssignMaintenancePlan();
const newMaintenancePlan = new NewMaintenancePlan();
const confirmation = new ConfirmationModal();
const addDocument = new AddDocumentModal();

const data = require(`../../fixtures/i18n/maintenance/${Cypress.env('LANGUAGE')}`); 

let stepName, maintenanceName, planDescription;

describe('Maintenance plan - Close Assign modal by clicking on X button', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    stepName = 'Close assign modal ';
    maintenanceName = stepName + faker.lorem.word() + faker.random.numeric(6);
    planDescription = faker.lorem.word();
    cy.createNewMaintenancePlan(maintenanceName, planDescription, '1');
    cy.navigateToMaintenanceManager();
    maintenance.plansTab.click();
  });

  after(() => {
    cy.deleteMaintenancePlan('@planId');
  });

  qase(
    116,
    it('Verify that the user is able to close Assign modal by clicking on X button', () => {
      maintenanceLibrary.verifyMaintenanceExist(maintenanceName);
      maintenanceLibrary.openPlanMenu(maintenanceName);
      maintenanceLibrary.assignOption.click();
      assignMaintenancePlanModal.verifyModalIsOpened();
      assignMaintenancePlanModal.closeButton.click();
      maintenanceLibrary.wrapper.should('be.visible');
      assignMaintenancePlanModal.wrapper.should('not.exist');
    })
  );
});

describe('Maintenance plans - Navigation', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToMaintenanceManager();
    maintenance.plansTab.click();
  });

  beforeEach(() => {
    maintenanceLibrary.createMaintenance.click();
  });

  qase(
    2,
    it('Verify user can leave Create new plan without saving', () => {
      newMaintenancePlan.wrapper.should('be.visible');
      newMaintenancePlan.cancelButton.click();
      confirmation.wrapper.should('be.visible');
      confirmation.cancelButton.click();
      maintenanceLibrary.wrapper.should('be.visible');
    }),
  );

  qase(
    79,
    it('Click on Breadcrumbs - Maintenance plans', () => {
      newMaintenancePlan.wrapper.should('be.visible');
      cy.verifyURLContains('/procedures/new');
      cy.clickOnBreadcrumbLink(data.navigation.title);
      maintenanceLibrary.wrapper.should('be.visible');
    }),
  );
});

describe('Maintenance plans', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToMaintenanceManager();
    maintenance.plansTab.click();
    maintenanceLibrary.createMaintenance.click();
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
  })

  qase(
    8,
    it('Verify that Interval unit accepting only numbers', () => {
      newMaintenancePlan.intervalUnit.click();
      newMaintenancePlan.intervalUnitOptions.each((item, index) => {
        cy.wrap(item).should('contain.text', data.newMaintenancePlan.intervalUnit[index])
      })
      newMaintenancePlan.intervalUnit.find('input').type('AnyString', { delay: 60 });
      newMaintenancePlan.intervalUnit
        .find('.ng-option-disabled')
        .should('contain', data.newMaintenancePlan.intervalUnitMessage);
    }),
  );

  qase(
    21,
    it('Verify user can close "Add step"', () => {
      newMaintenancePlan.addStepButton.click();
      newMaintenancePlan.stepLibrary.should('be.visible');
      newMaintenancePlan.stepLibraryClose.click();
      newMaintenancePlan.stepLibrary.should('not.exist');
    }),
  );

  qase(
    46,
    it('Verify that "Close" button is working correctly while adding a document in Create New Maintenance plans', () => {
      newMaintenancePlan.addFirstStepButton.click();
      newMaintenancePlan.addDocument.click();
      addDocument.wrapper.should('be.visible');
      addDocument.title.should('contain', data.addDocumentModal.header);
      addDocument.closeButton.click();
      addDocument.wrapper.should('not.exist');
    }),
  );

  qase(
    45,
    it('Verify that "Abort" button is working correctly while adding a document in Create New Maintenance plans', () => {
      // test will fail if it will be standalone runned
      // TODO 80085 - add check "if addDocument button exists => do the following; else => click on `addFirstStepButton` and do the following"
      // can use workaround -> just click on `addStepButton`
      newMaintenancePlan.addDocument.click();
      addDocument.wrapper.should('be.visible');
      addDocument.title.should('contain', data.addDocumentModal.header);
      addDocument.abortButton.click();
      addDocument.wrapper.should('not.exist');
    }),
  );

  qase(
    77,
    it('Verify user can close Leave without saving modal', () => {
      // test must be started at the end of this describe block
      // TODO 80085 - add check "am I on the `Create plan` window?". if yes => do the following; else => click on `createMaintenance`
      // can write it as a separate command and use in each test
      newMaintenancePlan.wrapper.should('be.visible');
      newMaintenancePlan.cancelButton.click();
      confirmation.wrapper.should('be.visible');
      confirmation.closeButton.click();
      confirmation.wrapper.should('not.exist');
    }),
  );
});
