import { faker } from "@faker-js/faker";
import { merge } from "merge-anything";
import { Alias } from "../types/alias";

const localization = require(`../../fixtures/i18n/asset-managment/${Cypress.env('LANGUAGE')}`); 

export default function generateRandomAlias(overrides = undefined) {
    const newAlias: Alias = {
        name: `Alias - ${faker.datatype.number().toString()}`,
        description: faker.lorem.paragraph(),
        type: localization.assetPool.createNewAsset.aliasTypes.general,
    };

    if (overrides != undefined) {
        return merge(newAlias, overrides);
    } else return newAlias;
}
