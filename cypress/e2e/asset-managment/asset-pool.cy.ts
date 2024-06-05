import { qase } from 'cypress-qase-reporter/dist/mocha';
import { Asset } from '../../support/types/asset';
import AssetManagment from '../../page-object/asset-managment/asset-managment.po';
import AssetPool from '../../page-object/asset-managment/asset-pool.po';
import AssetDetails from '../../page-object/asset-managment/asset-details.po';
import ConfirmationModal from '../../page-object/asset-managment/component/modal-confirmation.po';
import AssetPoolAPI from '../../support/request/asset-pool-request';
import generateRandomAsset from '../../support/helpers/asset';
import constant from '../../support/constant/asset-managment';
import { assetTypes } from "../../support/types/asset-types";
import generateRandomAssetType from "../../support/helpers/asset-type";

const localization = require(`../../fixtures/i18n/asset-managment/${Cypress.env('LANGUAGE')}`); 
const assetManagment = new AssetManagment();
const assetPool = new AssetPool();
const assetDetails = new AssetDetails();
const confirmationModal = new ConfirmationModal();
const assetPoolAPI = new AssetPoolAPI();

describe('Asset pool - Navigation and Page elements', () => {
  before(() => {
    cy.task('clearAssetList');
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
  });

  beforeEach(() => {
    cy.preserveCookieOnce(
      '_oauth2_proxy',
      '_oauth2_proxy_0',
      '_oauth2_proxy_1',
    );
    cy.navigateToAssetPool();
  });

  qase(
    190,
    it('Verify all elements are loaded on Asset pool page', () => {
      const asset: Asset = generateRandomAsset();
      cy.addAsset(asset);

      assetPool.tableHeaderName.should(
        'contain.text',
        localization.assetPool.table.tableHeader.name,
      );
      assetPool.tableHeaderType.should(
        'contain.text',
        localization.assetPool.table.tableHeader.type,
      );
      assetPool.tableHeaderId.should(
        'contain.text',
        localization.assetPool.table.tableHeader.ID,
      );
      assetPool.tableHeaderDocument.should(
        'contain.text',
        localization.assetPool.table.tableHeader.documents,
      );
      assetPool.tableHeaderCreatedAt.should(
        'contain.text',
        localization.assetPool.table.tableHeader.createdUpdatedAt,
      );
      assetPool.createNewAssetButton.should(
        'contain.text',
        localization.menu.createNewAsset,
      );

      assetManagment.menuItemAllocatedAssets.should(
        'contain.text',
        localization.menu.allocatedAssets,
      );
      assetManagment.menuItemAssetPool.should(
        'contain.text',
        localization.menu.assetPool,
      );
      assetManagment.menuItemAssetTypes.should(
        'contain.text',
        localization.menu.assetTypes,
      );
      assetManagment.menuItemSearch.should(
        'have.attr',
        'placeholder',
        localization.menu.search,
      );
    }),
  );

  qase(
    204,
    it('Verify all elements are loaded in Create new asset form', () => {
      cy.verifyURLContains(constant.path.assetPool);
      assetPool.createNewAssetButton.click();
      cy.verifyURLContains(constant.path.assetNew);
      // Verify page elements
      assetDetails.createAssetButton.should('be.visible').and('be.disabled');
      assetDetails.cancelButton.should('be.visible');
      assetDetails.assetNameInput.should('be.visible');
      assetDetails.parentAssetInput.should('be.visible');
      assetDetails.assetTypeButton.should('be.visible');
      assetDetails.isa95TypeInput.should('be.visible');
      assetDetails.uploadImageButton.should('be.visible');
      assetDetails.assetAliasTitle.should(
        'contain.text',
        localization.assetPool.createNewAsset.titles.assetAliases,
      );
      assetDetails.addAliasButton.should('be.visible');
      assetDetails.dynamicPropertiesTitle.should(
        'contain.text',
        localization.assetPool.createNewAsset.titles.dynamicProperties,
      );
      assetDetails.documentsTitle.should(
        'contain.text',
        localization.assetPool.createNewAsset.titles.documents,
      );
      assetDetails.addDocumentButton.should('be.visible');
      assetDetails.assetHistoryTitle.should(
        'contain.text',
        localization.assetPool.createNewAsset.titles.assetHistory,
      );
    }),
  );

  qase(
    432,
    it('Verify user can properly open and close Create new asset form (Via Cancel button)', () => {
      cy.verifyURLContains(constant.path.assetPool);
      assetPool.createNewAssetButton.click();
      cy.verifyURLContains(constant.path.assetNew);
      assetDetails.cancelButton.click(); //Reverting back data from the before each hook
      cy.verifyURLContains(constant.path.assetPool);
    }),
  );
});

describe('Asset pool - Search', () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.preserveCookieOnce(
      '_oauth2_proxy',
      '_oauth2_proxy_0',
      '_oauth2_proxy_1',
    );
    cy.navigateToAssetPool();
  });

  qase(
    211,
    it('Verify Search feature is working on Asset pool page', () => {
      cy.addAsset(asset);
      //Existing asset
      assetManagment.searchAsset(asset.name);
      assetManagment.tableAssetName
        .should('contain', asset.name)
        .and('have.length', 1);
      //Non existing asset
      assetManagment.searchAsset('DO NOT EXIST');
      assetManagment.tableAssetName.should('not.exist');
      cy.get('.table-body lib-row')
        .find('span')
        .contains( localization.assetPool.table.noAssetFound)
        .should('be.visible');
    }),
  );
});

describe('Asset pool - Menu option - Delete modal', () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.addAsset(asset);
  });

  beforeEach(() => {
    cy.preserveCookieOnce(
      '_oauth2_proxy',
      '_oauth2_proxy_0',
      '_oauth2_proxy_1',
    );
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToAssetPool();
    assetManagment.openAssetMenu(asset.name);
    assetManagment.dropdownDeleteOption.click();
    cy.wait(2000);
  });

  qase(
    215,
    it('Open Delete Asset via Menu popup and verify all elements are loaded', () => {
      confirmationModal.wrapper.should('be.visible');
      confirmationModal.title.should('contain', localization.assetPool.table.deletePopup);
      confirmationModal.xButton.should('be.visible');
      confirmationModal.confirmationButton.should('be.visible');
    }),
  );

  qase(
    216,
    it('Open Delete Asset via Menu popup and close with X button', () => {
      confirmationModal.wrapper.should('be.visible');
      confirmationModal.xButton.click();
      confirmationModal.wrapper.should('not.exist');
    }),
  );

  qase(
    217,
    it('Open Delete Asset via Menu popup and close with cancel button', () => {
      confirmationModal.wrapper.should('be.visible');
      confirmationModal.cancelButton.click();
      confirmationModal.wrapper.should('not.exist');
    }),
  );
});

describe('Asset pool - Delete asset from edit page - Delete modal', () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    assetPoolAPI.addAsset(asset);
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToAssetPool();
    cy.task('getAsset').then(assetId => {
      cy.wrap(assetId).as('assetId');
      cy.openAssetDetails('@assetId');
    });
    assetDetails.deleteAssetButton.click();
  });

  qase(
    223,
    it('Trigger delete Asset popup on Edit page and verify all elements', () => {
      confirmationModal.wrapper.should('be.visible');
      confirmationModal.title.should('contain', 'Delete asset?');
      confirmationModal.xButton.should('be.visible');
      confirmationModal.confirmationButton.should('be.visible');
    }),
  );

  qase(
    224,
    it('Trigger delete Asset popup on Edit page and close it with X button', () => {
      confirmationModal.wrapper.should('be.visible');
      confirmationModal.xButton.click();
      confirmationModal.wrapper.should('not.exist');
    }),
  );

  qase(
    225,
    it('Trigger delete Asset popup on Edit page and close it with Cancel button', () => {
      confirmationModal.wrapper.should('be.visible');
      confirmationModal.cancelButton.click();
      confirmationModal.wrapper.should('not.exist');
    }),
  );
});

describe('Asset pool - Dropdown options', () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
  });

  beforeEach(() => {
    cy.preserveCookieOnce(
      '_oauth2_proxy',
      '_oauth2_proxy_0',
      '_oauth2_proxy_1',
    );
    cy.navigateToAssetPool();
  });

  qase(
    210,
    it('Verify user can Delete Asset from Dropdown menu / Asset pool page', () => {
      cy.addAsset(asset);
      assetManagment.searchAsset(asset.name);
      assetManagment.openAssetMenu(asset.name);
      assetManagment.dropdownDeleteOption.click();
      confirmationModal.wrapper.should('be.visible');
      confirmationModal.confirmationButton.click();
      assetManagment.searchAsset(asset.name);
      assetManagment.tableAssetName.should('not.exist');
      cy.get('.table-body lib-row')
        .find('span')
        .contains(localization.assetPool.table.noAssetFound)
        .should('be.visible');
    }),
  );
});

describe('Asset pool - Delete from Edit page', () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.addAsset(asset);
    cy.navigateToAssetPool();
    cy.wait(2000)
    cy.openAssetDetails('@assetId');
    cy.wait(2000);
  });

  qase(
    207,
    it('Verify user can delete Asset in Edit Asset page', () => {
      assetDetails.deleteAssetButton.click();
      confirmationModal.wrapper.should('be.visible');
      confirmationModal.confirmationButton.click();
      cy.wait(2000);
      cy.verifyURLContains(constant.path.assetPool);
      assetManagment.searchAsset(asset.name);
      assetManagment.tableAssetName.should('not.exist');
      cy.get('.table-body lib-row')
        .find('span')
        .contains(localization.assetPool.table.noAssetFound)
        .should('be.visible');
    }),
  );
});

describe('Asset pool - Duplicate inside of the asset table', () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.addAsset(asset);
    cy.navigateToAssetPool();
    cy.openAssetDetails('@assetId');
    cy.wait(2000);
    cy.navigateToAssetPool();
  });

  qase(
    209,
    it('Verify user can Duplicate Asset from Dropdown menu / Asset pool page', () => {
      //Existing asset
      assetManagment.searchAsset(asset.name);
      assetManagment.cloneAssetFromTable(-1);
      assetManagment.searchAndVerifyAsset(asset.name, { veriyRow: -1 });
      assetManagment.searchAndVerifyAsset(asset.name, { veriyRow: -2 });
    }),
  );
});

describe('Asset pool - Duplicate inside of the asset details', () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.addAsset(asset);
    cy.navigateToAssetPool();
    cy.openAssetDetails('@assetId');
    cy.wait(2000);
  });

  beforeEach(() => {
    cy.preserveCookieOnce(
      '_oauth2_proxy',
      '_oauth2_proxy_0',
      '_oauth2_proxy_1',
    );
  });

  qase(
    206,
    it('Verify user can clone Asset in Edit Asset page', () => {
      assetDetails.cloneButton.click();
      cy.navigateToAssetPool();
      cy.reload();
      //Making sure we have two assets with this given name
      assetManagment.searchAndVerifyAsset(asset.name, { veriyRow: -1 });
      assetManagment.searchAndVerifyAsset(asset.name, { veriyRow: -2 });
    }),
  );
});

describe('Asset pool - Verify user can create new asset', () => {
  before(() => {
    cy.task('clearAssetList');
    const assetType: assetTypes = generateRandomAssetType();
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.addAssetType(assetType);
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToAssetPool();
  });

  qase(
    193,
    it('Verify user can Create new asset with only Mandatory data', () => {
      assetPool.createNewAssetButton.click();
      let newAsset: Asset = generateRandomAsset();
      let assetEssential: Asset = { name: newAsset.name, assetType: 'Generic' };
      cy.verifyURLContains(constant.path.assetNew);
      assetDetails.addAssetDetails(assetEssential);
      assetDetails.createAssetButton.should('be.enabled');
      assetDetails.createAssetButton.click().wait(3000);
      assetManagment.searchAsset(newAsset.name);
      cy.get('.table-body lib-row')
        .contains(newAsset.name)
        .should('be.visible')
        .and('have.length', 1);
    }),
  );
});

describe('Asset pool - Edit asset', () => {
  let asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.addAsset(asset);
    cy.navigateToAssetPool();
    cy.wait(2000)
    cy.openAssetDetails('@assetId');
    cy.wait(2000);
  });

  // Issue skipped because of reported bug (https://gitlab.elunic.software/turck/myturck/-/issues/229)
  qase(
    226,
    xit('Verify user can edit Asset', () => {
      const assetEdited: Asset = generateRandomAsset();
      assetDetails.assetName.should('contain', asset.name);

      assetDetails.addAssetDetails({ name: assetEdited.name });
      cy.wait(1000)
      assetDetails.createAssetButton.should('be.enabled');
      assetDetails.createAssetButton.click().wait(3000);
      assetManagment.searchAsset(assetEdited.name);
      cy.get('.table-body lib-row')
        .contains(assetEdited.name)
        .should('be.visible')
        .and('have.length', 1);
      assetManagment.searchAsset(asset.name);
      cy.get('.table-body lib-row')
        .find('span')
        .contains(localization.assetPool.table.noAssetFound)
        .should('be.visible');
    }),
  );
});

after(() => {
  assetPoolAPI.deleteAllUnallocatedAssets();
});
