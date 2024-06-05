import { machineVariable } from "../../support/constant/machine-variables";
const localization = require(`../../fixtures/i18n/asset-managment/${Cypress.env('LANGUAGE')}`); 
import AssetPoolAPI from '../../support/request/asset-pool-request';
import generateRandomAssetType from "../../support/helpers/asset-type";
import { assetTypes } from "../../support/types/asset-types";

const assetPoolApi = new AssetPoolAPI();

export default class MachineVariables {

  //Header elements
  get headerAssetsTitle() {
    return cy.get('lib-panel-header h2');
  }

  get headerAllocatedAssetsNav() {
    return cy.get('div.tabs :nth-child(1)');
  }

  get headerAssetPoolNav() {
    return cy.get('div.tabs :nth-child(2)');
  }

  get headerAssetTypesNav() {
    return cy.get('div.tabs :nth-child(3)');
  }

  get headerDeviceManagementNav() {
    return cy.get('div.tabs :nth-child(4)');
  }

  get headerMachineVariablesNav() {
    return cy.get('div.tabs :nth-child(5)');
  }

  get createNewMachineVariableButton() {
    return cy.get('.panel-header-actions [class="btn btn-primary"]');
  }

  get headerSearchField() {
    return cy.get('.panel-header-actions [class="search"]');
  }

  //table column title elements
  get tableTitleName() {
    return cy.get('.ag-header-row-column [col-id="name"]');
  }

  get tableSearchNameColumn() {
    return cy.get('.ag-header-row-column-filter [aria-colindex="1"] .form-control');
  }

  get tableTitleParameter() {
    return cy.get('.ag-header-row-column [col-id="parameterId"]');
  }

  get tableSearchParameterColumn() {
    return cy.get('.ag-header-row-column-filter [aria-colindex="2"] .form-control');
  }

  get tableTitleAssetType() {
    return cy.get('.ag-header-row-column [col-id="assetType.id"]');
  }

  get tableSearchAssetTypeColumn() {
    return cy.get('.ag-header-row-column-filter [aria-colindex="3"] .ng-select-container');
  }

  get tableTitleUnit() {
    return cy.get('.ag-header-row-column [col-id="unit"]');
  }

  get tableSearchUnitColumn() {
    return cy.get('.ag-header-row-column-filter [aria-colindex="4"] .form-control');
  }

  get menuDropdownIcon() {
    return cy.get('.ag-row-first button#grid-actions-dropdown > .material-icons')
  }

  get editDropdownItem() {
    return cy.get('.dropdown .dropdown-menu.show :nth-child(1)')
  }

  get deleteDropdownItem() {
    return cy.get('.dropdown .dropdown-menu.show :nth-child(2)')
  }

  // Add machine variable form 
  get addMachineVariableTitle() {
    return cy.get('.modal-header .modal-title');
  }

  get addMachineVariableCloseButton() {
    return cy.get('.modal-header button');
  }

  get addMachineVariableNameField() {
    return cy.get('.modal-body [formcontrolname="name"]');
  }

  get addMachineVariableParameterIDField() {
    return cy.get('.modal-body [formcontrolname="parameterId"]');
  }

  get addMachineVariableUnitField() {
    return cy.get('.modal-body [formcontrolname="unit"]');
  }

  get parameterIDFirstSelection() {
    return cy.get('.ng-dropdown-panel-items div :nth-child(1)');
  }

  get addMachineVariableAssetTypeIDField() {
    return cy.get('.modal-body [formcontrolname="assetTypeId"]');
  }

  get assetTypeIDFirstSelection() {
    return cy.get('.ng-dropdown-panel-items div :nth-child(1)');
  }

  get addMachineVariableAddButton() {
    return cy.get('.modal-body .custom-footer .btn-warning');
  }

  get editPopup() {
    return cy.get('.modal-dialog .modal-content app-machine-variable-edit')
  }

  // Delete popup elements
  get deletePopup() {
    return cy.get('.modal-dialog .modal-content lib-modal-confirm')
  }

  get deleteMachineVariablePopupTitle() {
    return cy.get('.modal-header .modal-title')
  }

  get deleteMachineVariablePopupCloseButton() {
    return cy.get('.modal-header .btn')
  }

  get deleteMachineVariablePopupMessage() {
    return cy.get('.modal-body p')
  }

  get deleteMachineVariablePopupCancelButton() {
    return cy.get('.modal-footer .btn-outline-secondary')
  }

  get deleteMachineVariablePopupDeleteButton() {
    return cy.get('.modal-footer .btn-danger')
  }

  // functions
  addMachineVariableDetails(machineVariables: any, assetType: any) {
    if (machineVariables.name !== undefined) {
      this.addMachineVariableNameField.clear().type(machineVariables.name);
    }

    if (machineVariables.parameterID !== undefined) {
      this.addMachineVariableParameterIDField.click()
      this.parameterIDFirstSelection.should('contain', localization.machineVariables.addNewMachineVariable.parameters.onOff).click()
    }
    if (machineVariables.unit !== undefined) {
      this.addMachineVariableUnitField.clear().type(machineVariables.unit)
    }


    this.addMachineVariableAssetTypeIDField.click();
    cy.selectOptionFromDropdown(assetType.assetTypeName);
  }

  addEditedMachineVariableDetails(machineVariables: any) {
    if (machineVariables.name !== undefined) {
      this.addMachineVariableNameField.clear().type(machineVariables.name);
    }

    if (machineVariables.unit !== undefined) {
      this.addMachineVariableUnitField.clear().type(machineVariables.unit)
    }
  }

  openCreateMachineVariable() {
    this.createNewMachineVariableButton.should('be.visible').click()
    cy.verifyURLContains(machineVariable.newMachineVariablePath)
  }

  searchMachineVariableByNameAndVerify(name) {
    this.tableSearchNameColumn.click().clear().type(name).type('{enter}');
    cy.get('.ag-pinned-left-cols-container [col-id="name"]').should('contain', name)
  }

  searchMachineVariableByNameAfterDelete(name) {
    this.tableSearchNameColumn.click().clear().type(name).type('{enter}');
    cy.get('.ag-pinned-left-cols-container [col-id="name"]').should('not.contain', name)
  }

  searchMachineVariableByParameterAndVerify(parameterID) {
    this.tableSearchParameterColumn.click().clear().type(parameterID).type('{enter}');
    cy.get('.ag-center-cols-container [col-id="parameterId"]').should('contain', parameterID)
  }

  searchMachineVariableByAssetAndVerify(assetTypeID) {
    this.tableSearchAssetTypeColumn.click().clear().type(assetTypeID).click().wait(2000);
    cy.get('app-machine-variables .ag-center-cols-container [col-id="assetType.id"]').should('contain', assetTypeID)
  }

  searchMachineVariableByUnitAndVerify(unit) {
    this.tableSearchUnitColumn.click().clear().type(unit).type('{enter}');
    cy.get('.ag-center-cols-container [col-id="unit"]').should('contain', unit)
  }

  searchMachineVariablesByHeaderSearch(name) {
    this.headerSearchField.click().clear().type(name).type('{enter}');
    cy.get('.ag-pinned-left-cols-container > .ag-row > .ag-cell-value [col-id="name"]').should('contain', name)
  }
}