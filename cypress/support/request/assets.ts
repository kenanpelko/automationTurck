import constat from '../../support/constant/asset-managment/index';


declare global {
    namespace Cypress {
        interface Chainable {
            addAsset(asset: any): void;
            addAssetType(asset: any): void;
            addDynamicProperties(assetId: any, dynamicProperty: any): void;
            assetTransform(asset: any): void;
        }
    }
}

Cypress.Commands.add('addAsset', (asset: any) => {
    cy.request({
        method: "POST",
        url: `${Cypress.env('URL')}${constat.endpoints.assets}`,
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: {
            assetType: "e34fd0f2-6667-4f95-b0ab-d139f029a1ac",
            aliases: [],
            documents: [],
            imageId: null,
            description: "test",
            name: {
                en_EN: asset.name,
                de_DE: asset.name
            }
        }
    }).then((data: any) => {
        expect(data.status).to.equal(201);
        let value = data.body.data.id;
        cy.wrap(value).as('assetId');
        cy.reload().wait(2000);
        cy.task("setAssetList", value);
    });
});

Cypress.Commands.add('addAssetType', (asset: any) => {
    cy.request({
        failOnStatusCode: false,
        method: "POST",
        url: `${Cypress.env('URL')}${constat.endpoints.assetTypes}`,
        body: {
            name: {
                en_EN: asset.assetTypeName,
                de_DE: asset.assetTypeName
            },
            equipmentType: "NONE",
            extendsType: null,
            description: asset.assetTypeName
        },
    }).then((data: any) => {
        expect(data.status).to.equal(201);
        let value = data.body.data.id;
        cy.wrap(value).as('assetTypeId');
        cy.task("setAssetType",value);
        cy.task("setAssetTypeList", value);
    });
});

Cypress.Commands.add('addDynamicProperties', (assetId: any, dynamicProperty: any) => {
    cy.get(assetId).then((id: any) => {
        cy.request({
            method: "POST",
            url: `${Cypress.env('URL')}${constat.endpoints.property}${id}`,
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: {
                display: true,
                isHidden: false,
                isRequired: false,
                key: "asdas",
                name: { en_EN: dynamicProperty.propertyName },
                position: 0,
                type: "STRING",
                value: "121"
            }
        }).then((data: any) => {
            expect(data.status).to.equal(201);
            let value = data.body.data.id;
        });
    });
});

Cypress.Commands.add('assetTransform', (asset: any) => { 
    cy.request({
        method: "POST",
        url: `${Cypress.env('URL')}${constat.endpoints.transform}`,
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: {
            actions: [
                asset
            ]
        }
    }).then((data: any) => {
        // expect(data.status).to.equal(201);
        // let value = data.body.data.id;
        // cy.wrap(value).as('assetId');
        cy.reload().wait(2000);
  //      cy.task("setAssetList", value);
    });
})