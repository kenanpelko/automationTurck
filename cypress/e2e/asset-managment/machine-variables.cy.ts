import 'cypress-v10-preserve-cookie';
import 'cypress-file-upload';
import { qase } from 'cypress-qase-reporter/dist/mocha';
import MachineVariables from '../../page-object/asset-managment/machine-variables.po';
import generateRandomMachineVariable from '../../support/helpers/machine-variables';
import { machineVariable } from '../../support/constant/machine-variables';
import { machVariables } from '../../support/types/machine-variables';
import { assetTypes } from '../../support/types/asset-types';
import generateRandomAssetType from '../../support/helpers/asset-type';
import AssetPoolAPI from "../../support/request/asset-pool-request";

const localization = require(`../../fixtures/i18n/asset-managment/${Cypress.env('LANGUAGE')}`); 
const machineVariables = new MachineVariables();
const assetType: assetTypes = generateRandomAssetType();
const assetPoolAPI = new AssetPoolAPI();

before(() => { 
  cy.navigateToBaseURL(Cypress.env('URL'));
  cy.setAppLanguage(Cypress.env('LANGUAGE'))
  cy.addAssetType(assetType);
  cy.clearCookies();
});


describe('Machine variables - navigation', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage('en_EN');
    cy.reload();
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToMachineVariables();
  });

  qase(
    313,
    it ('Verify all elements have been loaded on Machine variables page', () => {
      //Verification of elements in header area
      machineVariables.headerAssetsTitle.should('be.visible').should('contain', 'Assets');
      machineVariables.headerAllocatedAssetsNav
        .should('be.visible')
        .should('contain', localization.menu.allocatedAssets);
      machineVariables.headerAssetPoolNav
        .should('be.visible')
        .should('contain', localization.menu.assetPool);
      machineVariables.headerAssetTypesNav
        .should('be.visible')
        .should('contain', localization.menu.assetTypes);
      machineVariables.headerDeviceManagementNav
        .should('be.visible')
        .should('contain', localization.menu.deviceManagement);
      machineVariables.headerMachineVariablesNav
        .should('be.visible')
        .should('contain', localization.menu.machineVariables)
        .should('have.class', 'tab active');
      machineVariables.createNewMachineVariableButton.should('be.visible');

      //Verification of table column titles
      machineVariables.tableTitleName
        .should('be.visible')
        .should('contain', localization.machineVariables.table.tableHeader.name);
      machineVariables.tableTitleParameter
        .should('be.visible')
        .should('contain', localization.machineVariables.table.tableHeader.parameter);
      machineVariables.tableTitleAssetType
        .should('be.visible')
        .should('contain', localization.machineVariables.table.tableHeader.assetType);
      machineVariables.tableTitleUnit
        .should('be.visible')
        .should('contain', localization.machineVariables.table.tableHeader.unit);
    }),
  );

  qase(
    314,
    it('Verify user can open and close Create new machine variable form', () => {
      machineVariables.createNewMachineVariableButton.should('be.visible').click();
      cy.verifyURLContains(machineVariable.newMachineVariablePath);
      machineVariables.addMachineVariableCloseButton.click();
      cy.verifyURLContains(machineVariable.machineVariablesPath);
    }),
  );

  qase(
    315,
    it('Verify user can open and close Create new machine variable form', () => {
      machineVariables.createNewMachineVariableButton.should('be.visible').click();
      cy.verifyURLContains(machineVariable.newMachineVariablePath);
      machineVariables.addMachineVariableCloseButton.should('be.visible');
      machineVariables.addMachineVariableTitle
        .should('be.visible')
        .should('contain', localization.machineVariables.addNewMachineVariable.addTitle);
      machineVariables.addMachineVariableNameField
        .should('be.visible')
        .siblings()
        .should('contain', localization.machineVariables.addNewMachineVariable.name);
      machineVariables.addMachineVariableParameterIDField
        .should('be.visible')
        .siblings()
        .should('contain', localization.machineVariables.addNewMachineVariable.parameterID);
      machineVariables.addMachineVariableUnitField
        .should('be.visible')
        .siblings()
        .should('contain', localization.machineVariables.addNewMachineVariable.unit);
      machineVariables.addMachineVariableAssetTypeIDField
        .should('be.visible')
        .siblings()
        .should('contain', localization.machineVariables.addNewMachineVariable.assetTypeID);
      machineVariables.addMachineVariableAddButton
        .should('be.visible')
        .should('contain', localization.machineVariables.addNewMachineVariable.addButton);
    }),
  );

  qase(
    316,
    it('Verify user can successfully create new machine variable', () => {
      machineVariables.createNewMachineVariableButton.should('be.visible').click();
      cy.verifyURLContains(machineVariable.newMachineVariablePath);
      const MachineVariables: machVariables = generateRandomMachineVariable();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click();
    }),
  );
});

describe.only('Machine variables - Delete actions', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToMachineVariables();
  });

  qase(
    319,
    it('Verify all elements have been loaded in Delete machine variable popup', () => {
      //Create machine variable
      machineVariables.openCreateMachineVariable();
      const MachineVariables: machVariables = generateRandomMachineVariable();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click();

      machineVariables.searchMachineVariableByNameAndVerify(MachineVariables.name);
      cy.wait(2000);
      machineVariables.menuDropdownIcon.click();
      machineVariables.deleteDropdownItem
        .should('be.visible')
        .should('contain', localization.machineVariables.table.delete)
        .click();
      machineVariables.deletePopup.should('be.visible');
      machineVariables.deleteMachineVariablePopupTitle
        .should('be.visible')
        .should('contain', localization.machineVariables.deleteMachineVariable.title);
      machineVariables.deleteMachineVariablePopupCloseButton.should('be.visible');
      machineVariables.deleteMachineVariablePopupMessage
        .should('be.visible')
        .should('contain', localization.machineVariables.deleteMachineVariable.message);
      machineVariables.deleteMachineVariablePopupDeleteButton.should('be.visible');
      machineVariables.deleteMachineVariablePopupCancelButton.should('be.visible');
    }),
  );

  qase(
    317,
    it('Verify user can open and close Delete machine variable popup via X button', () => {
      //Create machine variable
      machineVariables.openCreateMachineVariable();
      const MachineVariables: machVariables = generateRandomMachineVariable();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click();

      machineVariables.searchMachineVariableByNameAndVerify(MachineVariables.name);
      cy.wait(2000);
      machineVariables.menuDropdownIcon.click();
      machineVariables.deleteDropdownItem.should('be.visible').click();
      machineVariables.deletePopup.should('be.visible');
      machineVariables.deleteMachineVariablePopupCloseButton.should('be.visible').click();
      machineVariables.deletePopup.should('not.exist');
    }),
  );

  qase(
    318,
    it('Verify user can open and close Delete machine variable popup via Cancel button', () => {
      //Create machine variable
      machineVariables.openCreateMachineVariable();
      const MachineVariables: machVariables = generateRandomMachineVariable();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click();

      machineVariables.searchMachineVariableByNameAndVerify(MachineVariables.name);
      cy.wait(2000);
      machineVariables.menuDropdownIcon.click();
      machineVariables.deleteDropdownItem.should('be.visible').click();
      machineVariables.deletePopup.should('be.visible');
      machineVariables.deleteMachineVariablePopupCancelButton.should('be.visible').click();
      machineVariables.deletePopup.should('not.exist');
    }),
  );

  qase(
    320,
    it('Verify user can successfully delete machine variable', () => {
      //Create machine variable
      machineVariables.openCreateMachineVariable();
      const MachineVariables: machVariables = generateRandomMachineVariable();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click();

      machineVariables.searchMachineVariableByNameAndVerify(MachineVariables.name);
      cy.wait(2000);
      machineVariables.menuDropdownIcon.click();
      machineVariables.deleteDropdownItem.should('be.visible').click();
      machineVariables.deletePopup.should('be.visible');
      machineVariables.deleteMachineVariablePopupDeleteButton.should('be.visible').click();
      machineVariables.deletePopup.should('not.exist');

      machineVariables.searchMachineVariableByNameAfterDelete(MachineVariables.name);
    }),
  );
});

describe('Machine variables Search feature', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToMachineVariables();
  });

  qase(
    324,
    it('Verify user can search Machine variables via Name', () => {
      //Create machine variable
      machineVariables.openCreateMachineVariable();
      const MachineVariables: machVariables = generateRandomMachineVariable();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click();

      machineVariables.searchMachineVariableByNameAndVerify(MachineVariables.name);
    }),
  );

  qase(
    325,
    it('Verify user can search Machine variables via Parameter ID', () => {
      //Create machine variable
      machineVariables.openCreateMachineVariable();
      const MachineVariables: machVariables = generateRandomMachineVariable();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click();

      machineVariables.searchMachineVariableByParameterAndVerify(MachineVariables.parameterID);
    }),
  );

  //ISSUE WITH THIS ONE
  qase(
    326,
    it.skip('Verify user can search Machine variables via Asset Type ID', () => {
      //Create machine variable
      machineVariables.openCreateMachineVariable();
      const MachineVariables: machVariables = generateRandomMachineVariable();
      const assetType: assetTypes = generateRandomAssetType();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click();
      machineVariables.searchMachineVariableByAssetAndVerify(
      MachineVariables.assetTypeID.assetTypeName,
      );
    }),
  );

  qase(
    327,
    it('Verify user can search Machine variables via Unit', () => {
      //Create machine variable
      machineVariables.openCreateMachineVariable();
      const MachineVariables: machVariables = generateRandomMachineVariable();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click({ force: true });

      machineVariables.searchMachineVariableByUnitAndVerify(MachineVariables.unit);
    }),
  );

  // This test is skipped out because of reported issue regarding search engine. Search engine located in header is not resposive to filter results in table on page
    qase(
         328,
         it.skip("Verify user can use Search engine in a page header", () => {
             // Create machine variable
             machineVariables.openCreateMachineVariable()
             const MachineVariables: machVariables = generateRandomMachineVariable()
             const assetType: assetTypes = generateRandomAssetType();
             machineVariables.addMachineVariableDetails(MachineVariables, assetType);
             machineVariables.addMachineVariableAddButton.click();
 
             machineVariables.searchMachineVariablesByHeaderSearch(MachineVariables.name)
         }  
     )); 
     
});

describe('Edit machine variable feature', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToMachineVariables();
  });

  qase(
    322,
    it('Verify all elements are loaded on Edit machine variable form', () => {
      //Create machine variable
      machineVariables.openCreateMachineVariable();
      const MachineVariables: machVariables = generateRandomMachineVariable();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click();

      machineVariables.searchMachineVariableByNameAndVerify(MachineVariables.name);
      cy.wait(2000);
      machineVariables.menuDropdownIcon.click();
      machineVariables.editDropdownItem.should('be.visible').click();
      machineVariables.addMachineVariableTitle
        .should('be.visible')
        .should('contain', localization.machineVariables.addNewMachineVariable.updateTitle);
      machineVariables.addMachineVariableCloseButton.should('be.visible');
      machineVariables.addMachineVariableNameField
        .should('be.visible')
        .siblings()
        .should('contain', localization.machineVariables.addNewMachineVariable.name);
      machineVariables.addMachineVariableUnitField
        .should('be.visible')
        .siblings()
        .should('contain', localization.machineVariables.addNewMachineVariable.unit);
      machineVariables.addMachineVariableAddButton
        .should('be.visible')
        .should('contain', localization.machineVariables.addNewMachineVariable.updateButton);
    }),
  );

  qase(
    321,
    it('Verify user can open and close Edit machine variable form', () => {
      //Create machine variable
      machineVariables.openCreateMachineVariable();
      const MachineVariables: machVariables = generateRandomMachineVariable();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click();

      machineVariables.searchMachineVariableByNameAndVerify(MachineVariables.name);
      cy.wait(2000);
      machineVariables.menuDropdownIcon.click();
      machineVariables.editDropdownItem.should('be.visible').click();
      machineVariables.editPopup.should('exist');
      machineVariables.addMachineVariableCloseButton.should('be.visible').click();
      machineVariables.editPopup.should('not.exist');
    }),
  );

  qase(
    23,
    it('Verify user can successfully edit machine variable', () => {
      //Create machine variable
      machineVariables.openCreateMachineVariable();
      const MachineVariables: machVariables = generateRandomMachineVariable();
      const NewMachineVariables: machVariables = generateRandomMachineVariable();
      machineVariables.addMachineVariableDetails(MachineVariables, assetType);
      machineVariables.addMachineVariableAddButton.click();

      machineVariables.searchMachineVariableByNameAndVerify(MachineVariables.name);
      cy.wait(2000);
      machineVariables.menuDropdownIcon.click();
      machineVariables.editDropdownItem.should('be.visible').click();
      machineVariables.addEditedMachineVariableDetails(NewMachineVariables);
      machineVariables.addMachineVariableAddButton.click();
      machineVariables.searchMachineVariableByNameAndVerify(NewMachineVariables.name);
    }),
  );
  
  after(() => {
    assetPoolAPI.deleteAllAllocatedAssets();
  });
});
