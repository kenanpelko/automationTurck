export class AddImage {
  get wrapper() {
    return cy.get('mnt-procedure-step-images-form[formcontrolname="images"]');
  }

  get uploadElement() {
    return this.wrapper.find('input[type="file"]');
  }

  verifyImageIsUploaded(imageName: string, isUploaded: boolean) {
    if (isUploaded) {
      this.wrapper.find('.media-row-item .media-name').contains(imageName).should('be.visible');
    } else {
      this.wrapper.contains('.media-name', imageName).should('not.exist');
    }
  }

  deleteImage(imageName: string) {
    this.wrapper
      .find('.media-row-item .media-name')
      .contains(imageName)
      .siblings('.media-delete')
      .click();
  }
}
