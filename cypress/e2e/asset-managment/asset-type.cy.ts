import 'cypress-v10-preserve-cookie';
import { qase } from "cypress-qase-reporter/dist/mocha";
import { assetTypes } from "../../support/types/asset-types";
import { dynamicProperty } from "../../support/types/dynamic-properties";

import AssetManagment from "../../page-object/asset-managment/asset-managment.po";
import AssetTypesManagment from "../../page-object/asset-managment/asset-type-managment";
import AssetTypeDetails from "../../page-object/asset-managment/asset-type-details.po";
import ConfirmationModal from '../../page-object/asset-managment/component/modal-confirmation.po';
import DynamicPropertyDetails from '../../page-object/asset-managment/component/propery-details.po';

import generateRandomAssetType from "../../support/helpers/asset-type";
import generateRandomDynamicProperty from "../../support/helpers/property";

import constant from "../../support/constant/asset-managment";
import AssetPoolAPI from '../../support/request/asset-pool-request';

const localization = require(`../../fixtures/i18n/asset-managment/${Cypress.env('LANGUAGE')}`); 
const assetManager = new AssetManagment();
const assetTypesManagment = new AssetTypesManagment();
const assetTypeDetails = new AssetTypeDetails();
const confirmationModal = new ConfirmationModal();
const dynamicPropertyDetails = new DynamicPropertyDetails();
const assetPoolApi = new AssetPoolAPI();

describe('Asset type - Elements & Navigation', () => {
    const assetType: assetTypes = generateRandomAssetType();
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.addAssetType(assetType);
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
        cy.navigateToAssetType();
    });

    qase(
        228,
        it("Verify all elements are loaded on Asset types page", () => {
            assetTypesManagment.tableHeaderName.should("contain.text", localization.assetTypes.table.tableHeader.name);
            assetTypesManagment.tableHeaderIsa95Type.should("contain.text", localization.assetTypes.table.tableHeader.isa95Type);
            assetTypesManagment.tableHeaderParentAssetType.should("contain.text", localization.assetTypes.table.tableHeader.parentAssetType);
            assetTypesManagment.tableHeaderLastChanged.should("contain.text", localization.assetTypes.table.tableHeader.lastChanged);

            assetManager.menuItemAllocatedAssets.should("contain.text", localization.menu.allocatedAssets);
            assetManager.menuItemAssetPool.should("contain.text", localization.menu.assetPool);
            assetManager.menuItemAssetTypes.should("contain.text", localization.menu.assetTypes);
            assetManager.menuItemSearch.should("have.attr", "placeholder", localization.menu.search);
            assetTypesManagment.createNewAssetTypeButton.should("contain.text", localization.menu.createNewAssetType);
        })
    )

    qase(
        232,
        it("Verify user can properly open and close Create new asset type form(Via Cancel button)", () => {
            cy.verifyURLContains(constant.path.assetTypes);
            assetTypesManagment.createNewAssetTypeButton.click();
            cy.verifyURLContains(constant.path.assetTypesNew);
            assetTypeDetails.cancelButton.should("be.visible").click();
            cy.verifyURLContains(constant.path.assetTypes);
            assetTypesManagment.createNewAssetTypeButton.should('be.visible');
        })
    );

    qase(
        231,
        it("Verify all elements are loaded in Create new asset type form", () => {
            cy.verifyURLContains(constant.path.assetTypes);

            assetTypesManagment.createNewAssetTypeButton.click();
            cy.wait(2000);

            assetTypeDetails.createAssetTypeButton.should("be.visible");
            assetTypeDetails.cancelButton.should("be.visible");

            assetTypeDetails.title.should("be.visible");
            assetTypeDetails.name.should("be.visible");
            assetTypeDetails.parentAssetButton.should("be.visible");
            assetTypeDetails.isa95TypeInput.should("be.visible");
            assetTypeDetails.description.should("be.visible");
            assetTypeDetails.dynamicPropertiesTitle.should("be.visible");
            assetTypeDetails.assignedAssetsTitle.should("be.visible");
        })
    );

    qase(
        244,
        it("Verify user can open Edit Asset type page by clicking on Asset type in table", () => {
            assetTypesManagment.searchAssetType(assetType.assetTypeName);
            cy.wait(5000);
            assetTypesManagment.openAssetTypeDetails(assetType.assetTypeName);
            assetTypeDetails.deleteAssetTypeButton.should('be.visible');
            assetTypeDetails.assetTitle.should('contain', assetType.assetTypeName);
        })
    );

    after(() => {
        assetPoolApi.deleteAllAssetTypes();
    });
});

describe('Asset type - Edit details - Delete modal', () => {
    let assetType: assetTypes = generateRandomAssetType();
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.addAssetType(assetType);
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
        cy.navigateToAssetType();
        cy.task("getAssetType").then((assetTypeId) => {
            cy.wrap(assetTypeId).as("assetTypeNewId")
            cy.openAssetTypeDetails('@assetTypeNewId');
        });
    });

    qase(
        248,
        it("Open delete asset type popup on Edit asset type page and verify all elements", () => {
            assetTypeDetails.deleteAssetTypeButton.click();
            confirmationModal.wrapper.should('be.visible');
            confirmationModal.title.should('contain', 'Delete asset type?');
            confirmationModal.xButton.should('be.visible');
            confirmationModal.confirmationButton.should('be.visible');
        })
    );

    qase(
        249,
        it("Open delete asset type popup on Edit asset type page and close it with X button", () => {
            assetTypeDetails.deleteAssetTypeButton.click();
            confirmationModal.wrapper.should('be.visible');
            confirmationModal.xButton.click();
            confirmationModal.wrapper.should('not.exist');
        })
    );

    qase(
        250,
        it("Open delete asset type popup on Edit asset type page and close it with cancel button", () => {
            assetTypeDetails.deleteAssetTypeButton.click();
            confirmationModal.wrapper.should('be.visible');
            confirmationModal.cancelButton.click();
            confirmationModal.wrapper.should('not.exist');
        })
    );

    afterEach(() => {
        cy.reload().wait(3000);
    });

    after(() => {
        assetPoolApi.deleteAllAssetTypes();
    });
});

describe('Asset type - Delete asset type from edit page', () => {
    let assetType: assetTypes = generateRandomAssetType();
    before(() => {
        cy.task("clearAssetList");
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.addAssetType(assetType);
    });

    beforeEach(() => {
        cy.navigateToAssetType();
        cy.preserveCookieOnce('_oauth2_proxy');
        cy.task("getAssetType").then((assetTypeId) => {
            cy.wrap(assetTypeId).as("assetTypeNewId")
            cy.openAssetTypeDetails('@assetTypeNewId');
        });
    });

    qase(
        241,
        it("Verify user can delete Asset type from Edit Asset type page", () => {
            assetTypeDetails.deleteAssetTypeButton.click();
            confirmationModal.wrapper.should('be.visible');
            confirmationModal.confirmationButton.click();
            cy.verifyURLContains(constant.path.assetManagerAssetTypes);
            assetTypesManagment.verifyAssetTypeExist(assetType.assetTypeName, false);
        })
    );

    after(() => {
        assetPoolApi.deleteAllAssetTypes();
    });
});

describe('Asset type - Search', () => {
    const assetType: assetTypes = generateRandomAssetType();
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.addAssetType(assetType);
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
        cy.navigateToAssetType();
    });

    qase(
        230,
        it("Verify search engine is working properly", () => {
            assetTypesManagment.searchAssetType(assetType.assetTypeName);
            cy.wait(1000);
            assetTypesManagment.tableRow.should('have.length', 1);
            assetTypesManagment.verifyAssetTypeExist(assetType.assetTypeName, true);
        })
    );

    after(() => {
        assetPoolApi.deleteAllAssetTypes();
    });
});

describe('Asset type - Menu option - Delete modal', () => {
    let assetType: assetTypes = generateRandomAssetType();
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.addAssetType(assetType);
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
        cy.navigateToAssetType();
        assetTypesManagment.openAssetTypeMenu(assetType.assetTypeName);
        assetTypesManagment.dropdownMenuDeleteButton.click();
    });

    qase(
        245,
        it("Open delete asset type via Menu and verify all elements", () => {
            confirmationModal.wrapper.should('be.visible');
            confirmationModal.title.should('contain', 'Delete asset type?');
            confirmationModal.xButton.should('be.visible');
            confirmationModal.confirmationButton.should('be.visible');
        })
    );

    qase(
        247,
        it("Open delete asset type via Menu and close it with Cancel button", () => {
            confirmationModal.wrapper.should('be.visible');
            confirmationModal.cancelButton.click();
            confirmationModal.wrapper.should('not.exist');
        })
    );

    qase(
        246,
        it("Open delete asset type via Menu and close it with X button", () => {
            confirmationModal.wrapper.should('be.visible');
            confirmationModal.xButton.click();
            confirmationModal.wrapper.should('not.exist');
        })
    );

    afterEach(() => {
        cy.reload();
    })

    after(() => {
        assetPoolApi.deleteAllAssetTypes();
    });
});

describe("Asset type - Create new asset type", () => {
    const assetType: assetTypes = generateRandomAssetType();
    before(() => {
        cy.task("clearAssetList");
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.addAssetType(assetType);
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
        cy.navigateToAssetType();
    });

    qase(
        233,
        it("Verify user can create new Asset Type", () => {
            assetTypesManagment.createNewAssetTypeButton.click();
            assetTypeDetails.addAssetTypeDetails(assetType);
            cy.wait(2000);
            assetTypeDetails.createAssetTypeButton.click().wait(2000);
            assetTypesManagment.searchAssetType(assetType.assetTypeName);
            assetTypesManagment.verifyAssetTypeExist(assetType.assetTypeName, true);
        })
    );

});

describe('Asset type - Edit asset type', () => {
    const assetType: assetTypes = generateRandomAssetType();
    before(() => {
        cy.task("clearAssetList");
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.addAssetType(assetType);
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
        cy.navigateToAssetType();
        cy.wait(5000);
    });

    // TEST SKIPPED BECAUSE OF REPORTED ISSUE (https://gitlab.elunic.software/turck/myturck/-/issues/229)
    qase(
        234,
        xit("Verify user can Edit Asset type details", () => {
            assetTypesManagment.searchAssetType(assetType.assetTypeName);
            assetTypesManagment.openAssetTypeDetails(assetType.assetTypeName);
            const newAssetTypes: assetTypes = generateRandomAssetType();
            assetTypeDetails.addAssetTypeDetails(newAssetTypes);
            cy.wait(2000);
            assetTypeDetails.createAssetTypeButton.click().wait(2000);
            assetTypesManagment.searchAssetType(newAssetTypes.assetTypeName);
            assetTypesManagment.verifyAssetTypeExist(newAssetTypes.assetTypeName, true);
        })
    );
});

describe('Asset type - Dynamic properties - Elements', () => {
    let assetType: assetTypes = generateRandomAssetType();
    let dynamicProperty: dynamicProperty = generateRandomDynamicProperty();
    before(() => {
        cy.task("clearAssetList");
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.addAssetType(assetType);
        cy.addDynamicProperties('@assetTypeId', dynamicProperty);
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
        cy.navigateToAssetType();
        cy.task("getAssetType").then((assetTypeId) => {
            cy.wrap(assetTypeId).as("assetTypeNewId")
            cy.openAssetTypeDetails('@assetTypeNewId');
            cy.wait(3000);
        });
    });

    qase(
        252,
        it("Open Add dynamic property popup and verfy all elements", () => {
            assetTypeDetails.addNewPropertyBtn.click();
            cy.wait(2000);

            dynamicPropertyDetails.wrapper.should('be.visible');
            dynamicPropertyDetails.header.should('contain', 'Add new property');
            dynamicPropertyDetails.nameField.should('be.visible');
            dynamicPropertyDetails.defaultValueField.should('be.visible');
            dynamicPropertyDetails.keyField.should('be.visible');
            dynamicPropertyDetails.typeDropdown.should('be.visible');
            dynamicPropertyDetails.submitButton.should('be.visible').and('be.disabled');
        })
    );

    qase(
        253,
        it("Open Add dynamic property popup and close it with X button", () => {
            assetTypeDetails.addNewPropertyBtn.click();
            cy.wait(2000);
            dynamicPropertyDetails.closeButton.click({ force: true });
            cy.wait(2000);
            dynamicPropertyDetails.wrapper.should('not.exist');
        })
    );
});

describe('Asset type - Dynamic properties - Delete popup', () => {
    let assetType: assetTypes = generateRandomAssetType();
    let dynamicProperty: dynamicProperty = generateRandomDynamicProperty();
    before(() => {
        cy.task("clearAssetList");
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.addAssetType(assetType);
        cy.addDynamicProperties('@assetTypeId', dynamicProperty);
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
        cy.navigateToAssetType();
        cy.task("getAssetType").then((assetTypeId) => {
            cy.wrap(assetTypeId).as("assetTypeNewId")
            cy.openAssetTypeDetails('@assetTypeNewId');
        });
    });

    qase(
        254,
        it("Open Delete dynamic property popup and verify all elements", () => {
            assetTypeDetails.clickOnDeleteDynamicProperty(dynamicProperty.propertyName);
            confirmationModal.wrapper.should('be.visible');
            confirmationModal.title.should('contain', 'Delete property?');
            confirmationModal.xButton.should('be.visible');
            confirmationModal.confirmationButton.should('be.visible');
        })
    );

    qase(
        255,
        it("Open Delete dynamic property popup and close it with X button", () => {
            assetTypeDetails.clickOnDeleteDynamicProperty(dynamicProperty.propertyName);
            confirmationModal.wrapper.should('be.visible');
            confirmationModal.xButton.click();
            confirmationModal.wrapper.should('not.exist');
        })
    );

    qase(
        256,
        it("Open Delete dynamic property popup and close it with cancel button", () => {
            assetTypeDetails.clickOnDeleteDynamicProperty(dynamicProperty.propertyName);
            confirmationModal.wrapper.should('be.visible');
            confirmationModal.cancelButton.click();
            confirmationModal.wrapper.should('not.exist');
        })
    );

    afterEach(() => {
        cy.reload().wait(2000);
    });
});

describe("Asset type - Dynamic properties - Create new dynamic properties", () => {
    let assetType: assetTypes = generateRandomAssetType();
    let dynamicProperty: dynamicProperty = generateRandomDynamicProperty();
    before(() => {
        cy.task("clearAssetList");
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.addAssetType(assetType);
        cy.navigateToAssetType();
        cy.openAssetTypeDetails('@assetTypeId');
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
    });

    qase(
        235,
        it("Verify user can Add new Dynamic properties", () => {
            assetTypeDetails.addNewPropertyBtn.click();
            cy.wait(2000);
            let dynamicProperty: dynamicProperty = generateRandomDynamicProperty();
            dynamicPropertyDetails.wrapper.should('be.visible');
            dynamicPropertyDetails.addDynamicPropertyDetails(dynamicProperty);
            confirmationModal.submitButton.click();
            cy.wait(2000);
            assetTypeDetails.verifyDynamicProperty(dynamicProperty);
        })
    );
});

describe("Asset type - Dynamic properties - Edit dynamic properties", () => {
    let assetType: assetTypes = generateRandomAssetType();
    let dynamicProperty: dynamicProperty = generateRandomDynamicProperty();
    before(() => {
        cy.task("clearAssetList");
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.addAssetType(assetType);
        cy.addDynamicProperties('@assetTypeId', dynamicProperty);
        cy.navigateToAssetType();
        cy.openAssetTypeDetails('@assetTypeId');
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
    });

    qase(
        236,
        it("Verify user can Edit existing Dynamic properties", () => {
            assetTypeDetails.verifyAssetTypeDetails(dynamicProperty);
            assetTypeDetails.clickOnEditDynamicProperty(dynamicProperty.propertyName);
            let newDynamicProperty: dynamicProperty = generateRandomDynamicProperty();
            cy.wait(2000);
            dynamicPropertyDetails.addDynamicPropertyDetails(newDynamicProperty);
            cy.wait(2000);
            confirmationModal.confirmationButton.click();
            cy.wait(2000);
            assetTypeDetails.verifyDynamicProperty(newDynamicProperty);
        })
    );
});

after(() => {
    assetPoolApi.deleteAllAssetTypes();
});

