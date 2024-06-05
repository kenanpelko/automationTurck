import { qase } from 'cypress-qase-reporter/dist/mocha';
import { faker } from '@faker-js/faker';
import { maintenancePath } from '../../support/constant/maintenance';
import 'cypress-file-upload';

const { MainteancePage } = require('../../page-object/maintenance/maintenance.po');
const { MaintenanceLibrary } = require('../../page-object/maintenance/maintenance-library.po');
const { AssignMaintenancePlan } = require('../../page-object/maintenance/components/assign-maintenance-modal.po');
const { ActiveMaintenances } = require('../../page-object/maintenance/active-maintenances.po');
const { NewMaintenancePlan } = require('../../page-object/maintenance/create-maintenance-plan.po');
const { AddImage } = require('../../page-object/maintenance/components/add-image.po');
const { MaintenaceStepLibraryPage } = require('../../page-object/maintenance/maintenance-step-library.po');
const { AddDocumentModal } = require('../../page-object/maintenance/components/add-document-modal.po');
import AssetPoolAPI from '../../support/request/asset-pool-request';
import generateRandomAsset from '../../support/helpers/asset';

const documentName = `Document - ${faker.datatype.number()}`;
const documentType = `Type - ${faker.datatype.number()}`;

const maintenance = new MainteancePage();
const maintenanceLibrary = new MaintenanceLibrary();
const assignMaintenancePlanModal = new AssignMaintenancePlan();
const activeMaintenancesTab = new ActiveMaintenances();
const newMaintenancePlan = new NewMaintenancePlan();
const image = new AddImage();
const maintenanceStep = new MaintenaceStepLibraryPage();
const documentModal = new AddDocumentModal();
const data = require(`../../fixtures/i18n/maintenance/${Cypress.env('LANGUAGE')}`); 
const assetPoolAPI = new AssetPoolAPI();
let asset = generateRandomAsset();

let stepName, maintenanceName, planDescription, newStepName, maintenanceDescription;


describe('Maintenance plan - Assign plan to the asset', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    assetPoolAPI.addAsset(asset);
    stepName = 'Assign asset ';
    maintenanceName = stepName + faker.lorem.word() + faker.random.numeric(6);
    planDescription = faker.lorem.word();
    cy.createNewMaintenancePlan(maintenanceName, planDescription, '1');
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.visit(Cypress.env('URL') + maintenancePath.maintenancePlansTabPath);
    maintenanceLibrary.wrapper.should('be.visible');
  })

  after(function () {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.deleteMaintenancePlanWithoutWrapper(this.planId);
  });

  qase(
    115,
    it('Verify that the user successfully assigned plan to the asset', () => {
      maintenance.loadingLabel.should('not.exist', { timeout: 10000 });
      maintenanceLibrary.optionsColumn.should('be.visible', { timeout: 10000 });
      // this wait needs to prevent "AG Grid: cannot get grid to draw rows" error
      cy.wait(1000);
      maintenanceLibrary.verifyMaintenanceExist(maintenanceName);
      maintenanceLibrary.openPlanMenu(maintenanceName);
      maintenanceLibrary.assignOption.click();
      assignMaintenancePlanModal.verifyModalIsOpened();
      assignMaintenancePlanModal.chooseAssetByName(asset.name);
      assignMaintenancePlanModal.assignToSelectedAssetsBtn.click();
      maintenanceLibrary.wrapper.should('be.visible');
      maintenance.activeTab.click();
      maintenance.loadingLabel.should('not.exist');
      activeMaintenancesTab.assetNameSpan.contains(asset.name).click();
      activeMaintenancesTab.procedureNameCell.contains(maintenanceName).should('be.visible');
    })
  );

  // skipped. Plan can not be unassigned from the asset
  qase(
    118,
    it.skip('Verify that user can unassign plan', () => {
      maintenanceLibrary.openPlanMenu(maintenanceName);
      maintenanceLibrary.assignOption.click();
      assignMaintenancePlanModal.verifyModalIsOpened();
      assignMaintenancePlanModal.chooseAssetByName(asset.name);
      assignMaintenancePlanModal.assignToSelectedAssetsBtn.click();
      maintenanceLibrary.wrapper.should('be.visible');
      assignMaintenancePlanModal.wrapper.should('not.exist');
      maintenance.activeTab.click();
      maintenance.loadingLabel.should('not.exist');
      activeMaintenancesTab.assetNameSpan.contains(asset.name).click();
      activeMaintenancesTab.procedureNameCell.contains(maintenanceName).should('not.exist');
    })
  );
});

describe.only('Maintenance plans - Create new plan - Media', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToMaintenanceManager();
    maintenance.plansTab.click();
    maintenanceLibrary.createMaintenance.click();
    newMaintenancePlan.wrapper.should('be.visible');
    cy.verifyURLContains('/procedures/new');
    newMaintenancePlan.addStepButton.click();
    newMaintenancePlan.createNewStepBtn.click();
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
  })

  qase(
    80,
    it('Verify that "Delete" button in Images Section is working correctly while Creating a new Maintenance plan', () => {
      cy.intercept('POST', Cypress.env('URL') + maintenancePath.newPlanMediaPath).as('imageUploaded');
      cy.intercept('DELETE', maintenancePath.newPlanMediaPath + '/*').as('imageDeleted');
      image.uploadElement.attachFile('images/stockholm.jpeg');
      cy.wait('@imageUploaded')
      image.deleteImage('stockholm.jpeg');
      cy.wait('@imageDeleted');
      image.verifyImageIsUploaded('stockholm.jpeg', false);
    })
  );

  qase(
    81,
    it('Verify that "Delete" button in Documents Section is working correctly while Creating a new maintenance plan', () => {
      cy.createDocumentType(documentType);
      cy.createDocument(documentName, 'images/stockholm.jpeg');
      maintenanceStep.addDocumentButton.click();
      documentModal.wrapper.should('be.visible');
      documentModal.title.should('be.visible');
      documentModal.checkboxDocument.eq(0).click();
      documentModal.addSelectedDocsBtn.click();
      newMaintenancePlan.documentAdded.should('be.visible');
      newMaintenancePlan.deleteDocumentBtn.click();
      newMaintenancePlan.documentAdded.should('not.exist');
    })
  );

  qase(
    11,
    it('Verify that "add image" is working correctly', () => {
      cy.intercept('POST', Cypress.env('URL') + maintenancePath.newPlanMediaPath).as('imageUploaded');
      image.uploadElement.attachFile('images/stockholm.jpeg');
      cy.wait('@imageUploaded');
      image.verifyImageIsUploaded('stockholm.jpeg', true);
    })
  );

  qase(
    13,
    it('Verify that "add document" is working correctly', () => {
      cy.createDocumentType(documentType);
      cy.createDocument(documentName, 'images/stockholm.jpeg');
      maintenanceStep.addDocumentButton.click();
      documentModal.wrapper.should('be.visible');
      documentModal.title.should('be.visible');
      documentModal.checkboxDocument.eq(0).click();
      documentModal.addSelectedDocsBtn.click();
      newMaintenancePlan.documentAdded.should('be.visible');
    })
  );

  after(function () {
    cy.deleteDocument(String(this.docId))
    cy.deleteDocumentType(String(this.docTypeId));
});
});



describe('Maintenance plan - Create new plan - Negative', () => {
  let maintenanceName = faker.lorem.word();;
  let maintenanceDescription = faker.lorem.sentence();

  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToMaintenanceManager();
    maintenance.plansTab.click();
    maintenanceLibrary.createMaintenance.click();
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
  });

  qase(
    87,
    it('Verify that Saving without adding steps is not possible', () => {
      newMaintenancePlan.procedureNameInput.type(maintenanceName);
      newMaintenancePlan.selectAssetType('Generic');
      newMaintenancePlan.description.type(maintenanceDescription);
      newMaintenancePlan.intervalInput.type('2');
      newMaintenancePlan.createButton.should('be.disabled');
    }));

  qase(
    88,
    it('Verify that user is not able to create plan with Procedure name longer than 100 characters', () => {
      cy.intercept('POST', Cypress.env('URL') + maintenancePath.maintenancePlansPath).as('planCreated');
      // Enter new maintenance data
      newMaintenancePlan.procedureNameInput.type('Title 111 ' + faker.random.numeric(101));
      newMaintenancePlan.selectAssetType('Generic');
      newMaintenancePlan.description.type(maintenanceDescription);
      newMaintenancePlan.intervalInput.type('42');
      // Add one step
      newMaintenancePlan.addStepButton.click();
      newMaintenancePlan.createNewStepBtn.click();
      newMaintenancePlan.newStepTitle.type('Title 111');
      newMaintenancePlan.newStepDescription.type(faker.lorem.sentence(101));
      newMaintenancePlan.createButton.click();
      newMaintenancePlan.errorPopup.should('contain', data.error.general)
    })
  );
});

describe('Maintenance plan - Create new plan - Positive', () => {
  maintenanceDescription = faker.lorem.sentence();

  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.visit(Cypress.env('URL') + maintenancePath.maintenancePlansTabPath);
    maintenanceLibrary.wrapper.should('be.visible');
    maintenanceLibrary.createMaintenance.click();
  })

  afterEach(function () {
    cy.deleteMaintenancePlanWithoutWrapper(this.planId);
  });

  qase(
    86,
    it('Verify that User is able to create new maintenance plan', () => {
      maintenanceName = `Create new plan ${faker.lorem.word()}`;

      cy.intercept('POST', Cypress.env('URL') + maintenancePath.maintenancePlansPath).as('planCreated');
      // Enter new maintenance data
      newMaintenancePlan.procedureNameInput.type(maintenanceName);
      newMaintenancePlan.selectAssetType('Generic');
      newMaintenancePlan.description.type(maintenanceDescription);
      newMaintenancePlan.intervalInput.type('2');
      newMaintenancePlan.addStepButton.click();
      newMaintenancePlan.createNewStepBtn.click();
      newMaintenancePlan.newStepTitle.type(faker.lorem.word());
      newMaintenancePlan.newStepDescription.type(faker.lorem.sentence());
      newMaintenancePlan.createButton.click();
      cy.wait('@planCreated').its('response.body.data.id').as('planId');
      // Verify maintenance is created
      maintenanceLibrary.wrapper.should('be.visible');
      maintenanceLibrary.loadingLabel.should('not.exist');
      maintenanceLibrary.verifyMaintenanceExist(maintenanceName);
    }));

  qase(
    3,
    it('Verify can we "Add step" in Maintances step', () => {
      maintenanceName = `Add step ${faker.lorem.word()}`;
      let countOfSteps = '1';
      cy.intercept('POST', Cypress.env('URL') + maintenancePath.maintenancePlansPath).as('planCreated');
      // Enter new maintenance data
      newMaintenancePlan.procedureNameInput.type(maintenanceName);
      newMaintenancePlan.selectAssetType('Generic');
      newMaintenancePlan.description.type(maintenanceDescription);
      newMaintenancePlan.intervalInput.type('42');
      // Add one step
      newMaintenancePlan.addStepButton.click();
      newMaintenancePlan.createNewStepBtn.click();
      newMaintenancePlan.newStepTitle.type(faker.lorem.word());
      newMaintenancePlan.newStepDescription.type(faker.lorem.sentence());
      newMaintenancePlan.createButton.click();
      cy.wait('@planCreated').its('response.body.data.id').as('planId');
      maintenanceLibrary.wrapper.should('be.visible');
      maintenanceLibrary.loadingLabel.should('not.exist');
      maintenanceLibrary.expectCountOfSteps(maintenanceName, countOfSteps);
    })
  );

  qase(
    4,
    it('Verify can we "Add the first step" in Maintances step', () => {
      maintenanceName = `Add the first step ${faker.lorem.word()}`;
      let countOfSteps = '1';
      cy.intercept('POST', Cypress.env('URL') + maintenancePath.maintenancePlansPath).as('planCreated');
      // Enter new maintenance data
      newMaintenancePlan.procedureNameInput.type(maintenanceName);
      newMaintenancePlan.selectAssetType('Generic');
      newMaintenancePlan.description.type(maintenanceDescription);
      newMaintenancePlan.intervalInput.type('44');
      // Add first step
      newMaintenancePlan.addFirstStepButton.click();
      newMaintenancePlan.newStepTitle.type(faker.lorem.word());
      newMaintenancePlan.newStepDescription.type(faker.lorem.sentence());
      newMaintenancePlan.createButton.click();
      cy.wait('@planCreated').its('response.body.data.id').as('planId');
      maintenanceLibrary.loadingLabel.should('not.exist');
      maintenanceLibrary.wrapper.should('be.visible');
      maintenanceLibrary.expectCountOfSteps(maintenanceName, countOfSteps);
    })
  );
});

describe('Maintenance plan - Create new plan - Search step functionality', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToMaintenanceManager();
    maintenance.plansTab.click();
  });

  after(() => {
    cy.deleteMaintenanceStep('@stepId');
  });

  qase(
    22,
    it('Verify that search functionality of Choose maintenance step from library', () => {
      stepName = 'Search step from library ';
      newStepName = stepName + faker.lorem.word();
      cy.createNewMaintenanceStep(newStepName);
      maintenanceLibrary.createMaintenance.click();
      newMaintenancePlan.addStepButton.click();
      newMaintenancePlan.searchInputAddStep.click().type(newStepName);
      newMaintenancePlan.searchResultAddStep.should('have.text', newStepName);
    }),
  );
});

describe('Maintenance plans - Actions with steps', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.visit(Cypress.env('URL') + maintenancePath.maintenancePlansTabPath);
    maintenanceLibrary.wrapper.should('be.visible');
    cy.createNewMaintenanceStep('Test ' + faker.datatype.number());
  })

  qase(
    12,
    it('Verify that "remove step" is working correctly', () => {
      stepName = 'Remove step ';
      maintenanceName = stepName + faker.lorem.word();
      let planDescription = faker.lorem.word();
      cy.intercept('GET', Cypress.env('URL') + maintenancePath.maintenancePlansPath).as('dataLoaded');
      // creating plan with one step
      cy.createNewMaintenancePlan(maintenanceName, planDescription, '1');
      // wait until page will fully loaded
      maintenanceLibrary.wrapper.should('be.visible');
      maintenanceLibrary.loadingLabel.should('not.exist');
      cy.wait('@dataLoaded').its('response.statusCode').should('eq', 200);
      maintenanceLibrary.optionsColumn.should('be.visible', { timeout: 10000 });
      // open edit option
      maintenanceLibrary.openPlanMenu(maintenanceName);
      maintenanceLibrary.editOption.click();
      // check that plan has one step
      newMaintenancePlan.maintenanceStepsHeader.should('contain', '(3)');
      // remove step
      newMaintenancePlan.removeStepButton.click();
      newMaintenancePlan.maintenanceStepsHeader.should('contain', '(2)');
    }),
  );

  qase(
    30,
    it('Verify user can select all steps on checkbox', () => {
      maintenanceLibrary.createMaintenance.click();
      newMaintenancePlan.addStepButton.click();
      newMaintenancePlan.checkAllBox.click();
      newMaintenancePlan.checkboxInput.each((input) => {
        cy.wrap(input).should('be.checked');
      });
    })
  );
});

describe('Maintenance plans - Tags', () => {
  let maintenanceName = `Add step ${faker.lorem.word()} ${faker.datatype.number().toString()}`;
  let newStepName = faker.lorem.word() + faker.datatype.number().toString();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToMaintenanceManager();
    maintenance.plansTab.click();
    cy.intercept('GET', Cypress.env('URL') + maintenancePath.maintenancePlansPath).as('dataLoaded');
    // creating plan with one step
    cy.createNewMaintenancePlan(maintenanceName, planDescription, '1');
    cy.createNewMaintenanceStep(newStepName);
  });

  qase(
    23,
    it('Verify that dropdown of Tags column working correctly in " add step window "', () => {
      maintenanceDescription = faker.lorem.sentence();
      maintenanceLibrary.createMaintenance.click();

      // Actions in step library popup
      newMaintenancePlan.addStepButton.click();
      cy.wait(2000);
      newMaintenancePlan.tagsDropdown.click();
      cy.selectOptionFromDropdown('tag-' + newStepName);
      newMaintenancePlan.stepLibraryName.should('contain', newStepName);
      newMaintenancePlan.stepLibrary.should('have.length', 1);
    })
  );

  after(function () {
    cy.deleteMaintenancePlanWithoutWrapper(this.planId);
    cy.deleteMaintenanceStepWithoutWrapper(this.stepId);
  });
});