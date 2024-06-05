import constat from "../constant/asset-managment/index";
import { assetTypes } from "../types/asset-types";
const baseUrl = Cypress.config().baseUrl;

export default class AssetTypeAPI {
    deleteAssetType(id) {
        cy.task("getCookie").then((cookie) => {
            cy.request({
                failOnStatusCode: false,
                method: "DELETE",
                url: `${baseUrl}${constat.endpoints.assetTypes}/${id}`,
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    cookie: cookie,
                },
            }).then((res) => { });
        });
    }

    addAssetType(assetType: assetTypes) {
        cy.task("getCookie").then((cookie) => {
            cy.request({
                failOnStatusCode: false,
                method: "POST",
                url: `${baseUrl}${constat.endpoints.assetTypes}`,
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    cookie: cookie,
                },
                body: {
                    assetTypeName: [],
                    parentAsset: [],
                    isa95Type: [],
                    description: "test"
                },
            }).then((data: any) => {
                expect(data.status).to.equal(201);
                let value = data.body.data.id;
                cy.task("setAssetTypeList", value);
            });
        });
    }
}
