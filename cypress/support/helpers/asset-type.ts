import { faker } from "@faker-js/faker";
import { merge } from "merge-anything";
import { assetTypes } from "../types/asset-types";

const localization = require(`../../fixtures/i18n/asset-managment/${Cypress.env('LANGUAGE')}`); 

export default function generateRandomAssetType(overrides = undefined) {
    const newAssetTypes: assetTypes = {
        assetTypeName: `AssetType - ${faker.datatype.number().toString()}`,
        parentAsset: localization.assetTypes.createNewAssetType.assetTypes,
        isa95Type: localization.assetTypes.createNewAssetType.isa95Types.site,
        description: faker.lorem.paragraph(),

    };
    if (overrides != undefined) {
        return merge(newAssetTypes, overrides);
    } else return newAssetTypes;
}
