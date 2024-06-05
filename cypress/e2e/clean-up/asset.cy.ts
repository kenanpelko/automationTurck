
import AssetPoolAPI from '../../support/request/asset-pool-request';
const assetPool = new AssetPoolAPI();

describe('Maintenance clean up', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.navigateToMaintenanceManager();
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
    });

    it('Delete all types', () => {
        assetPool.deleteAllAssetTypes()
    });

    it('Delete all assets', () => {
        assetPool.deleteAllUnallocatedAssets();
        assetPool.deleteAllAllocatedAssets();
    });
});