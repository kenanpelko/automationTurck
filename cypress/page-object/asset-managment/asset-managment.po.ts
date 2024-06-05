import { Alias } from "../../support/types/alias";
import { Document } from "../../support/types/document";
import constants from "../../support/constant/asset-managment/index";
import AssetPoolAPI from "../../support/request/asset-pool-request"
import ConfirmationModal from "./component/modal-confirmation.po";
import AssetDetails from "./asset-details.po";
import AliasDetails from "./component/asset-details.po";
import PropertyDetails from "./component/propery-details.po";

const propertyDetails = new PropertyDetails();
const aliasDetails = new AliasDetails();
const assetDetails = new AssetDetails();
const assetPoolAPI = new AssetPoolAPI();
const confirmationModal = new ConfirmationModal();
const localization = require(`../../fixtures/i18n/asset-managment/${Cypress.env('LANGUAGE')}`); 
export default class AssetManagment extends ConfirmationModal{
  // Tabs. Menu items
  get menuItemAllocatedAssets() {
    return cy.get("lib-panel-header .tab").eq(0);
  }
  get menuItemAssetPool() {
    return cy.get("lib-panel-header .tab").eq(1);
  }
  get menuItemAssetTypes() {
    return cy.get("lib-panel-header .tab").eq(2);
  }
  get menuItemMaps() {
    return cy.get("lib-panel-header .tab").eq(3);
  }
  get menuItemSearch() {
    return cy.get('[class="search"] input');
  }

  get createNewAssetButton() {
    return cy.get('app-asset-tabs-outlet [class="btn btn-primary"]');
  }
  
  get tableRow() { 
    return cy.get('lib-row');
  }

  get tableAssetName() {
    return this.tableRow.find('.table-cell:nth-child(2)');
  }

  get dropdownDeleteOption() {
    return cy.get('div[class*="dropdown-menu show"] .dropdown-item').contains(localization.assetPool.table.deleteAsset);
  }

  get dropdownDuplicateOption() {
    return cy.get('div[class*="dropdown-menu show"] .dropdown-item').contains('Duplicate');
  }

  get dropdownDeallocateOption() {
    return cy.get('div[class*="dropdown-menu show"] .dropdown-item').contains('Deallocate').first();
  }

  get createNewSubassetOption() {
    return cy.get('div[class*="dropdown-menu show"] .dropdown-item').contains('Create new sub-asset');
  }

  get expandAllButton() {
    return cy.get('.toggle-tree a:nth-child(1)');
  }

  get collapsAllButton() {
    return cy.get('.toggle-tree a:nth-child(2)');
  }
 
  changeAssetTab(tabIndex = 0) {
    cy.get('[class="tabs"] .tab').eq(tabIndex).click();
  }

  openCreateNewAssetTab() {
    this.createNewAssetButton.click();
    cy.verifyURLContains(constants.path.assetNew);
  }

  addAlias(alias) {
    aliasDetails.name.type(alias.name);
    aliasDetails.typeDropdown.click();
    cy.get('[class*="ng-option"]').contains(alias.type).click();
    aliasDetails.description.type(alias.description);

    aliasDetails.aliasSubmitButton.should("be.enabled").click();
  }

  verifyAliasRow(alias: Alias, index = -1) {
    cy.wait(2500);
    assetDetails.aliasTableRow.should("be.visible");
    if (index !== -1) index += 1;

    let qrCode = localization.assetPool.createNewAsset.aliasTypes.qrCode;
    assetDetails.aliasTableRow.eq(index).find('[class="table-cell"]').eq(0).should("contain.text", alias.name);
    if (alias.type == qrCode) {
      assetDetails.aliasTableRow.eq(index).find('[class="table-cell"] [role="button"]').eq(0).should("contain.text", alias.name);
    }
  }

  verifyAliasList(aliasList) {
    aliasList.forEach((ele, index) => {
      this.verifyAliasRow(ele, index);
    });
  }

  addAssetDetails(asset: any) {
    if (asset.name !== undefined) {
      assetDetails.assetNameInput.clear().type(asset.name);
    }

    if (asset.description !== undefined) {
      assetDetails.descriptionInput.clear().type(asset.description);
    }
    if (asset.assetType !== undefined) {
      assetDetails.assetTypeButton.click();
      assetDetails.assetTypeDropdownElement.contains(asset.assetType.name).click();
    }
  }

  addNewAssetFlow(asset: any) {
    this.openCreateNewAssetTab();
    this.addAssetDetails(asset);
    this.clickCreateNewAssetAndVerify();
  }

  startEditingAsset(index = -1) {
    cy.get('[class="dropdown-toggle btn btn-transparent btn-icon"]').eq(index).click();
    cy.get('[x-placement="bottom-right"] [tabindex="0"]').click();
  }

  deleteAssetFromTable(index = -1) {
    cy.intercept("DELETE", constants.endpoints.assetsId).as("deleteAsset");

    cy.get('[class="dropdown-toggle btn btn-transparent btn-icon"]').eq(index).click();
    cy.get('button[class*="text-danger"]').click();
    this.confirmationButton.click();

    cy.wait("@deleteAsset").then((data: any) => {
      expect(data.response.statusCode).to.equal(200);
      cy.wait(2000);
    });
  }
  cloneAssetFromTable(index = -1) {
    cy.intercept("POST", constants.endpoints.assetClone).as("assetClone");

    cy.get('[class="dropdown-toggle btn btn-transparent btn-icon"]').eq(index).click();
    cy.get('div[class*="show"] button').eq(-2).click();

    cy.wait("@assetClone").then((data: any) => {
      expect(data.response.statusCode).to.equal(201);
      cy.wait(2000);
    });
  }

  clickCreateNewAssetAndVerify() {
    cy.intercept("POST", constants.endpoints.assets).as("createNewAsset");

    assetDetails.createAssetButton.click();

    cy.wait("@createNewAsset").then((data: any) => {
      let assetId = data.response.body.data.id;
      cy.task("setAssetList", assetId);
      expect(data.response.statusCode).to.equal(201);
      cy.wait(2000);
    });
  }

  clickSaveChangesAndVerify() {
    cy.intercept("PATCH", constants.endpoints.assetsId).as("createNewAsset");

    assetDetails.createAssetButton.click();

    cy.wait("@createNewAsset").then((data: any) => {
      expect(data.response.statusCode).to.equal(200);
      cy.wait(2000);
    });
  }

  editAssetAndVerify() {
    cy.intercept("PATCH", constants.endpoints.assetsId).as("updateAsset");

    assetDetails.createAssetButton.click();

    cy.wait("@updateAsset").then((data: any) => {
      expect(data.response.statusCode).to.equal(200);
      cy.wait(2000);
    });
  }

  verifyAssetDetails(asset: any) {
    if (asset.name !== undefined) {
      assetDetails.assetNameInput.should("have.value", asset.name);
    }

    if (asset.description !== undefined) {
      assetDetails.descriptionInput.should("have.value", asset.description);
    }
    if (asset.assetType !== undefined) {
      assetDetails.assetTypeButton.should("have.text", asset.assetType.name);
    }
  }

  uploadDocumentData(document) {
    if (document.documentLocation !== undefined) {
      cy.get('app-document-modal [class="btn btn-block btn-outline-secondary"] [type="file"]').attachFile(document.documentLocation);
      cy.wait(1500);
      cy.get("app-document-modal p").then((ele) => {
        let text = ele.text();
        cy.wrap(text).as("documentId");
      });
    }

    if (document.type !== undefined) {
      cy.get('[id="documentType"]').clear().type(document.type);
    }

    if (document.description !== undefined) {
      cy.get('[id="documentDescription"]').clear().type(document.description);
    }

    cy.get('app-document-modal [class*="btn-primary"]').click();
  }

  verifyDocumentRow(document: Document, index = -1) {
    if (index !== -1) index += 1;
    cy.wait(2000);
    if (document.description !== undefined) {
      cy.get(" app-asset-documents lib-row").eq(index).find("lib-cell").eq(0).should("contain.text", document.description);
    }

    if (document.type !== undefined) {
      cy.get(" app-asset-documents lib-row").eq(index).find("lib-cell").eq(1).should("contain.text", document.type);
    }
  }

  verifyDocumentList(documentList) {
    documentList.forEach((ele, index) => {
      this.verifyDocumentRow(ele, index);
    });
  }

  startEditingDocument(index = 0) {
    cy.get('app-asset-documents  [class*="dropdown-toggle"]').eq(index).click();
    cy.get('app-asset-documents [class="btn-group show dropdown"] [ngbdropdownitem]').eq(0).click();
  }

  deleteDocument(index = 0) {
    cy.get('app-asset-documents [class*="dropdown-toggle"]').eq(index).click();
    cy.get('app-asset-documents [class="btn-group show dropdown"] [ngbdropdownitem]').eq(1).click();
  }

  uploadImage(imageUrl: string, config = { verify: true }) {
    assetDetails.uploadImageInput.attachFile(imageUrl);
    if (config.verify === true) {
      this.verifyImageExists();
    }
  }

  verifyImageExists() {
    assetDetails.imageContainer.should("not.have.class", "empty");
    assetDetails.imageContainer.should("not.have.attr", "style", 'style="background-image: url("");"');
    assetDetails.imageContainer.invoke("attr", "style").then((ele) => {
      cy.wrap(ele).as("imageUrl");
    });
  }

  verifyImageDoesntExist() {
    assetDetails.imageContainer.should("have.class", "empty");
    assetDetails.imageContainer.should("have.attr", "style", 'background-image: url("");');
  }

  searchAsset(query: string, searchIndex = -1, config: any = { verify: true }) {
    this.menuItemSearch.should("be.enabled").clear().type(query);

   // if (config.verify == true) {
   //   this.tableRow.eq(searchIndex).find('[class="table-cell"]').eq(0).should("contain.text", query);
   // }
  }

  searchAndStartEditingAsset(assetName) {
    this.searchAsset(assetName);
    this.startEditingAsset();
  }

  verifyAssetHistoryRow(history, index = -1) {
    cy.get('app-asset-history [class*="table-body"] [class="table-row"]').as("historyRow");

    if (history.dateTime !== undefined) {
    }
    if (history.action !== undefined) {
      cy.get("@historyRow").eq(index).find("lib-cell").eq(1).should("contain.text", history.action);
    }
    if (history.createdBy !== undefined) {
    }
  }

  verifyAssetHistory(history) {
    history.forEach((ele, index) => {
      this.verifyAssetHistoryRow(ele, index);
    });
  }

  editDynamicProperty(name, index = 0) {
    assetDetails.dynamicPropertyEditButton.eq(index).click();
    propertyDetails.nameField.eq(index).clear().type(name);
    propertyDetails.header.click(); //clicking away from the field
  }

  verifyDynamicProperty(name, index = 0) {
    propertyDetails.nameField.eq(index).should("be.disabled").should("have.value", name);
  }

  deleteAsset() {
    cy.intercept("DELETE", constants.endpoints.assetsId).as("deleteAsset");

    assetDetails.deleteAssetButton.click();
    confirmationModal.confirmationButton.should("be.visible").click();

    cy.wait("@deleteAsset").then((data: any) => {
      expect(data.response.statusCode).to.equal(200);
      cy.wait(2000);
    });
  }


  allocateAssetToRoot(index = 0) {
    cy.get('app-asset-hierarchy-dropdown').eq(index).click();
    cy.get('[class*="form-dropdown-menu"] [class="cdk-tree"]').eq(-1).find('[class="asset-name"]').eq(0).should('contain.text', 'Root').click();
  }

  allocatedAssetIsDisabled(index = 0) {
    cy.get('app-asset-hierarchy-dropdown button').eq(index).should('be.disabled');
  }

  //TODO: Refactor - function prone to failures
  allocateAsset(assetName, parentsToExpand, dropDownIndex) {

    cy.get('app-asset-hierarchy-dropdown').eq(dropDownIndex).click();
    parentsToExpand.forEach((parent) => {
      cy.wait(1000);
      cy.get('[class*="form-dropdown-menu"] [class="cdk-tree"]').eq(-1).find('[class="hierarchy-node"]').contains(parent).parent().find("button").invoke("attr", "class").then((ele: any) => {

        if (ele.search("expanded") == -1) {
          cy.get('[class*="form-dropdown-menu"] [class="cdk-tree"]').eq(-1).find('[class="hierarchy-node"]').contains(parent).parent().find("button").click();
        }
      });


    });

    cy.wait(2000);
    cy.get('[class*="form-dropdown-menu"] [class="cdk-tree"]').eq(-1).find('[class="hierarchy-node"] [class="asset-name"]').contains(assetName).click();
  }

  allocatedAssetTableAction(config = { action: undefined, index: -1 }) {

    if (config.action == "edit") {
      cy.get('[class="dropdown-toggle btn btn-transparent btn-icon"]').eq(config.index).click();
      cy.get('div[class*="show"] button').eq(1).click();
      cy.url().should('include', '/assets/');
    }

    if (config.action == "clone") {
      cy.intercept("POST", constants.endpoints.assetClone).as("assetClone");

      cy.get('[class="dropdown-toggle btn btn-transparent btn-icon"]').eq(config.index).click();
      cy.get('div[class*="show"] button').eq(-3).click();

      cy.wait("@assetClone").then((data: any) => {
        expect(data.response.statusCode).to.equal(201);
        cy.wait(2000);
      });
    }

    if (config.action == "delete") {
      cy.intercept("DELETE", constants.endpoints.assetsId).as("deleteAsset");

      cy.get('[class="dropdown-toggle btn btn-transparent btn-icon"]').eq(config.index).click();
      cy.get('button[class*="text-danger"]').click();
      confirmationModal.confirmationButton.should('be.visible').click();

      cy.wait("@deleteAsset").then((data: any) => {
        expect(data.response.statusCode).to.equal(200);
        cy.wait(2000);
      });
    }

    if (config.action == "deallocate") {

      cy.intercept("POST", constants.endpoints.transform).as("transformAsset");

      cy.get('[class="dropdown-toggle btn btn-transparent btn-icon"]').eq(config.index).click();
      cy.get('div[class*="show"] button').eq(-2).click();

      cy.wait("@transformAsset").then((data: any) => {
        expect(data.response.statusCode).to.equal(201);
        cy.wait(2000);
      });
    }

    if (config.action == "trydeallocate") {

      cy.get('[class="dropdown-toggle btn btn-transparent btn-icon"]').eq(config.index).click();
      cy.get('div[class*="show"] button').eq(-2).click();

      cy.get('lib-modal-message').should('contain.text', 'This action cannot be completed because the asset contains one or more children');
    }

    if (config.action == "createSubAsset") {

      cy.get('[class="dropdown-toggle btn btn-transparent btn-icon"]').eq(config.index).click();
      cy.get('div[class*="show"] button').eq(3).click();
      cy.url().should("include", "/assets/new?parentId=");
    }
  }

  getAllocatedAssetIndex(name) {
    cy.get("[class='name-column']").each(($ele, index) => {
      if ($ele.text().search(name) != -1) {

        cy.wrap(index).as("allocatedAssetIndex");
        return;
      }
    })
  }

  addAndAllocateAssets(toCreateAssetList) {
    toCreateAssetList.forEach((asset) => {
      assetPoolAPI.addAsset(asset);
      cy.wait(2500);
    });
    cy.task("getAssetList").then((assetList: []) => {

      let assetListIds = assetList.slice(toCreateAssetList.length * -1); //Taking the back of the array
      assetPoolAPI.allocateAsset({ id: assetListIds[0] });
      for (let i = 1; i < toCreateAssetList.length; i++) {
        assetPoolAPI.allocateAsset({ id: assetListIds[i], childOf: assetListIds[i - 1] });
      }
    });
    cy.wait(5000);
  }

  openAssetMenu(query: string) {
    this.searchAsset(query);
    this.tableRow.contains(query).parents('.table-body').find('.table-row .actions > div > button').click();
  }

  expandAllocatedAssetTree(index) {
    cy.get("lib-tree-toggle-cell > button").eq(index).click();
  }

  verifyAssetIsVisible(name) {
    cy.get("[class='name-column']").contains(name).parent().scrollIntoView().should('be.visible');
  }
  
  verifyAssetIsNotVisible(name) {
    cy.get("[class='name-column']").contains(name).parent().scrollIntoView().should('be.not.visible');
  }

  closeInvalidActionPopup() {
    cy.get('[class="modal-content"]').as('invalidAction').should('be.visible');
    cy.get('[class="modal-content"] [class="btn btn-secondary"]').should('be.visible').click();
    cy.get('@invalidAction').should('not.be.visible');
  }

  CloseWithXInvalidActionPopup() {
    cy.get('[class="modal-content"]').as('invalidAction').should('be.visible');
    cy.get('[class*="modal-header"] button').should('be.visible').click();
    cy.get('@invalidAction').should('not.be.visible');
  }

  clickOnMenuIcon(query: string) {
    this.tableRow.contains(query).parents('.table-row').find(' .actions > div > button').click();
  }

  verifyAssetRow(query, config = { veriyRow: -1 }) {
    this.tableRow
      .eq(config.veriyRow)
      .find('[class="table-cell"]')
      .eq(0)
      .should('contain.text', query);
  }

  searchAndVerifyAsset(query, config = { veriyRow: -1 }) {
    this.searchAsset(query);
    this.verifyAssetRow(query, config);
  }
}
