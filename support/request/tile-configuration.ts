import tilePath from '../../support/constant/tile-configuration/index'
import { Tile } from '../types/tile'

const baseUrl = Cypress.config().baseUrl;

export default class TileAPI {
  addTile(tile: Tile) {
    cy.task('getCookie').then(cookie => {
      cy.request({
        failOnStatusCode: false,
        method: 'POST',
        url: `${baseUrl}${tilePath.endpoint.tileConfiguration}`,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          cookie: cookie,
        },
        body: tile,
      }).then((data: any) => {
        expect(data.status).to.equal(201);
      });
    });
  }

  getTileList() {
    cy.task('getCookie').then(cookie => {
      cy.request({
        failOnStatusCode: false,
        method: 'GET',
        url: `${baseUrl}${tilePath.endpoint.tileConfiguration}`,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          cookie: cookie,
        },
      }).then((data: any) => {
        expect(data.status).to.equal(200);
        cy.wrap(data.body.data).as('tileList');
      });
    });
  }

  deleteTileList(tileList, query = 'automated_tile') {
    let filteredTileList = tileList.filter(tile => {
      return tile.tileName.search(query) != -1;
    });

    filteredTileList.forEach(tile => {
      this.deleteTile(tile.id);
    });
  }

  deleteTile(id: string) {
    cy.task('getCookie').then(cookie => {
      cy.request({
        failOnStatusCode: false,
        method: 'DELETE',
        url: `${baseUrl}${tilePath.endpoint.tileConfiguration}/${id}`,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          cookie: cookie,
        },
      }).then((data: any) => {
        expect(data.status).to.equal(200);
      });
    });
  }
}