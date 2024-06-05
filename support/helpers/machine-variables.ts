import { faker } from "@faker-js/faker";
import { merge } from "merge-anything";
import { machVariables } from "../types/machine-variables";
import generateRandomAssetType from "./asset-type";

const localization = require(`../../fixtures/i18n/asset-managment/${Cypress.env('LANGUAGE')}`); 

export default function generateRandomMachineVariable (overrides = undefined) {

    let assetType = generateRandomAssetType();

    const newMachineVariables: machVariables = {
        name: `Variable - ${faker.datatype.number().toString()}`,
        parameterID: localization.machineVariables.addNewMachineVariable.parameters.onOff,
        unit: faker.lorem.word(), 
        assetTypeID: assetType
    };
    if (overrides != undefined) {
        return merge(newMachineVariables, overrides);
    } else return newMachineVariables;
}