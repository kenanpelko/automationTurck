import { qase } from 'cypress-qase-reporter/dist/mocha';
import { faker } from '@faker-js/faker';
import 'cypress-v10-preserve-cookie';
import { Asset } from '../../support/types/asset';
import generateRandomAsset from '../../support/helpers/asset';

const { MainteancePage } = require('../../page-object/maintenance/maintenance.po');
const { ActiveMaintenances } = require('../../page-object/maintenance/active-maintenances.po');
const { ActiveMaintenancesProcedureWindow } = require('../../page-object/maintenance/active-maintenances-procedure.po');
const { ArchivedMaintenancesTab } = require('../../page-object/maintenance/archived-maintenances.po');
import AssetPoolAPI from "../../support/request/asset-pool-request"

const maintenance = new MainteancePage();
const activeMaintenancesTab = new ActiveMaintenances();
const activeProcedureWindow = new ActiveMaintenancesProcedureWindow();
const archivedMaintenances = new ArchivedMaintenancesTab();

const assetPoolAPI = new AssetPoolAPI();
const colors = require('../../fixtures/colors.json');

let stepName, maintenanceName, planDescription;

describe('Active maintenance - Step action Statuses', () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    // create new plan with three steps and assign it to the asset
    assetPoolAPI.addAsset(asset);
    stepName = 'Step Marks ';
    maintenanceName = stepName + faker.lorem.word();
    planDescription = faker.lorem.word(3);
    cy.createNewMaintenancePlan(maintenanceName, planDescription, '1');
    cy.assignPlanToAsset('@assetId');
    // navigate to created plan
    cy.navigateToMaintenanceManager();
    maintenance.activeTab.click();
    activeMaintenancesTab.assetNameSpan.contains(asset.name).click();
    activeMaintenancesTab.procedureNameCell.contains(maintenanceName).should('be.visible').click();
    // check that first step text is black before pressing the button
    cy.get('@stepOneName').then((firstStep) => {
      activeProcedureWindow.stepList.contains(firstStep).should('have.css', 'color', colors.activeStepMarks.black);
    })
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
  })

  after(function () {
    cy.deleteMaintenancePlanWithoutWrapper(this.planId);
  });

  qase(
    59,
    it('Verify that user is able to mark step as done', () => {
      // click on Mark Step As Done button
      activeProcedureWindow.markStepDoneBtn.click();
      // check that text became green
      cy.get('@stepOneName').then((firstStep) => {
        activeProcedureWindow.stepList.contains(firstStep).should('have.css', 'color', colors.activeStepMarks.green);
      })
    })
  );

  qase(
    60,
    it('Verify that user is able to mark step as error', function () {
      // click on Mark Step As Error button
      activeProcedureWindow.markStepErrorBtn.click();
      // check that text became red
      activeProcedureWindow.stepList.contains('.error', this.stepTwoName).should('have.css', 'color', colors.activeStepMarks.red);
    })
  );

  qase(
    119,
    it('Verify that user is able to skip step', function () {
      // click on SkIP button
      activeProcedureWindow.skipStepBtn.click();
      // check that text became yellow
      activeProcedureWindow.stepList.contains('.skipped', this.stepThreeName).should('have.css', 'color', colors.activeStepMarks.orange);
    })
  );
});

describe('Active maintenance - Mark Step as Done', () => {
  let asset: Asset = generateRandomAsset();
  stepName = 'Step DONE ';
  maintenanceName = stepName + faker.lorem.word();
  planDescription = faker.lorem.sentence();

  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    assetPoolAPI.addAsset(asset);
    cy.createNewMaintenancePlan(maintenanceName, planDescription, '1');
    cy.assignPlanToAsset('@assetId');
    cy.reload();
    cy.navigateToMaintenanceManager();
    maintenance.activeTab.click();
  });

  after(function () {
    cy.deleteMaintenancePlanWithoutWrapper(this.planId);
  });

  qase(
    124,
    it('Verify that user is able to mark maintenance step as done', function () {
      activeMaintenancesTab.openAssetAndPlan(asset.name, maintenanceName);
      activeProcedureWindow.markMaintenanceDoneBtn.should('be.disabled');
      // mark all three steps as Done
      activeProcedureWindow.markStepDoneBtn.then((doneBtn) => {
        for (let i = 1; i < 4; i++) {
          cy.get(doneBtn).click();
          activeProcedureWindow.stepList.find('.done', { timeout: 30000 }).should('have.length', i);
        }
      });
      activeProcedureWindow.markMaintenanceDoneBtn.should('not.be.disabled').click();
      maintenance.archiveTab.click();
      archivedMaintenances.verifyTabLoaded();
      activeMaintenancesTab.assetNameSpan.contains(asset.name).click().wait(5000);
      activeMaintenancesTab.procedureNameCell.contains(maintenanceName).should('be.visible');
    })
  );
});