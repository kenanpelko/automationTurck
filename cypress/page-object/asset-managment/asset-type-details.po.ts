import constants from "../../support/constant/asset-managment/index";

//const propertyDetails = new PropertyDetails();

export default class AssetTypeDetails {
  get wrapper() {
    return cy.get('app-asset-type-details');
  }

  get title() {
    return cy.get("app-asset-type-details-form h4");
  }

  get assetTitle() {
    return this.wrapper.find('.panel-header h2');
  }

  get parentAssetDropdownItem() {
    return cy.get('app-asset-type-details-form [class="dropdown-item"]').eq(1);
  }

  get isa95TypeDropdownItem() {
    return cy.get('.form-dropdown-menu').last().find('.dropdown-item').eq(2);
  }

  get assetTypeDetailsTitle() {
    return cy.get("app-asset-type-details-form h4");
  }

  get dynamicPropertiesTitle() {
    return cy.get("app-asset-type-properties h4");
  }

  get assignedAssetsTitle() {
    return cy.get("app-asset-type-assigned-assets h4");
  }

  // Buttons
  get createAssetTypeButton() {
    return this.wrapper.find('lib-panel-header-actions .btn-primary');
  }

  get parentAssetButton() {
    return cy.get('.btn-outline-secondary').first();
  }
  get isa95TypeInput() {
    return cy.get('.btn-outline-secondary').last();
  }
  get saveChangesOnAssetTypeButton() {
    return cy.get('.btn-primary');
  }
  get cancelButton() {
    return cy.get('.a-button');
  }
  get addNewPropertyBtn() {
    return cy.get('app-asset-type-properties lib-panel-header-actions button');
  }
  get editDynamicPropertyButton() {
    return cy.get(':nth-child(1) > :nth-child(9) > .btn > .material-icons');
  }
  get deleteDynamicPropertyButton() {
    return cy.get(':nth-child(1) > :nth-child(8) > .btn > .material-icons');
  }

  get deleteAssetTypeButton() {
    return this.wrapper.find('lib-panel-header-actions > button.btn-icon');
  }

  // Fields
  get name() {
    return cy.get('#name');
  }
  get description() {
    return cy.get('#description');
  }

  addAssetTypeDetails(assetType: any) {
    if (assetType.assetTypeName !== undefined) {
      this.name.clear().type(assetType.assetTypeName);
    }

    if (assetType.parentAsset !== undefined) {
      this.parentAssetButton.click();
      this.parentAssetDropdownItem.click();
    }

    if (assetType.isa95Type !== undefined) {
      this.isa95TypeInput.click();
      this.isa95TypeDropdownItem.click();
    }

    if (assetType.description !== undefined) {
      this.description.clear().type(assetType.description);
    }
  }

  // openExistingDynamicProperty() {
  //   this.editDynamicPropertyButton.click();
  //   cy.wait(1000);
  //   propertyDetails.header.should('contain.text', 'Dynamic properties >');
  // }

  openDeleteDynamicPropertyPopup() {
    this.deleteDynamicPropertyButton.click();
  }

  editAssetTypeAndVerify() {
    cy.intercept("PATCH", constants.endpoints.assetTypesId).as("updateAssetType");
    this.saveChangesOnAssetTypeButton.click();
    cy.wait("@updateAssetType").then((data: any) => {
      expect(data.response.statusCode).to.equal(200);
      cy.wait(2000);
    });
  }

  verifyAssetTypeDetails(assetType: any) {
    if (assetType.assetTypeName !== undefined) {
      this.name.should("have.value", assetType.assetTypeName);
    }
    if (assetType.description !== undefined) {
      this.description.should("have.value", assetType.description);
    }
  }

  clickOnDeleteDynamicProperty(dynamicPropertyName: string) {
    cy.get('app-asset-type-properties').find('.table-body-container .table-cell:nth-child(3)').contains(dynamicPropertyName).parent().find('.table-cell:nth-child(8)').click();
  }

  clickOnEditDynamicProperty(dynamicPropertyName: string) {
    cy.get('app-asset-type-properties').find('.table-body-container .table-cell:nth-child(3)').contains(dynamicPropertyName).parent().find('.table-cell:nth-child(9)').click();
  }

  verifyDynamicProperty(dynamicProperty: any) {
    cy.get('app-asset-type-properties .table-body lib-cell:nth-child(3)').contains(dynamicProperty.propertyName).should('be.visible');
    cy.get('app-asset-type-properties .table-body lib-cell:nth-child(4)').contains(dynamicProperty.defaultValue).should('be.visible');
    cy.get('app-asset-type-properties .table-body lib-cell:nth-child(5)').contains(dynamicProperty.key).should('be.visible');
  }
}
