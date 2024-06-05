import { qase } from 'cypress-qase-reporter/dist/mocha';
import generalConstants from '../../support/constant/hub-settings/index'
import GeneralSettings from '../../page-object/hub-settings/general-settings.po';
import HomePage from '../../page-object/home-page/home.po';
import 'cypress-v10-preserve-cookie';
import { generate } from 'rxjs';

const message = require(`../../fixtures/i18n/toaster-messages/${Cypress.env('LANGUAGE')}`); 
const localization = require(`../../fixtures/i18n/hub-settings/${Cypress.env('LANGUAGE')}`); 
const generalSettings = new GeneralSettings();
const home = new HomePage();

describe('General settings - Logo actions', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
  });

  beforeEach(() => { 
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToHubSettings();
  });

  qase(
    387,
    it('Verify that user is able to upload logo by click "Upload file" button', () => {
      generalSettings.inputLogo.selectFile('cypress/fixtures/images/cat.jpg', { force: true });
      generalSettings.saveChangesButton.click()
      cy.verifySuccessToasterMessage(message.success.changesSaved)
      cy.reloadPage()
      generalSettings.logo.should('not.have.attr', 'src', 'assets/images/logo.png');
      generalSettings.deleteLogo();
    })
  );

  qase(
    388,
    it('Verify that "Delete file" button appears after user uploaded file', () => {
      generalSettings.inputLogo.selectFile('cypress/fixtures/images/cat.jpg', { force: true });
      cy.wait(2000);
      generalSettings.deleteLogoButton.should('be.visible');
    })
  );

  qase(
    389,
    it('Verify that user is able to delete logo by click on "Delete file" button', () => {
      generalSettings.inputLogo.selectFile('cypress/fixtures/images/cat.jpg', { force: true });
      generalSettings.saveChangesButton.click();
      cy.verifySuccessToasterMessage(message.success.changesSaved)
      cy.reloadPage();
      generalSettings.logo.should('not.have.attr', 'src', 'assets/images/logo.png',);
      generalSettings.deleteLogoButton.click();
      generalSettings.saveChangesButton.click();
      cy.reloadPage();
      generalSettings.logo.should('have.attr', 'src', 'assets/images/logo.png');
    })
  );
});

describe('General settings - Welcome text checkbox', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
  });

  beforeEach(() => { 
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToHubSettings();
  });

  qase(
    394,
    it('Verify that selected "Light welcome text?" leads to light welcome text on hub/home page', () => {
      cy.wait(2000)
      generalSettings.lightWelcomeTextCheckbox.check({ force: true });
      generalSettings.saveChangesButton.click();
      cy.verifySuccessToasterMessage(message.success.changesSaved)
      cy.navigateToHomePage();
      cy.wait(2000)
      home.welcomeText.should('have.attr', 'style', 'color: rgb(255, 255, 255);');
    })
  );

  qase(
    395,
    it('Verify that not selected "Light welcome text?" leads to dark welcome text on hub/home page', () => {
      cy.wait(2000)
      generalSettings.lightWelcomeTextCheckbox.uncheck({ force: true });
      generalSettings.saveChangesButton.click();
      cy.verifySuccessToasterMessage(message.success.changesSaved)
      cy.navigateToHomePage();
      home.welcomeText.should('have.attr', 'style', 'color: rgb(0, 0, 0);');
    })
  );
});


describe.only('General settings - background actions', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
  });

  beforeEach(() => { 
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.navigateToHubSettings();
  });

  qase(
    396,
    it('Verify that user is able to upload background image by click on "Upload file" button', () => {
      generalSettings.backgroundImageOrVideoInput.selectFile('cypress/fixtures/images/cat.jpg', { force: true });
      cy.intercept('POST', Cypress.env('URL') + generalConstants.endpoint.general).as('imageID');
      generalSettings.saveChangesButton.click();
      cy.verifySuccessToasterMessage(message.success.changesSaved)
      cy.navigateToHomePage();
      home.verifyBackgroundImage('@imageID');
      generalSettings.returnBackgroundImage('cypress/fixtures/images/background.jpg');
    })
  );

  qase(
    397,
    it('Verify that user is able to delete background image by click on "Delete file" button', () => {
      cy.wait(2000)
      generalSettings.deleteBackgroundButton.click();
      generalSettings.saveChangesButton.click();
      cy.verifySuccessToasterMessage(message.success.changesSaved)
      cy.navigateToHomePage();
      home.homeBackground.should('have.attr', 'style', 'background-image: url("");');
      generalSettings.returnBackgroundImage('cypress/fixtures/images/background.jpg');
    })
  );

  qase(
    398,
    it('Verify that "Delete file" button appears after user uploaded background image', () => {
      generalSettings.deleteBackgroundButton.click();
      generalSettings.backgroundImageOrVideoInput.selectFile('cypress/fixtures/images/background.jpg', { force: true });
      generalSettings.deleteBackgroundButton.should('exist').and('be.visible');
    })
  );

  // Test skipped because of active issue. Video can't be uploaded as backgrouond
  qase(
    399,
    xit('Verify that user is able to upload video as background by click "Upload file" button', () => {
      generalSettings.backgroundImageOrVideoInput.selectFile('cypress/fixtures/images/video.mp4', { force: true });
      cy.wait(2000);
      generalSettings.saveChangesButton.click();
      cy.verifySuccessToasterMessage(message.success.changesSaved)
      cy.navigateToHomePage();
      home.videoBg.should('exist');
      generalSettings.returnBackgroundImage('cypress/fixtures/images/background.jpg');
    })
  );

  // Test skipped because of active issue. Video can't be uploaded as backgrouond
  qase(
    400,
    xit('Verify that user is able to delete video from background by click "Delete file" button', () => {
      generalSettings.backgroundImageOrVideoInput.selectFile('cypress/fixtures/images/video.mp4', { force: true });
      cy.wait(2000);
      generalSettings.saveChangesButton.click();
      cy.fixture('i18n/toaster-messages/en').then((text) => {
        cy.verifySuccessToasterMessage(text.success.changesSaved)
        cy.navigateToHomePage();
        home.videoBg.should('exist');
        cy.navigateToHubSettings();
        generalSettings.deleteBackgroundButton.click();
        generalSettings.saveChangesButton.click();
        cy.verifySuccessToasterMessage(text.success.changesSaved);
      });
      cy.navigateToHomePage();
      home.videoBg.should('not.exist');
      generalSettings.returnBackgroundImage('cypress/fixtures/images/background.jpg');
    })
  );
});


describe('Element Verification', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
    cy.setAppLanguage(Cypress.env('LANGUAGE'))
    cy.preserveCookieOnce('_oauth2_proxy');
    cy.navigateToHubSettings();
  });

  qase(
    383,
    it('Verify all Elements have been loaded on General settings page', () => {
      generalSettings.pageTitle.should('contain', localization.generalSettings.header.settingsTitle)
      generalSettings.generalSettingsTitle.should('contain', localization.generalSettings.header.generalSettings)
      generalSettings.tileConfigurationTitle.should('contain', localization.generalSettings.header.tileConfiguration)
      generalSettings.cancelButton.should('contain', localization.generalSettings.header.cancel)
      generalSettings.saveChangesButton.should('contain', localization.generalSettings.header.saveChanges)

      generalSettings.inputTitle.should('contain', localization.generalSettings.elements.logo)
      generalSettings.primaryColorTitle.should('contain', localization.generalSettings.elements.primaryColor)
      generalSettings.backgroundColorTitle.should('contain', localization.generalSettings.elements.secondaryColor)
      generalSettings.lightWelcomeTextTitle.should('contain', localization.generalSettings.elements.lightWelcomeText)
      generalSettings.backgroundImageTitle.should('contain', localization.generalSettings.elements.backgroundImage)
    })
  );
  });