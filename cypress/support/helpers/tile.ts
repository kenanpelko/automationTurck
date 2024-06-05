import { faker } from "@faker-js/faker";
import { merge } from "merge-anything";
import { Tile } from "../types/tile";

export default function generateRandomTile(overrides = undefined) {
    const newTile: Tile = {
      tileColor: `#${faker.datatype.number({ min: 100000, max: 999999 })}`,
      tileTextColor: `#${faker.datatype.number({ min: 100000, max: 999999 })}`,
      tileName: `automated_tile - ${faker.datatype.number().toString()}`,
      desc: faker.datatype.number().toString(),
      appUrl: `${Cypress.env('URL')}/${faker.datatype.number().toString()}`,
      integratedView: false,
      show: '1',
    };
    if (overrides != undefined) {
      return merge(newTile, overrides);
    } else return newTile;
  }
  