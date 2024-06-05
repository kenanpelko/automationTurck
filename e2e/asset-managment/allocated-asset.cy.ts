import "cypress-file-upload";
import { qase } from "cypress-qase-reporter/dist/mocha";
import AssetManagment from "../../page-object/asset-managment/asset-managment.po";
import ConfirmationModal from "../../page-object/asset-managment/component/modal-confirmation.po";
import AssetPoolAPI from "../../support/request/asset-pool-request";
import { assetTypes } from "../../support/types/asset-types";

import generateRandomAssetType from "../../support/helpers/asset-type";
import generateRandomAsset from "../../support/helpers/asset";
import { Asset } from "../../support/types/asset";
import AssetDetails from "../../page-object/asset-managment/asset-details.po";

const localization = require(`../../fixtures/i18n/asset-managment/${Cypress.env('LANGUAGE')}`); 
const assetManagment = new AssetManagment();
const confirmationModal = new ConfirmationModal();
const assetPoolAPI = new AssetPoolAPI();
const assetDetails = new AssetDetails();

describe("Allocated assets - Clone asset", () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    assetPoolAPI.addAsset(asset);
    cy.get('@assetId').then(id => {
      assetPoolAPI.assetTransform({ id: id, type: "childOf" })
    });
    cy.reload();
    cy.navigateToAllocatedAsset();
  });

  qase(
    162,
    it("Verify user can Duplicate Asset from Dropdown menu / Allocated Asset page", () => {
      assetManagment.openAssetMenu(asset.name);
      assetManagment.dropdownDuplicateOption.click();
      cy.wait(2000);
      assetManagment.searchAsset(asset.name);
      cy.get('.table-body lib-row').contains(asset.name).should('be.visible');
      cy.get('.table-body lib-row').should('have.length', 2);
    })
  );
});

describe("Allocated assets - Delete asset", () => {
  let asset: Asset = generateRandomAsset();

  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.task("clearAssetList");
    assetPoolAPI.addAsset(asset);
    cy.get('@assetId').then(id => {
      assetPoolAPI.assetTransform({ id: id, type: "childOf" })
    });
    cy.reload();
    cy.navigateToAllocatedAsset();

  });

  qase(
    163,
    it("Verify user can Delete Asset from Dropdown menu / Allocated Asset page", () => {
      assetManagment.openAssetMenu(asset.name);
      assetManagment.dropdownDeleteOption.click();
      confirmationModal.wrapper.should('be.visible');
      confirmationModal.confirmationButton.click();
      cy.wait(2000);
      assetManagment.searchAsset(asset.name);
      cy.get('.table-body lib-row').find('span').contains('No assets found').should('be.visible');
    })
  );
});

describe("Allocated assets - Search asset", () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.task("clearAssetList");
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    assetPoolAPI.addAsset(asset);
    cy.get('@assetId').then(id => {
      assetPoolAPI.assetTransform({ id: id, type: "childOf" })
    });
    cy.reload();
    cy.navigateToAllocatedAsset();
  });

  qase(
    162,
    it("Verify user can Duplicate Asset from Dropdown menu / Allocated Asset page", () => {
      assetManagment.searchAsset(asset.name);
      cy.get('.table-body lib-row').contains(asset.name).should('be.visible').and('have.length', 1);
      cy.wait(2000);
      assetManagment.searchAsset('No asset found');
      cy.get('.table-body lib-row').find('span').contains('No assets found').should('be.visible');
    })
  );
});

describe("Allocated assets - Deallocate asset", () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.task("clearAssetList");
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    assetPoolAPI.addAsset(asset);
    cy.get('@assetId').then(id => {
      assetPoolAPI.assetTransform({ id: id, type: "childOf" })
    });
    cy.reload();
    cy.navigateToAllocatedAsset();
  });

  qase(
    162,
    it("Verify user can Duplicate Asset from Dropdown menu / Allocated Asset page", () => {
      assetManagment.searchAsset(asset.name);
      assetManagment.openAssetMenu(asset.name);
      assetManagment.dropdownDeallocateOption.click();
      cy.wait(2000);
      assetManagment.searchAsset(asset.name);
      cy.get('.table-body lib-row').find('span').contains('No assets found').should('be.visible');
      assetManagment.menuItemAssetPool.click();
      assetManagment.searchAsset(asset.name);
      cy.get('.table-body lib-row').contains(asset.name).should('be.visible').and('have.length', 1);
    })
  );
});

describe("Allocated assets - Deallocate asset - Negative", () => {
  let childAsset: Asset = generateRandomAsset();
  let parentAsset: Asset = generateRandomAsset();
  const assetType: assetTypes = generateRandomAssetType();
  before(() => {
    cy.task("clearAssetList");
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    assetPoolAPI.deleteAllAllocatedAssets();
    cy.clearCookies();
    cy.reload();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.addAssetType(assetType);
    assetPoolAPI.addAsset(parentAsset);
    cy.get('@assetId').then(id => {
      assetPoolAPI.assetTransform({ id: id, type: "childOf" })
    });
    cy.reload();
    cy.navigateToAllocatedAsset();
    assetManagment.openAssetMenu(parentAsset.name);
    assetManagment.createNewSubassetOption.click();
    let assetEssential: Asset = { name: childAsset.name, assetType: 'Generic' };
    assetDetails.addAssetDetails(assetEssential);
    assetDetails.createAssetButton.click().wait(2000);
  });

  qase(
    173,
    it("Verify user can't deallocate asset that contains children", () => {
      assetManagment.menuItemAllocatedAssets.click();
      cy.reload();
      assetManagment.expandAllButton.click();
      assetManagment.clickOnMenuIcon(parentAsset.name);
      assetManagment.dropdownDeallocateOption.click({ force: true });
      cy.wait(2000);
      confirmationModal.wrapper.should('be.visible');
      confirmationModal.title.should('contain', 'Invalid action');
      
      //Close popup and clear assets
      cy.wait(2000)
      assetManagment.CloseWithXInvalidActionPopup();
      assetPoolAPI.deleteAllAllocatedAssets();
    })
  );

  qase(
    174,
    it("Verify Invalid action (Deallocate asset) can be closed via Close button", () => {
      let asset: Asset = generateRandomAsset();
      let asset1: Asset = generateRandomAsset();
      assetManagment.addAndAllocateAssets([asset, asset1]);
      cy.reload();

      assetManagment.getAllocatedAssetIndex(asset.name);
      cy.get("@allocatedAssetIndex").then((i: any) => {
        assetManagment.allocatedAssetTableAction({ action: "trydeallocate", index: i });
      });
      assetManagment.closeInvalidActionPopup();
      assetPoolAPI.deleteAllAllocatedAssets();
    })
  );

  qase(
    175,
    it("Verify Invalid action (Deallocate asset) can be closed via X button", () => {
      let asset: Asset = generateRandomAsset();
      let asset1: Asset = generateRandomAsset();
      assetManagment.addAndAllocateAssets([asset, asset1]);
      cy.reload();

      assetManagment.getAllocatedAssetIndex(asset.name);
      cy.get("@allocatedAssetIndex").then((i: any) => {
        assetManagment.allocatedAssetTableAction({ action: "trydeallocate", index: i });
      });
      assetManagment.CloseWithXInvalidActionPopup();
      assetPoolAPI.deleteAllAllocatedAssets();
    })
  );

  after(() => {
    assetPoolAPI.deleteAllAllocatedAssets();
    assetPoolAPI.deleteAllAssetTypes();
  });
});
