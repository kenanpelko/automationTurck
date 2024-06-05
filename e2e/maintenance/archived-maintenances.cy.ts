import { qase } from 'cypress-qase-reporter/dist/mocha';
import { faker } from '@faker-js/faker';
import { maintenancePath } from '../../support/constant/maintenance';
import 'cypress-v10-preserve-cookie';

const { MainteancePage } = require('../../page-object/maintenance/maintenance.po');
const { ActiveMaintenances } = require('../../page-object/maintenance/active-maintenances.po');
const { ActiveMaintenancesProcedureWindow } = require('../../page-object/maintenance/active-maintenances-procedure.po');
const { ArchivedMaintenancesTab } = require('../../page-object/maintenance/archived-maintenances.po');
const { ArchivedMaintenancesSteps } = require('../../page-object/maintenance/archived-maintenances-steps-window.po');
const data = require(`../../fixtures/i18n/maintenance/${Cypress.env('LANGUAGE')}`); 
import AssetPoolAPI from "../../support/request/asset-pool-request"
import generateRandomAsset from '../../support/helpers/asset';
import { Asset } from '../../support/types/asset';

const maintenance = new MainteancePage();
const activeMaintenancesTab = new ActiveMaintenances();
const activeProcedureWindow = new ActiveMaintenancesProcedureWindow();
const archivedMaintenances = new ArchivedMaintenancesTab();
const archivedMaintenancesSteps = new ArchivedMaintenancesSteps();
const assetPoolAPI = new AssetPoolAPI();


let stepName, maintenanceName, planDescription;

describe('Archived maintenances', () => {
  let asset: Asset = generateRandomAsset();
  stepName = 'Search archived plans ';
  maintenanceName = stepName + faker.lorem.word();
  planDescription = faker.lorem.sentence();

  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.createNewMaintenancePlan(maintenanceName, planDescription, '1');
    assetPoolAPI.addAsset(asset);
    cy.assignPlanToAsset('@assetId');
    cy.navigateToMaintenanceManager();
    maintenance.activeTab.click();
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
  })

  after(function () {
    cy.deleteMaintenancePlanWithoutWrapper(this.planId);
  });

  qase(
    125,
    it('Verify that search functionality of Title column working correctly in Archived Maintenances', function () {
      // marks all step as Done to throw plan to the archived section
      activeMaintenancesTab.openAssetAndPlan(asset.name, maintenanceName);
      activeProcedureWindow.markStepDoneBtn.then((doneBtn) => {
        for (let i = 1; i < 4; i++) {
          cy.get(doneBtn).click();
          activeProcedureWindow.stepList.find('.done', { timeout: 30000 }).should('have.length', i);
        }
      });
      activeProcedureWindow.markMaintenanceDoneBtn.should('not.be.disabled').click();
      maintenance.archiveTab.click();
      archivedMaintenances.verifyTabLoaded();
      activeMaintenancesTab.assetNameSpan.contains(asset.name).click();
      // verify "search titile" function work
      activeMaintenancesTab.titleSearchInput.click().type(maintenanceName).type('{enter}');
      activeMaintenancesTab.procedureNameCell.contains(maintenanceName).should('be.visible');
    })
  );

  qase(
    129,
    it('Verify that Title column is working correctly in Archived Maintenances', function () {
      activeMaintenancesTab.procedureNameCell.contains(maintenanceName).should('be.visible').click();
      archivedMaintenancesSteps.navigationPanel.should('be.visible')
        .and('contain', maintenanceName).and('contain', data.archivedMaintenance.breadcrumsLink);
      activeProcedureWindow.stepListItem.should('be.visible').and('have.length', 3);
    })
  );

  qase(
    135,
    it('Verify that the progress counter is working correctly', function () {
      let countOfSteps = '3';
      archivedMaintenancesSteps.openDetailsBtn.click();
      archivedMaintenancesSteps.progressBar.as('proBar').should('be.visible');
      cy.get('@proBar').invoke('attr', 'aria-valuenow').should('equal', countOfSteps);
      cy.get('@proBar').invoke('attr', 'aria-valuemax').should('equal', countOfSteps);
    })
  );

  qase(
    130,
    it('Verify that Back button is working correctly in Archived Maintenances', function () {
      archivedMaintenancesSteps.stepDetailsWrapper.should('be.visible');
      archivedMaintenancesSteps.wrapper.should('be.visible');
      activeProcedureWindow.backButton.should('be.visible').click();
      archivedMaintenancesSteps.stepDetailsWrapper.should('not.exist');
      archivedMaintenancesSteps.wrapper.should('not.exist');
      archivedMaintenances.verifyTabLoaded();
    })
  );

  qase(
    139,
    it('Click on breadcrumbs - Archived Maintenance', function () {
      cy.wait(5000);
      activeMaintenancesTab.openAssetAndPlan(asset.name, maintenanceName);
      archivedMaintenancesSteps.stepDetailsWrapper.should('be.visible');
      archivedMaintenancesSteps.wrapper.should('be.visible');
      archivedMaintenancesSteps.navigationPanel.contains(data.archivedMaintenance.breadcrumsLink).click();
      archivedMaintenancesSteps.stepDetailsWrapper.should('not.exist');
      archivedMaintenancesSteps.wrapper.should('not.exist');
      archivedMaintenances.verifyTabLoaded();
    })
  );
});

// Console error is trrigered while running these tests (NEEDS TO BE REPORTED)
describe.skip('Archived maintenances - Filtering by asset', () => {
  let asset: Asset = generateRandomAsset();
  stepName = 'Filtering by asset ';
  planDescription = faker.lorem.sentence();
  maintenanceName = '001' + stepName + faker.lorem.word();
  let secondPlan = '002' + stepName + faker.lorem.word();
  let secondAssetName = 'Test';
  let secondAssetId = '05e918df-fda9-4f31-adf0-7e825d1615bd';

  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    assetPoolAPI.addAsset(asset);
    cy.navigateToMaintenanceManager();
    maintenance.activeTab.click();
    createPrecondition();
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy')
  })

  after(function () {
    cy.request('DELETE', Cypress.env('URL') + maintenancePath.maintenancePlansPath + '/' + this.secondPlanId);
    cy.request('DELETE', Cypress.env('URL') + maintenancePath.maintenancePlansPath + '/' + this.planId);
  });

  function createPrecondition() {
    // first plan
    cy.createNewMaintenancePlan(maintenanceName, planDescription, '1');
    cy.assignPlanToAsset('@assetId');
    cy.reload();
    activeMaintenancesTab.openAssetAndPlan(asset.name, maintenanceName);
    activeProcedureWindow.markStepDoneBtn.then((doneBtn) => {
      for (let i = 1; i < 4; i++) {
        cy.get(doneBtn).click();
        activeProcedureWindow.stepList.find('.done', { timeout: 30000 }).should('have.length', i);
      }
    });
    activeProcedureWindow.markMaintenanceDoneBtn.should('not.be.disabled').click();
    // second plan
    archivedMaintenances.planCreateAssign(secondPlan, secondAssetId);
    cy.reload();
    activeMaintenancesTab.openAssetAndPlan(secondAssetName, secondPlan);
    activeProcedureWindow.markStepDoneBtn.click();
    activeProcedureWindow.stepList.find('.done', { timeout: 10000 }).should('be.visible');
    activeProcedureWindow.markMaintenanceDoneBtn.should('not.be.disabled').click();
  }

  qase(
    126,
    it('Verify filtering by asset is working correctly in Archived Maintenances', () => {
      maintenance.archiveTab.click();
      archivedMaintenances.verifyTabLoaded();
      activeMaintenancesTab.assetNameSpan.contains(secondAssetName).first().click();
      archivedMaintenances.dropdownArrow.last().click({ force: true });
      archivedMaintenances.dropdownPanelItems.should('be.visible')
        .find('span').contains(asset.name).click();
      archivedMaintenances.assetIdCell.contains(secondAssetName).should('not.be.visible');
      archivedMaintenances.assetIdCell.contains(asset.name).should('be.visible');
    }),
  );

  qase(
    140,
    it('Verify that sorting of title column working correctly', () => {
      cy.reload();
      archivedMaintenances.verifyTabLoaded();
      activeMaintenancesTab.assetNameSpan.contains(secondAssetName).first().click();
      archivedMaintenances.tableHeaderCell.contains(data.archivedMaintenance.titleTableHeader)
        .as('title').click();
      archivedMaintenances.ascendingIcon.first().should('be.visible');
      archivedMaintenances.titleColumn.find('[role="row"]').first().as('firstRow')
        .should('have.text', secondPlan);
      archivedMaintenances.titleColumn.find('[role="row"]').eq(1).as('secondRow')
        .should('have.text', maintenanceName);
      cy.get('@title').click().then(() => {
        cy.get('@firstRow').should('have.text', secondPlan);
        cy.get('@secondRow').should('have.text', maintenanceName);
      });
    }),
  );
});