import { documentPath } from '../constant/document-manager/index';

declare global {
  namespace Cypress {
    interface Chainable {
      createDocument(documentName: string, fileName: string): void;
      createDocumentType(name: string): void;
      deleteDocumentType(id: string): void;
      deleteDocument(id: string): void;
      verifyEssenceStatus(path: string, docId: string, status: number): void;
      searchEssence(path: string, essenceName: string): void;
    }
  }
}

Cypress.Commands.add('createDocument', (documentName: string, fileName: string) => {
  cy.get('@docTypeId').then(res => {
    const docTypeId = String(res)
    cy.fixture(fileName, 'binary')
      .then(image => {
        const blob = Cypress.Blob.binaryStringToBlob(image, 'image/jpg');
        const formData = new FormData();
        formData.append('file', blob, 'pic1.jpg');
        return cy.request({
          method: 'POST',
          url: documentPath.SRVC_FILE,
          headers: {
            'content-type': 'multipart/form-data',
          },
          body: formData,
        });
      })
      .then(response => {
        const bodyString = Cypress.Blob.arrayBufferToBinaryString(response.body);
        const body = JSON.parse(bodyString);
        const fileId = body.data.id;
        return fileId;
      })
      .then(fileId => {
        return cy.request('POST', documentPath.SRVC_DOCS, {
          name: {
            "en_EN": documentName,
          },
          typeId: docTypeId,
          fileId,
        }).then(resp => {
          cy.wrap(resp.body.data.id).as('docId');
          cy.wrap(resp.body.data.fileId).as('fileId')
        })
      });
  });
});

Cypress.Commands.add('createDocumentType', (name: string) => {
  cy.request('POST', documentPath.SRVC_DOC_TYPES, {
    name: {
      de_EN: name,
    },
  }).then(res => {
    cy.wrap(res.body.data.id).as('docTypeId');
  });
});

Cypress.Commands.add('deleteDocumentType', (docTypeId: string) => {
  cy.request('DELETE', `${documentPath.SRVC_DOC_TYPES}/${docTypeId}`);
});

Cypress.Commands.add('deleteDocument', (docId: string) => {
  cy.request('DELETE', `${documentPath.SRVC_DOCS}/${docId}`);
});

Cypress.Commands.add('verifyEssenceStatus', (path: string, docId: string, status: number) => {
  cy.request({ url: `${path}/${docId}`, failOnStatusCode: false })
    .its('status')
    .should('equal', status);
});

Cypress.Commands.add('searchEssence', (path: string, essenceName: string) => {
  cy.request({ url: `${path}?name=${essenceName}&withLinks=true`, failOnStatusCode: false })
})