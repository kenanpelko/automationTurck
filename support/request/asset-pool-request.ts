import { waitForDebugger } from "inspector";
import constat from "../constant/asset-managment/index";
import { Asset } from "../types/asset"
const baseUrl = Cypress.config().baseUrl;
const defaultAssetId = 'e34fd0f2-6667-4f95-b0ab-d139f029a1ac';

export default class AssetPoolAPI {
    deleteAsset(id) {
        cy.task("getCookie").then((cookie) => {
            cy.request({
                failOnStatusCode: false,
                method: "DELETE",
                url: `${baseUrl}${constat.endpoints.assets}/${id}`,
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    cookie: cookie,
                },
            }).then((res) => { });
        });
    }

    addAsset(asset: Asset) {
        cy.task("getCookie").then((cookie) => {
            cy.request({
                failOnStatusCode: false,
                method: "POST",
                url: `${baseUrl}${constat.endpoints.assets}`,
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    cookie: cookie,
                },
                body: {
                    imageId: null,
                    aliases: [],
                    documents: [],
                    description: "test",
                    assetType: defaultAssetId,
                    name: {
                        de_DE: asset.name,
                        en_EN: asset.name
                    },
                }
                }).then((data: any) => {
                expect(data.status).to.equal(201);
                this.allocateAsset(data.body.data);
                let value = data.body.data.id;
                cy.wrap(value).as('assetId');
                cy.task('setAssetList', value);
                cy.task('setAsset',value);        
            });
        });
    }

    allocateAsset(assetData) {
        let body = {
            actions: [
                {
                    id: assetData.id,
                    type: "childOf"
                }
            ]
        }

        if (assetData.childOf != undefined) {
             //@ts-ignore
            body.actions[0].childOf = assetData.childOf;
        }

        cy.task("getCookie").then((cookie) => {
            cy.request({
                failOnStatusCode: true,
                method: "POST",
                url: `${baseUrl}${constat.endpoints.transform}`,
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    cookie: cookie,
                },
                body
            }).then((data: any) => {
                expect(data.status).to.equal(201);
            });
        });
    }

    deleteAllAllocatedAssets() {
        cy.task("getCookie").then((cookie) => {
            cy.request({
                failOnStatusCode: false,
                method: "GET",
                url: `${baseUrl}${constat.endpoints.tree}`,
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    cookie: cookie,
                },
            }).then((tree: any) => {
                let data = tree.body.data;
                data.forEach((ele) => {
                    this.recursiveDeleteAllocatedAssetChildren([ele]);
                });
            });
        });

    }

    recursiveDeleteAllocatedAssetChildren(data) {
        data.forEach((ele) => {
            if (ele.children.length > 0) {
                this.recursiveDeleteAllocatedAssetChildren(data[0].children);
            }
        });
        this.deleteAsset(data[0].id);
        return;
    }

    deleteAllUnallocatedAssets() {
        cy.task("getCookie").then((cookie) => {
            cy.request({
                failOnStatusCode: false,
                method: "GET",
                url: `${baseUrl}${constat.endpoints.unassigned}`,
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    cookie: cookie,
                },
            }).then((res: any) => {

                let data = res.body.data;
                data.forEach((ele) => {
                    this.deleteAsset(ele.id);
                });
            });
        });
    }

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
            });
        });
    }

    deleteAllAssetTypes() {
        cy.task("getCookie").then((cookie) => {
            cy.request({
                failOnStatusCode: false,
                method: "GET",
                url: `${baseUrl}${constat.endpoints.assetTypes}`,
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    cookie: cookie,
                },
            }).then((res: any) => {
                let data = res.body.data;
                data.forEach((ele) => {
                    if (ele.isBuiltIn == false) {
                        this.deleteAssetType(ele.id);
                    }
                });
            });
        });
    }

    assetTransform (asset: any) { 
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
    //     }).then((data: any) => {
    //          expect(data.status).to.equal(201);
    //          let value = data.body.data.id;
    //          cy.wrap(value).as('assetId');
    //          cy.reload().wait(2000);
    //          cy.task("setAssetList", value);
           });
       }
       

    deleteAllMachineVariables() {
        cy.task("getCookie").then((cookie) => {
            cy.request({
                failOnStatusCode: false,
                method: "GET",
                url: `${baseUrl}${constat.endpoints.machineVariable}`,
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    cookie: cookie,
                },
            }).then((res: any) => {
                let data = res.body.data;
                data.forEach((ele) => {
                    if (ele.isBuiltIn == false) {
                        this.deleteMachineVariables(ele.id);
                    }
                });
            });
        });
    }  

    deleteMachineVariables(id) {
        cy.task("getCookie").then((cookie) => {
            cy.request({
                failOnStatusCode: false,
                method: "DELETE",
                url: `${baseUrl}${constat.endpoints.machineVariable}/${id}`,
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    cookie: cookie,
                },
            });
        });
    }

}





