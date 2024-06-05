import { faker } from "@faker-js/faker";
import { merge } from "merge-anything";
import { Asset } from "../types/asset";
import generateRandomAlias from "./alias";
import generateRandomAssetType from "./asset-type";

export default function generateRandomAsset(overrides = undefined) {

    let assetType = generateRandomAssetType();
    const newAsset: Asset = {
        name: `Asset - ${faker.datatype.number().toString()}`,
        description: faker.lorem.paragraph(),
        assetType: assetType,
        alias: [generateRandomAlias()], //Generating one random alias
    };
    if (overrides != undefined) {
        return merge(newAsset, overrides);
    } else return newAsset;
}
