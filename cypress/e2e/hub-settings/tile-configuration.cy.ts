import 'cypress-v10-preserve-cookie'
import { qase } from 'cypress-qase-reporter/dist/mocha'
import generateRandomTile from '../../support/helpers/tile'
import TileConfiguration from '../../page-object/hub-settings/tile-configuration.po'
import TileAPI from '../../support/request/tile-configuration'
import generalSettingsPath from '../../support/constant/hub-settings/index'

const localization = require(`../../fixtures/i18n/hub-settings/${Cypress.env('LANGUAGE')}`); 
const tileConfiguration = new TileConfiguration();
const tileAPI = new TileAPI();

const defaultTileId = -1;
const image1Url = './../fixtures/images/cat.jpg'

describe('Working with tile configuration inside of the hub settings', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToHubSettings();
    tileConfiguration.navigateToTileConfiguration();
  });

  qase(
    404,
    it('Verify that user is able to save created tile by click on "Save changes" button', () => {
      let tile = generateRandomTile();

      tileConfiguration.addTileButton.click();
      tileConfiguration.updateTileDetails(tile);
      tileConfiguration.saveChanges();
      cy.reload();
      tileConfiguration.navigateToTileConfiguration();
      tileConfiguration.verifyTileDetails(tile);
    }),
  );

  qase(
    406,
    it('Verify that user is able to delete created tile by click on "Delete" button', () => {
      let tile = generateRandomTile();
      tileAPI.addTile(tile);

      cy.reload();
      tileConfiguration.navigateToTileConfiguration();
      tileConfiguration.verifyTileDetails(tile);
      tileConfiguration.deleteTile();
      tileConfiguration.tileTitle.contains(tile.tileName).should('not.exist');
    }),
  );

  qase(
    413,
    it("Verify that default 'Tile color' of new tile is set on white '#ffffff'", () => {
      tileConfiguration.addTileButton.click();
      tileConfiguration.tileColorInput.eq(-1).should('have.value', '#ffffff');
    }),
  );

  qase(
    414,
    it("Verify that default 'Tile text color' of new tile is set on black '#000000'", () => {
      tileConfiguration.addTileButton.click();
      tileConfiguration.tileTextColor.eq(-1).should('have.value', '#000000');
    }),
  );

  qase(
    405,
    it("Verify that user is able to leave 'Hub settings' page by click on 'Cancel' button", () => {
      cy.verifyURLContains(generalSettingsPath.path.hubSettings);
      tileConfiguration.cancelButton.click();
      cy.url().should('not.include', generalSettingsPath.path.hubSettings);
      cy.verifyURLContains(generalSettingsPath.path.hubHome);
    }),
  );
});

describe('Tile validation', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToHubSettings();
    tileConfiguration.navigateToTileConfiguration();
  });

  qase(
    411,
    it("Verify that empty 'Tile name' field leads to the validation", () => {
      tileConfiguration.tileNameErrorField.should('not.exist');
      tileConfiguration.tileNameInput.eq(defaultTileId).clear();
      tileConfiguration.tileNameErrorField.should('exist');
    }),
  );

  qase(
    412,
    it("Verify that empty 'App url' field leads to the validation", () => {
      tileConfiguration.appUrlErrorField.should('not.exist');
      tileConfiguration.appUrlInput.eq(defaultTileId).clear();
      tileConfiguration.appUrlErrorField.should('exist');
    }),
  );

  qase(
    421,
    it("Verify that empty 'Tile color' field leads to the validation", () => {
      tileConfiguration.tileColorErrorField.should('not.exist');
      tileConfiguration.tileColorInput.eq(defaultTileId).clear();
      tileConfiguration.tileColorErrorField.should('exist');
    }),
  );

  qase(
    422,
    it("Verify that empty 'Tile text color' field leads to the validation", () => {
      tileConfiguration.tileColorErrorField.should('not.exist');
      tileConfiguration.tileColorInput.eq(defaultTileId).clear();
      tileConfiguration.tileColorErrorField.should('exist');
    }),
  );
});

describe('Editing the tile settings', () => {
  let tile = generateRandomTile();
  let tileIndex = -1;

  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    tileAPI.addTile(tile);
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToHubSettings();
    tileConfiguration.navigateToTileConfiguration();
  });

  qase(
    419,
    it('Verify that "Description" text visible on tile under tile name', () => {
      tileConfiguration.tileDescription
        .eq(tileIndex)
        .should('contain.text', tile.desc);
    }),
  );

  qase(
    410,
    it("Verify that entered 'Tile name' displays on tile icon", () => {
      tileConfiguration.tileTitle
        .eq(tileIndex)
        .should('contain.text', tile.tileName);
    }),
  );

  qase(
    420,
    it('Verify that user is able to hide tile by click "Eye" icon', () => {
      tileConfiguration.cancelButton.click();
      tileConfiguration.verifyHomeCardExists(tile.tileName);
      tileConfiguration.verifyHomeCardUrlIsCorrect(tile.tileName, tile.appUrl);
    }),
  );

  qase(
    429,
    it('Verify that created tile appears in "Choose an app:" menu', () => {
      tileConfiguration.visibilityControlImage.eq(tileIndex).click();
      tileConfiguration.visibilityControlImage
        .eq(tileIndex)
        .should('contain.text', 'visibility_off');
      tileConfiguration.saveChanges();

      tileConfiguration.cancelButton.click();
      tileConfiguration.verifyHomeCardDoesntExists(tile.tileName);
    }),
  );

  qase(
    403,
    it('Verify that user is able to add new tile', () => {
      tileConfiguration.getAllTiles();
      cy.get('@tileList').then((originalTiles: any) => {
        cy.wait(2500);
        tileConfiguration.addTileButton.click();
        tileConfiguration.getAllTiles();

        //Veryfing that new tile is added
        cy.get('@tileList').then((newTiles: any) => {
          expect(originalTiles.length + 1).to.equal(newTiles.length);
        });
      });
    }),
  );

  qase(
    423,
    it('Verify that "Integrated view" can be selected by click on checkbox', () => {
      let newTile = { integratedView: true };

      tileConfiguration.updateTileDetails(newTile);
      tileConfiguration.saveChanges();
      cy.reload();
      tileConfiguration.navigateToTileConfiguration();
      tileConfiguration.verifyTileDetails(newTile);
    }),
  );
});

describe('Working with tile ordering', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToHubSettings();
    tileConfiguration.navigateToTileConfiguration();
  });

  qase(
    408,
    it("Verify that first tile doesn't have 'Up arrow' button", () => {
      tileConfiguration.arrowUpImage.eq(0).should('not.be.visible');
    }),
  );

  qase(
    409,
    it("Verify that last tile doesn't have 'Down arrow' button", () => {
      tileConfiguration.arrowDownImage.eq(-1).should('not.be.visible');
    }),
  );

  qase(
    407,
    it("Verify that user is able to move tile by click 'up arrow' button", () => {
      tileConfiguration.getAllTiles();
      cy.get('@tileList').then((originalTiles: any) => {
        //Swapping array elements - new ordering is required after clicking on the arrow
        const tmp: string = originalTiles[0];
        originalTiles[0] = originalTiles[1];
        originalTiles[1] = tmp;

        cy.wait(2500);
        tileConfiguration.arrowUpImage.eq(1).click();
        tileConfiguration.saveChanges();
        cy.reload();
        tileConfiguration.navigateToTileConfiguration();
        tileConfiguration.getAllTiles();

        //Veryfing that tiles are re-ordered
        cy.get('@tileList').then((newTiles: any) => {
          expect(originalTiles.length).to.equal(newTiles.length);
          originalTiles.forEach((ele, index) => {
            expect(ele).to.equal(newTiles[index]);
          });
        });
      });
    }),
  );

  qase(
    430,
    it("Verify that user is able to move tile by click 'down arrow' button", () => {
      tileConfiguration.getAllTiles();
      cy.get('@tileList').then((originalTiles: any) => {
        //Swapping array elements - new ordering is required after clicking on the arrow
        const tmp: string = originalTiles[0];
        originalTiles[0] = originalTiles[1];
        originalTiles[1] = tmp;

        cy.wait(2500);
        tileConfiguration.arrowDownImage.eq(0).click();
        tileConfiguration.saveChanges();
        cy.reload();
        tileConfiguration.navigateToTileConfiguration();
        tileConfiguration.getAllTiles();

        //Veryfing that tiles are re-ordered
        cy.get('@tileList').then((newTiles: any) => {
          expect(originalTiles.length).to.equal(newTiles.length);
          originalTiles.forEach((ele, index) => {
            expect(ele).to.equal(newTiles[index]);
          });
        });
      });
    }),
  );
});

describe('File management', () => {
  let tile = generateRandomTile();
  let tileIndex = -1;

  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    tileAPI.addTile(tile);
  });

  beforeEach(() => {
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToHubSettings();
    tileConfiguration.navigateToTileConfiguration();
  });

  qase(
    417,
    it('Verify that user is able to upload tile picture by click on "Upload file" button', () => {
      tileConfiguration.uploadImage(image1Url);
      tileConfiguration.saveChanges();
      tileConfiguration.tileUploadFileButton
        .eq(tileIndex)
        .should('contain.text', localization.buttons.deleteFile);
      cy.reload();

      cy.get('@imageUrl').then(imageUrl => {
        cy.navigateToHomePage();
        tileConfiguration.verifyImageExistsOnHomeCard(imageUrl);
        cy.navigateToHubSettings();
        tileConfiguration.navigateToTileConfiguration();
        tileConfiguration.verifyImageExists(imageUrl);
      });
    }),
  );

  qase(
    418,
    it('Verify that user is able to delete tile picture by click on "Delete file" button', () => {
      tileConfiguration.uploadImage(image1Url);
      tileConfiguration.saveChanges();

      tileConfiguration.tileUploadFileButton.eq(tileIndex).click(); //Same Id exists for both delete and upload buttons
      tileConfiguration.saveChanges();

      cy.reload();
      tileConfiguration.navigateToTileConfiguration();
      tileConfiguration.verifyImageDoesntExist();
      tileConfiguration.tileUploadFileButton
        .eq(tileIndex)
        .should('contain.text', localization.buttons.uploadFile);
    }),
  );
});

after(() => {
  tileAPI.getTileList();
  cy.get('@tileList').then((list: any) => {
    tileAPI.deleteTileList(list);
  });
});

describe('Element verification', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToHubSettings();
    tileConfiguration.navigateToTileConfiguration();
  });

  beforeEach(() => {
    
  });

  qase(
    431,
    it.only('Verify all elements on Tile page are loaded', () => {
      tileConfiguration.pageTitle.should('contain', localization.tileConfiguration.header.settingsTitle)
      tileConfiguration.generalSettingsTitle.should('contain', localization.tileConfiguration.header.generalSettings)
      tileConfiguration.tileConfigurationTitle.should('contain', localization.tileConfiguration.header.tileConfiguration)
      tileConfiguration.cancelButton.should('contain', localization.tileConfiguration.header.cancel)
      tileConfiguration.addTileButton.should('contain', localization.tileConfiguration.header.addTile)
      tileConfiguration.saveChangesButton.should('contain', localization.tileConfiguration.header.saveChanges)

      tileConfiguration.tileNameTitle.should('contain', localization.tileConfiguration.elements.tileName)
      tileConfiguration.appUrlTitle.should('contain', localization.tileConfiguration.elements.appURL)
      tileConfiguration.tileColorTitle.should('contain', localization.tileConfiguration.elements.tileColor)
      tileConfiguration.tileDescriptionTitle.should('contain', localization.tileConfiguration.elements.description)
      tileConfiguration.iconTitle.should('contain', localization.tileConfiguration.elements.icon)
      tileConfiguration.tileTextColorTitle.should('contain', localization.tileConfiguration.elements.tileTextColor)
      tileConfiguration.integratedViewTitle.should('contain', localization.tileConfiguration.elements.integratedView)
    }),
  );
});