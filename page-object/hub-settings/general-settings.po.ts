export default class GeneralSettings {
    get pageTitle() {
      return cy.get('.card-page-header .card-page-title')
    }

    get generalSettingsTitle() {
      return cy.get('.card-page-header .settings-config .tabs > :nth-child(1)')
    }

    get tileConfigurationTitle() {
      return cy.get('.card-page-header .settings-config .tabs > :nth-child(2)')
    }

    get uploadLogoBtn() {
      return cy.get('.settings-content app-button .btn.primary').first();
    }
  
    get inputLogo() {
      return cy.get('.settings-content.general .d-flex .input-wrap app-input input');
    }

    get inputTitle() {
      return cy.get('.settings-content.general .d-flex .input-wrap .label');
    }

    get primaryColorTitle() {
      return cy.get('.settings-content.general :nth-child(2) .input-component .label');
    }

    get backgroundColorTitle() {
      return cy.get('.settings-content.general :nth-child(3) .input-component .label');
    }

    get lightWelcomeTextTitle() {
      return cy.get(':nth-child(9) > app-checkbox > .container');
    }

    get backgroundImageTitle() {
      return cy.get(':nth-child(10) > app-input > .input-component > .label');
    }
  
    get deleteLogoButton() {
      return cy
        .get('.settings-content.general .d-flex .input-wrap app-input .input-component')
        .find('.btn.outline');
    }
  
    get logo() {
      return cy.get('a > .logo');
    }
  
    get saveChangesButton() {
      return cy.get('.settings-config > .actions > :nth-child(2) > .btn').wait(2000);  
    }

    get cancelButton() {
      return cy.get('.settings-config > .actions > a > app-button > .btn')
    }
  
    get lightWelcomeTextCheckbox() {
      return cy.get('.settings-content.general [type="checkbox"]');
    }
  
    get backgroundImageOrVideoInput() {
      return cy.get(':nth-child(10) > app-input > .input-component > app-button > .btn');
    }
  
    get deleteBackgroundButton() {
      return cy.get(':nth-child(10) > app-input > .input-component > app-button > .btn');
    }
  
    saveAndReload() {
      cy.wait(2000);
      this.saveChangesButton.click();
      cy.reload();
    }
  
    deleteLogo() {
      this.deleteLogoButton.click();
      this.saveChangesButton.click();
      cy.wait(2000);
    }
  
    returnBackgroundImage(path: string) {
      cy.navigateToHubSettings();
      this.backgroundImageOrVideoInput.selectFile(path, { force: true });
      cy.wait(2000)
      this.saveChangesButton.click(({ force: true }));
    }
  }