export default class AssetDetails {
  get createAssetButton() {
    return cy.get('app-asset-details .panel-header-actions [class="btn btn-primary"]');
  }
  get deallocateAssetButton() {
    return cy.get('lib-panel-header button').contains("Deallocate");
  }
  get assetName() {
    return cy.get('app-asset-details .panel-header h2');
  }
  get wrapper() {
    return cy.get('app-asset-details');
  }
  get assetTypeButton() {
    return cy.get('button.btn-outline-secondary');
  }
  get aliasTableRow() {
    return cy.get("app-asset-aliases lib-row");
  }
  get aliasTableCell() {
    return cy.get("app-asset-aliases lib-row lib-cell");
  }
  get addDocumentButton() {
    return cy.get('app-asset-documents [class="panel-header-actions"] button');
  }
  get cancelButton() {
    return cy.get('a.a-button');
  }
  get cloneButton() {
    return cy.get('.panel-header-actions>button>i').first();
  }
  get assetAliasTitle() {
    return cy.get("app-asset-aliases h4");
  }
  get dynamicPropertiesTitle() {
    return cy.get("app-asset-dynamic-properties h4");
  }
  get documentsTitle() {
    return cy.get("app-asset-documents h4");
  }
  get assetHistoryTitle() {
    return cy.get("app-asset-history h4");
  }
  get dynamicPropertyEditButton() {
    return cy.get('app-asset-dynamic-properties [role="button"]');
  }
  get dynamicPropertyInput() {
    return cy.get("app-asset-dynamic-properties input");
  }
  get deleteAssetButton() {
    return this.wrapper.find('lib-panel-header-actions button:nth-child(2)');
  }
  get addAliasButton() {
    return cy.get('[formcontrolname="aliases"] button');
  }

  // Input fields
  get assetNameInput() {
    return cy.get('[id="name"]');
  }
  get parentAssetInput() {
    return cy.get('app-asset-details-form [class="form-control"]').eq(1);
  }
  get assetTypeDropdownElement() {
    return cy.get('app-asset-details-form [class*="dropdown-item"]');
  }
  get isa95TypeInput() {
    return cy.get('app-asset-details-form [class="form-control"]').eq(2);
  }
  get descriptionInput() {
    return cy.get('[id="description"]');
  }
  get uploadImageButton() {
    return cy.get("button[uploadbutton]");
  }
  get uploadImageInput() {
    return cy.get("button[uploadbutton] input");
  }
  get imageContainer() {
    return cy.get('.panel-body-container [class*="image-container"]');
  }
  get deleteImageButton() {
    return cy.get('app-asset-details-form [class*="btn-transparent btn-icon"]');
  }

  addAssetDetails(asset: any) {
    if (asset.name !== undefined) {
      this.assetNameInput.clear().type(asset.name);
    }

    if (asset.description !== undefined) {
      this.descriptionInput.clear().type(asset.description);
    }
    if (asset.assetType !== undefined) {
      this.assetTypeButton.click();
      this.assetTypeDropdownElement.contains('AssetType').click();
    }
  }
}

