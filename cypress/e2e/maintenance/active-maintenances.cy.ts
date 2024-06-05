import { qase } from 'cypress-qase-reporter/dist/mocha';
import { faker } from '@faker-js/faker';
import 'cypress-v10-preserve-cookie';

const { MainteancePage } = require('../../page-object/maintenance/maintenance.po');
const { ActiveMaintenances } = require('../../page-object/maintenance/active-maintenances.po');
const { ActiveMaintenancesProcedureWindow } = require('../../page-object/maintenance/active-maintenances-procedure.po');
import AssetPoolAPI from "../../support/request/asset-pool-request"
import { Asset } from '../../support/types/asset';
import generateRandomAsset from '../../support/helpers/asset';


const colors = require('../../fixtures/colors.json');
const data = require(`../../fixtures/i18n/maintenance/${Cypress.env('LANGUAGE')}`); 
const assetPoolAPI = new AssetPoolAPI();


const maintenance = new MainteancePage();
const activeMaintenancesTab = new ActiveMaintenances();
const activeProcedureWindow = new ActiveMaintenancesProcedureWindow();

let stepName, maintenanceName, planDescription, interval;

describe('Active maintenance', () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    assetPoolAPI.addAsset(asset);
    stepName = 'Search title ';
    maintenanceName = stepName + faker.lorem.word();
    planDescription = faker.lorem.word(3);
    cy.createNewMaintenancePlan(maintenanceName, planDescription, '1');
    cy.assignPlanToAsset('@assetId');
    cy.navigateToMaintenanceManager();
    maintenance.activeTab.click();
    maintenance.loadingLabel.should('not.exist');
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy'); 
  })

  after(function () {
    cy.deleteMaintenancePlanWithoutWrapper(this.planId);
  });

  qase(
    51,
    it('Verify that search functionality of Title column working correctly in Active Maintenances', () => {
      activeMaintenancesTab.assetNameSpan.contains(asset.name).click();
      activeMaintenancesTab.titleSearchInput.click().type(maintenanceName, { delay: 40 });
      activeMaintenancesTab.procedureNameCell.contains(maintenanceName).should('be.visible');
    })
  );

  qase(
    57,
    it('Verify that BACK button is working correctly in Active Maintenances', () => {
      activeMaintenancesTab.assetNameSpan.contains(asset.name).click();
      // open procedure
      activeMaintenancesTab.procedureNameCell.contains(maintenanceName).should('be.visible').click();
      activeProcedureWindow.stepsHeader.should('be.visible');
      activeProcedureWindow.stepsBody.should('be.visible');
      // get back to the Active maintenances
      activeProcedureWindow.backButton.click();
      maintenance.navigationTabs.should('be.visible');
      activeMaintenancesTab.wrapper.should('be.visible');
    })
  );
});

describe('Active maintenance - Filter by AssetId', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToMaintenanceManager();
    maintenance.activeTab.click();
  });

  // THIS TEST NEEDS COMPLETE REVISION AND COMPARISON TO NEW FLOW
  qase(
    53,
    it.skip('Verify filtering by asset is working correctly in Active Maintenances', () => {
      let specifiedAssetName = 'Test 1';
      let assetNames = ['Test 1'];
      activeMaintenancesTab.assetNameSpan.contains(assetNames[0]).click();
      activeMaintenancesTab.assetIdInput.click();
      activeMaintenancesTab.dropdownOptions.contains(assetNames[0]).click();
      activeMaintenancesTab.assetIdCell.should('contain', assetNames[0]).and('contain', specifiedAssetName);
    })
  );
});

describe('Active maintenance - Due state, Progress Bar', () => {
  let asset: Asset = generateRandomAsset();
  stepName = 'Due state ';
  planDescription = faker.lorem.sentence();

  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.navigateToMaintenanceManager();
    maintenance.activeTab.click();
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
  })

  afterEach(function () {
    cy.deleteMaintenancePlanWithoutWrapper(this.planId);
  });

  // after(() => { 
  //   assetPoolAPI.deleteAllAllocatedAssets();
  // });

  qase(
    122,
    it('Verify that Due soon - state is working correctly', () => {
      interval = '1';
      maintenanceName = stepName + faker.lorem.word();
      assetPoolAPI.addAsset(asset);
      cy.createNewMaintenancePlan(maintenanceName, planDescription, interval);
      cy.reload();
      cy.assignPlanToAsset('@assetId');
      cy.reload();
      activeMaintenancesTab.openAssetAndPlan(asset.name, maintenanceName);
      activeProcedureWindow.checkStatusIcon(colors.activeStepMarks.yellow, data.activePlanWindow.dueSoon);
    })
  );

  qase(
    123,
    it('Verify that Open - state is working correctly', () => {
      interval = '42';
      maintenanceName = stepName + faker.lorem.word() + '1';
      assetPoolAPI.addAsset(asset);
      cy.createNewMaintenancePlan(maintenanceName, planDescription, interval);
      cy.reload();
      cy.assignPlanToAsset('@assetId');
      cy.reload();
      activeMaintenancesTab.openAssetAndPlan(asset.name, maintenanceName);
      activeProcedureWindow.checkStatusIcon(colors.activeStepMarks.yellow, data.activePlanWindow.dueOpen);
    })
  );

  qase(
    121,
    it('Verify that the progress counter is working correctly', () => {
      interval = '10';
      maintenanceName = stepName + faker.lorem.word() + '2';
      let countOfSteps = '2';
      assetPoolAPI.addAsset(asset);
      cy.createNewMaintenancePlan(maintenanceName, planDescription, interval);
      cy.reload();
      cy.assignPlanToAsset('@assetId');
      cy.reload().wait(5000)

      activeMaintenancesTab.assetNameSpan.contains(asset.name).click();
      activeMaintenancesTab.procedureNameCell.contains(maintenanceName).click();
      activeProcedureWindow.markStepDoneBtn.click();
      activeProcedureWindow.stepList.find('.done', { timeout: 30000 }).should('be.visible');
      activeProcedureWindow.markStepErrorBtn.click();
      activeProcedureWindow.stepList.find('.error', { timeout: 30000 }).should('be.visible');
      activeProcedureWindow.backButton.click().wait(5000);
      activeMaintenancesTab.openAssetPlan(asset.name);
      cy.wait(5000);
      activeMaintenancesTab.verifyPlansCountSteps(maintenanceName, countOfSteps);
    })
  );
});
