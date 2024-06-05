import { faker } from "@faker-js/faker";
import { merge } from "merge-anything";
import { dynamicProperty } from "../types/dynamic-properties";


export default function generateRandomDynamicProperty(overrides = undefined) {
    const newDynamicProperty: dynamicProperty = {
        propertyName: `DynamicProperty - ${faker.datatype.number().toString()}`,
        defaultValue: faker.lorem.word(),
        key: faker.lorem.word(),
    };
    if (overrides != undefined) {
        return merge(newDynamicProperty, overrides);
    } else return newDynamicProperty;
}
