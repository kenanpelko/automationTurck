declare namespace Cypress {
  interface Chainable {
    navigateToMaintenanceManager(): void;
    navigateToDocumentSection(): void;
    navigateToAssetManager(): void;
    navigateToAssetType(): void;
    navigateToAllocatedAsset(): void;
    navigateToAssetPool(): void;
    navigateToRoles(): void;
    navigateToUsers(): void;
    navigateToMachineVariables(): void;
    navigateToHubSettings(): void;
    navigateToHomePage();
    openAssetDetails(id: string);
    openAssetTypeDetails(id: string);
  }
}

Cypress.Commands.add('navigateToMaintenanceManager', () => {
  cy.get('.services app-tile-card:nth-child(1)').click();
});


Cypress.Commands.add("navigateToAssetManager", () => {
  cy.visit("/asset-manager/#/asset-pool");
});

Cypress.Commands.add("navigateToAssetType", () => {
  cy.visit("/asset-manager/#/asset-types");
});

Cypress.Commands.add("navigateToAllocatedAsset", () => {
  cy.visit('/asset-manager/#/allocated-assets');
});

Cypress.Commands.add("navigateToAssetPool", () => {
  cy.visit('/asset-manager/#/asset-pool');
});

Cypress.Commands.add("navigateToRoles", () => {
  cy.visit("/user/#/roles");
});

Cypress.Commands.add("navigateToUsers", () => {
  cy.visit("/user/#/users");
});

Cypress.Commands.add("navigateToMachineVariables", () => {
  cy.visit('/asset-manager/#/machine-variables');
});

Cypress.Commands.add('navigateToHubSettings', () => {
  cy.visit('/hub/#/settings');
  cy.verifyURLContains('/hub/#/settings');
});

Cypress.Commands.add('navigateToHomePage', () => {
  cy.visit('/hub/#/home');
  cy.verifyURLContains('/hub/#/home');
});

Cypress.Commands.add("openAssetDetails", (id: any) => {
  cy.get(id).then((id: any) => {
    cy.visit('/asset-manager/#/assets' + "/" + id);
    cy.wait(2000);
  });
});

Cypress.Commands.add("openAssetTypeDetails", (id: any) => {
  cy.get(id).then((id: any) => {
    cy.visit('/asset-manager/#/asset-types' + "/" + id);
    cy.wait(2000);
  });
});