import { faker } from '@faker-js/faker';
import { maintenancePath } from '../../support/constant/maintenance/index';
import generateRandomAsset from '../../support/helpers/asset';

const { MainteancePage } = require('../../page-object/maintenance/maintenance.po');
const { CreateMaintenanceSteps } = require('../../page-object/maintenance/create-maintenance-step.po');
const { MaintenaceStepLibraryPage } = require('../../page-object/maintenance/maintenance-step-library.po');
const { NewMaintenancePlan } = require('../../page-object/maintenance/create-maintenance-plan.po');
const { MaintenanceLibrary } = require('../../page-object/maintenance/maintenance-library.po');
const { AssignMaintenancePlan } = require('../../page-object/maintenance/components/assign-maintenance-modal.po');
const { ActiveMaintenances } = require('../../page-object/maintenance/active-maintenances.po');
const { ActiveMaintenancesProcedureWindow } = require('../../page-object/maintenance/active-maintenances-procedure.po');
const { ArchivedMaintenancesTab } = require('../../page-object/maintenance/archived-maintenances.po');
import AssetPoolAPI from '../../support/request/asset-pool-request';

const maintenance = new MainteancePage();
const createStep = new CreateMaintenanceSteps();
const maintenanceStep = new MaintenaceStepLibraryPage();
const newMaintenancePlan = new NewMaintenancePlan();
const maintenanceLibrary = new MaintenanceLibrary();
const assignMaintenancePlanModal = new AssignMaintenancePlan();
const activeMaintenancesTab = new ActiveMaintenances();
const activeProcedureWindow = new ActiveMaintenancesProcedureWindow();
const archivedMaintenances = new ArchivedMaintenancesTab();
const assetPoolAPI = new AssetPoolAPI();
let asset = generateRandomAsset();

//TEST SKIPPED BECAUSE OF AN ACTIVE ISSUE (https://gitlab.elunic.software/turck/myturck/-/issues/237)
describe.skip('Archived maintenances - E2E flow', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    assetPoolAPI.addAsset(asset);
    cy.navigateToMaintenanceManager();
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
  })

  after(() => {
    cy.deleteMaintenanceStep('@stepId1');
    cy.deleteMaintenanceStep('@stepId2');
    cy.deleteMaintenancePlan('@planId');
    assetPoolAPI.deleteAllAllocatedAssets();
  });

  it('Create steps and plan. Assign plan. Archive and verify', () => {
    let title = 'Step Flow ' + faker.random.numeric(6);
    let description = faker.lorem.sentence();
    let maintenanceName = "Plan Flow " + faker.random.numeric(6);
    let maintenanceDescription = faker.lorem.sentence();

    // create two steps
    maintenance.stepLibraryTab.click();
    maintenanceStep.wrapper.then(() => {
      for (let i = 1; i < 3; i++) {
        cy.intercept('POST', Cypress.env('URL') + maintenancePath.newStepCreatedPath).as('stepCreated'+i);
        maintenanceStep.createStep.click();
        createStep.titleField.type(title + ' 00' + i);
        createStep.descriptionField.type(description);
        createStep.saveButton.click({ force: true });
        maintenanceStep.loadingLabel.should('not.exist');
        maintenanceStep.wrapper.should('be.visible');
        maintenanceStep.optionsColumn.should('be.visible');
        cy.wait('@stepCreated'+i).its('response.body.data.id').as('stepId'+i);
      }
    });

    // create plan
    cy.intercept('POST', Cypress.env('URL') + maintenancePath.maintenancePlansPath).as('planCreated');
    maintenance.plansTab.click();
    maintenanceLibrary.createMaintenance.click();
    newMaintenancePlan.procedureNameInput.type(maintenanceName);
    newMaintenancePlan.selectAssetType('Generic');
    newMaintenancePlan.description.type(maintenanceDescription);
    newMaintenancePlan.intervalInput.type('2');
    newMaintenancePlan.addStepButton.click();
    newMaintenancePlan.searchInputAddStep.click().type(title);
    newMaintenancePlan.searchResultAddStep.should('contain', title);
    newMaintenancePlan.checkAllBox.click();
    newMaintenancePlan.addSelectedStepsBtn.should('not.be.disabled').click();
    newMaintenancePlan.createButton.click();
    cy.wait('@planCreated').its('response.body.data.id').as('planId');
    maintenanceLibrary.wrapper.should('be.visible');
    maintenanceLibrary.loadingLabel.should('not.exist');
    maintenanceLibrary.verifyMaintenanceExist(maintenanceName);

    // assign plan to the asset
    maintenanceLibrary.openPlanMenu(maintenanceName);
    maintenanceLibrary.assignOption.click();
    assignMaintenancePlanModal.verifyModalIsOpened();
    assignMaintenancePlanModal.chooseAssetByName(asset.name);
    assignMaintenancePlanModal.assignToSelectedAssetsBtn.click();

    // execute steps
    maintenance.activeTab.click();
    maintenance.loadingLabel.should('not.exist');
    activeMaintenancesTab.assetNameSpan.contains(asset.name).click().wait(5000);
    activeMaintenancesTab.procedureNameCell.contains(maintenanceName).click();
    activeProcedureWindow.markStepDoneBtn.then((doneBtn) => {
      for (let i = 1; i < 3; i++) {
        cy.get(doneBtn).click();
        activeProcedureWindow.stepList.find('.done', { timeout: 30000 }).should('have.length', i);
      }
    });
    activeProcedureWindow.markMaintenanceDoneBtn.should('not.be.disabled').click();

    // verify that plan is in the archive tab
    maintenance.archiveTab.click();
    archivedMaintenances.verifyTabLoaded();
    activeMaintenancesTab.assetNameSpan.contains(asset.name).click().wait(5000);
    activeMaintenancesTab.procedureNameCell.contains(maintenanceName).should('be.visible');
  })
});