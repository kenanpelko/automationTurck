export default class HomePage {
    get welcomeText() {
      return cy.get('.home .title');
    }
  
    get homeBackground() {
      return cy.get('.page');
    }
  
    get videoBg() {
      return cy.get('.page .video-bg')
    }
  
    verifyBackgroundImage(alias) {
      cy.wait(alias)
        .then(response => {
          const { body } = response.response;
          const img = body.data;
          return img[0].value;
        })
        .then(imgVal => {
          this.homeBackground.should(
            'have.attr',
            'style',
            `background-image: url("https://myturck-e2e.elunic.software/service/file//v1/file/${imgVal}");`,
          );
        });
    }
  }
  