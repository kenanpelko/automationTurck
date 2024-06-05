import { Tile } from "../../support/types/tile";
import 'cypress-file-upload'

export default class TileConfiguration {
    get pageTitle() {
      return cy.get('.card-page-header .card-page-title')
    }
    get generalSettingsTitle() {
      return cy.get('.card-page-header .settings-config .tabs > :nth-child(1)')
    }
    get tileConfigurationTitle() {
      return cy.get('.card-page-header .settings-config .tabs > :nth-child(2)')
    }
    get tileNameTitle() {
      return cy.get('.tile-list :nth-child(1) .tile-form :nth-child(1) > :nth-child(1) .input-component .label')
    }
    get tileDescriptionTitle() {
      return cy.get('.tile-list :nth-child(1) .tile-form :nth-child(1) > :nth-child(2) .input-component .label')
    }
    get integratedViewTitle() {
      return cy.get('.tile-list :nth-child(1) .tile-form :nth-child(1) > :nth-child(3) .container')
    }
    get appUrlTitle() {
      return cy.get('.tile-list :nth-child(1) .tile-form :nth-child(2) > :nth-child(1) .input-component .label')
    }
    get iconTitle() {
      return cy.get('.tile-list :nth-child(1) .tile-form :nth-child(2) > :nth-child(2) .input-component .label')
    }
    get tileColorTitle() {
      return cy.get('.tile-list :nth-child(1) .tile-form :nth-child(3) > :nth-child(1) .input-component .label')
    }
    get tileTextColorTitle() {
      return cy.get('.tile-list :nth-child(1) .tile-form :nth-child(3) > :nth-child(2) .input-component .label')
    }
    get tile() {
      return cy.get('[class*="tile-row"]');
    }
    get tileConfigurationMenuItem() {
      return cy.get('[class*="tabs"] button.ms-0');
    }
    get cancelButton() {
      return cy.get('[href="#/home"]');
    }
    get addTileButton() {
      return cy.get('.card-page-header .settings-config app-button:nth-child(2) button');
    }
    get saveChangesButton() {
      return cy.get('.card-page-header .settings-config app-button:nth-child(3) button');
    }
    get deleteTileImage() {
      return cy.get('[src="assets/images/delete.svg"]');
    }
    get deleteTilePopupButton() {
      return cy.get('.btn-danger');
    }
    get arrowUpImage() {
      return cy.get(
        '[class*="positioning"] [src="assets/images/arrow-down.svg"]:first-child',
      );
    }
    get arrowDownImage() {
      return cy.get(
        '[class*="positioning"] [src="assets/images/arrow-down.svg"]:last-child',
      );
    }
    get visibilityControlImage() {
      return cy.get('[class*="visibility-control"]');
    }
    get tileImage() {
      return cy.get('[class="card service rounded-0 preview"] img');
    }
    get tileTitle() {
      return cy.get('[class="card service rounded-0 preview"] b');
    }
    get tileDescription() {
      return cy.get('[class*="tile-row"] > [class*="d-flex"]:first-child');
    }
    get tileNameInput() {
      return cy.get(
        '[class*="custom-input-group"]:first-child [class="input-wrap"]:nth-child(1) [type="text"]',
      );
    }
    get tileNameErrorField() {
      return cy.get(
        '[class*="custom-input-group"]:first-child [class="input-wrap"]:nth-child(1) [class*="error-message"]',
      );
    }
    get tileDescriptionInput() {
      return cy.get(
        '[class*="custom-input-group"]:first-child [class="input-wrap"]:nth-child(2) [type="text"]',
      );
    }
    get tileIntegratedViewCheckbox() {
      return cy.get(
        '[class*="custom-input-group"]:first-child [class="input-wrap"]:nth-child(3) [type="checkbox"]',
      );
    }
    get tileUploadFileButton() {
      return cy.get(
        '[class*="custom-input-group"]:nth-child(2) [class="input-wrap"]:nth-child(2) button',
      );
    }
    get tileUploadFileInput() {
      return cy.get(
        '[class*="custom-input-group"]:nth-child(2) [class="input-wrap"]:nth-child(2) input[type="file"]',
      );
    }
  
    get tileImageUploadInput() {
      return cy.get(
        '[class*="custom-input-group"]:nth-child(2) [class="input-wrap"]:nth-child(1) input[type="file"]',
      );
    }
  
    get appUrlInput() {
      return cy.get('[maxlength="4096"]'); //class="color-circle"
    }
    get appUrlErrorField() {
      return cy.get(
        '[class*="custom-input-group"]:nth-child(2) [class="input-wrap"]:nth-child(1) [class*="error-message"]',
      );
    }
    get deleteFileButton() {
      return cy.get('[class="btn outline"]');
    }
    get tileColorInput() {
      return cy.get(
        '[class*="custom-input-group"]:last-child [class="input-wrap"]:nth-child(1) [class*="inside-input"]',
      );
    }
    get tileColorErrorField() {
      return cy.get(
        '[class*="custom-input-group"]:last-child [class="input-wrap"]:nth-child(1) [class*="error-message"]',
      );
    }
    get tileTextColor() {
      return cy.get(
        '[class*="custom-input-group"]:last-child [class="input-wrap"]:nth-child(2) [class*="inside-input"]',
      );
    }
    get tileTextColorErrorField() {
      return cy.get(
        '[class*="custom-input-group"]:last-child [class="input-wrap"]:nth-child(2) [class*="error-message"]',
      );
    }
    get toastContainer() {
      return cy.get('[id="toast-container"]');
    }
    get homeCard() {
      return cy.get('app-tile-card');
    }
    get homeCardImage() {
      return cy.get('app-tile-card img');
    }
  
    navigateToTileConfiguration() {
      this.tileConfigurationMenuItem.click();
      this.tileImage.should('be.visible');
      cy.wait(1500);
    }
  
    startAddingNewTile() {
      //Making sure that number of tiles has increased
      this.getNumberOfTiles();
      cy.get('@numberOfTiles').then((numberOfTilesBeforeClick: any) => {
        this.addTileButton.click();
        this.getNumberOfTiles();
        cy.get('@numberOfTiles').then((numberOfTilesAfterClick: any) => {
          expect(numberOfTilesAfterClick).to.equal(numberOfTilesBeforeClick + 1);
        });
      });
    }
  
    cancelChanges() {
      this.cancelButton.click();
      cy.url().should('include', '/hub/#/home'); //TODO: Move this to constats
    }
  
    saveChanges() {
      this.saveChangesButton.click();
      cy.verifyToasterMessage('Changes successfully saved'); //TODO: Move message to constat
      cy.wait(2000);
    }
  
    deleteTile(index = -1) {
      this.deleteTileImage.eq(index).click();
    }
  
    moveTileUp(index = -1) {
      this.arrowUpImage.eq(index).click();
    }
  
    moveTileDown(index = -1) {
      this.arrowDownImage.eq(index).click();
    }
  
    changeTileVisibility(index = -1) {
      this.visibilityControlImage.eq(index).click();
    }
  
    uploadTileIcon() {
      this.tileUploadFileInput;
    }
  
    deleteTileIcon() {}
  
    updateTileDetails(tile: Tile, tileIndex = -1) {
      if (tile.tileName !== undefined) {
        this.tileNameInput
          .eq(tileIndex)
          .scrollIntoView()
          .clear()
          .type(tile.tileName);
      }
      if (tile.desc !== undefined) {
        this.tileDescriptionInput.eq(tileIndex).clear().type(tile.desc);
      }
      if (tile.appUrl !== undefined) {
        this.appUrlInput.eq(tileIndex).clear().type(tile.appUrl);
      }
      // if(tile.tileColor !== undefined){
      //   this.tileColorInput.eq(tileIndex).type("{selectall}{backspace}");
      //   cy.wait(1000);
      //   this.tileColorInput.eq(tileIndex).type(tile.tileColor,{force:true});
      // }
      // if(tile.tileTextColor !== undefined){
      //   this.tileColorInput.eq(tileIndex).type("{selectall}{backspace}");
      //   this.tileTextColor.eq(tileIndex).type(tile.tileTextColor);
      // }
      if (tile.integratedView !== undefined) {
        if (tile.integratedView === true) {
          this.tileIntegratedViewCheckbox.eq(tileIndex).check({ force: true });
        } else {
          this.tileIntegratedViewCheckbox.eq(tileIndex).uncheck({ force: true });
        }
      }
    }
    verifyTileDetails(tile: Tile, tileIndex = -1) {
      if (tile.tileName !== undefined) {
        this.tileNameInput.eq(tileIndex).should('have.value', tile.tileName);
      }
      if (tile.desc !== undefined) {
        this.tileDescriptionInput.eq(tileIndex).should('have.value', tile.desc);
      }
      if (tile.appUrl !== undefined) {
        this.appUrlInput.eq(tileIndex).should('have.value', tile.appUrl);
      }
      // if(tile.tileColor !== undefined){
      //   this.tileColorInput.eq(tileIndex).should("have.value",tile.tileColor);
      // }
      // if(tile.tileTextColor !== undefined){
      //   this.tileTextColor.eq(tileIndex).should("have.value",tile.tileTextColor);
      // }
      if (tile.integratedView !== undefined) {
        if (tile.integratedView === true) {
          this.tileIntegratedViewCheckbox.eq(tileIndex).should('be.checked');
        } else {
          this.tileIntegratedViewCheckbox.eq(tileIndex).should('not.be.checked');
        }
      }
    }
  
    verifyTile() {}
  
    getNumberOfTiles() {
      this.tileImage.its('length').then(length => {
        cy.wrap(length).as('numberOfTiles');
      });
    }
    // verifyToastMessage(message) {
    //   this.toastContainer.should('contain.text', message);
    // }
  
    getAllTiles() {
      let list = [];
      this.tileTitle.each(ele => {
        let title = ele.text();
        list.push(title);
        cy.wrap(list).as('tileList');
      });
    }
    //Homepage cards
    verifyHomeCardExists(title: string) {
      this.homeCard.contains(title).should('exist');
    }
    verifyHomeCardDoesntExists(title: string) {
      this.homeCard.contains(title).should('not.exist');
    }
    verifyHomeCardUrlIsCorrect(title: string, url: string) {
      this.homeCard.contains(title).click();
      cy.url().should('include', url);
    }
  
    verifyImageExistsOnHomeCard(url = undefined, config = { tileIndex: -1 }) {
      this.homeCardImage
        .eq(config.tileIndex)
        .should('not.have.attr', 'src', 'assets/no-image.png');
      this.homeCardImage
        .eq(config.tileIndex)
        .invoke('attr', 'src')
        .then(ele => {
          if (url != undefined) {
            expect(ele).to.equal(url);
          }
          cy.wrap(ele).as('imageUrl');
        });
    }
  
    //Files
    uploadImage(imageUrl: string, config = { verify: true, tileIndex: -1 }) {
      cy.wait(2000);
      this.tileUploadFileInput.eq(config.tileIndex).attachFile(imageUrl);
      cy.wait(5000);
      if (config.verify === true) {
        this.verifyImageExists();
      }
    }
  
    verifyImageExists(url = undefined, config = { tileIndex: -1 }) {
      this.tileImage
        .eq(config.tileIndex)
        .should('not.have.attr', 'src', 'assets/no-image.png');
      this.tileImage
        .eq(config.tileIndex)
        .invoke('attr', 'src')
        .then(ele => {
          if (url != undefined) {
            expect(ele).to.equal(url);
          }
          cy.wrap(ele).as('imageUrl');
        });
    }
  
    verifyImageDoesntExist(config = { tileIndex: -1 }) {
      this.tileImage
        .eq(config.tileIndex)
        .should('have.attr', 'src', 'assets/no-image.png');
    }
  }