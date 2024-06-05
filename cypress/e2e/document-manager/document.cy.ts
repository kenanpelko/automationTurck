import { faker } from '@faker-js/faker';
import { qase } from 'cypress-qase-reporter/dist/mocha';
import 'cypress-v10-preserve-cookie';

const buttons = require(`../../fixtures/i18n/document-manager/${Cypress.env('LANGUAGE')}`); 
import { documentPath } from '../../support/constant/document-manager/index';
import { CreateDocumentPage } from '../../page-object/document-manager/create-document.po';
import { DocumentPage } from '../../page-object/document-manager/document.po';

const document = new DocumentPage();
const createDocument = new CreateDocumentPage();

const documentName = `Document - ${faker.datatype.number()}`;
const documentType = `Type - ${faker.datatype.number()}`;

describe.skip('Create document', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.createDocumentType(documentType);
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
        document.navigateToDocumentSection();
        document.addDocumentBtn.click();
    });

    qase(
        100,
        it('Verify that "Add document" working correctly', () => {
            cy.intercept('POST', documentPath.SRVC_DOCS).as('createdDocRes');
            createDocument.fillForm(documentName, documentType);
            createDocument.fileInputField.attachFile('images/stockholm.jpeg');
            createDocument.createButton.wait(2000).click();

            cy.verifyURLContains(documentPath.DOCS);
            document.getDocumentOnPage(documentName, documentType).should('exist');
        }),
    );

    qase(
        94,
        it('Verify that the "Upload new File in Adding document" working correctly', () => {
            cy.intercept('POST', documentPath.SRVC_DOCS).as('createdDocRes');
            createDocument.fillForm(documentName, documentType);
            cy.get('input[type=file].hidden-input')
                .should('be.hidden')
                .invoke('css', 'visibility', 'visible')
                .should('have.css', 'visibility', 'visible')
                .selectFile(
                    {
                        contents: 'cypress/fixtures/images/stockholm.jpeg',
                    },
                    { action: 'drag-drop' },
                );
            createDocument.createButton.click();

            cy.verifyURLContains(documentPath.DOCS);
            document.getDocumentOnPage(documentName, documentType).should('exist');
        }),
    );

    afterEach(() => {
        cy.wait('@createdDocRes').then(createdDocRes => {
            const docId = createdDocRes.response.body.data.id;
            cy.deleteDocument(docId);
        });
    });

    after(function () {
        cy.deleteDocumentType(String(this.docTypeId));
    });
});

describe.skip('Update document', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.createDocumentType(documentType);
        cy.createDocument(documentName + 'Edit', 'images/stockholm.jpeg');
        document.navigateToDocumentSection();
        document.addDocumentBtn.click();
    })

    qase(
        102,
        it('Verify that the "Edit document" working correctly', () => {
            cy.visit(documentPath.DOCS);
            document.findExistingDocument(documentName + 'Edit', ' Edit');
            createDocument.fillForm('it', documentType);
            createDocument.saveChangesBtn.click();

            cy.verifyURLContains(documentPath.DOCS);
            document.getDocumentOnPage(documentName + 'Edit', documentType).should('exist');
            cy.get('@docId').then(docId => cy.verifyEssenceStatus(documentPath.SRVC_DOCS, String(docId), 200));
        }),
    );

    after(function () {
        cy.deleteDocument(String(this.docId));
        cy.reload()
        cy.wait(2000)
        cy.deleteDocumentType(String(this.docTypeId));
    });
});

describe.skip('Delete document', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.createDocumentType(documentType);
        cy.createDocument(documentName + 'DEL', 'images/stockholm.jpeg');
        document.navigateToDocumentSection();
    });

    qase(
        103,
        it('Verify that the "Delete document" working correctly', () => {
            cy.visit(documentPath.DOCS);
            document.findExistingDocument(documentName + 'DEL', buttons.buttons.deleteDocument);
            document.deleteDocumentBtn.click();

            cy.verifyURLContains(documentPath.DOCS);
            document.getDocumentOnPage(documentName, documentType).should('not.exist');
            cy.get('@docId').then(docId => cy.verifyEssenceStatus(documentPath.SRVC_DOCS, String(docId), 404));
        }),
    );

    after(function () {
        cy.deleteDocumentType(String(this.docTypeId));
    });
});

describe.skip('Documents navigation', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.createDocumentType(documentType);
        cy.createDocument(documentName + 'Ed', 'images/stockholm.jpeg');
    });

    context('Create mode', () => {
        beforeEach(() => {
            cy.preserveCookieOnce('_oauth2_proxy');
            document.navigateToDocumentSection();
            document.addDocumentBtn.click();
        });

        qase(
            101,
            it('Verify that the "Document category dropdown in Adding document" working correctly', () => {
                createDocument.documentCategoryDropdown.click();
                createDocument.documentCategory.contains(documentType);
            }),
        );

        qase(
            95,
            it('Verify that the "Cancel option in Adding document" working correctly', () => {
                createDocument.fillForm(documentName, documentType);
                createDocument.cancelBtn.click();

                document.documentTable.should('be.visible');
                cy.verifyURLContains(documentPath.DOCS);
            }),
        );

        qase(
            93,
            it('Verify that the "Back option in Adding document" working correctly', () => {
                createDocument.fillForm(documentName, documentType);
                createDocument.backBtn.click();

                document.documentTable.should('be.visible');
                cy.verifyURLContains(documentPath.DOCS);
            }),
        );
    });

    context('Edit mode', () => {
        beforeEach(() => {
            cy.preserveCookieOnce('_oauth2_proxy');
            document.navigateToDocumentSection();
        });

        qase(
            104,
            it('Verify that "view file in edit mode" working correctly in All documents tab', function () {
                cy.visit(documentPath.DOCS);
                document.findExistingDocument(documentName + 'Ed', ' Edit');
                cy.wait(2000)
                document.imageContainer(String(this.fileId)).should('have.attr', 'target', '_blank');
                cy.verifyEssenceStatus(documentPath.SRVC_FILE, String(this.fileId), 200);
            }),
        );

        qase(
            105,
            it('Verify that "Cancel in edit mode" working correctly in All documents tab', function () {
                document.findExistingDocument(documentName + 'Ed', ' Edit');
                createDocument.fillForm('it', documentType);
                document.cancelBtn.click();

                cy.verifyURLContains(documentPath.DOCS);
                document.getDocumentOnPage(documentName, documentType).should('exist');
                cy.verifyEssenceStatus(documentPath.SRVC_DOCS, String(this.docId), 200);
            }),
        );

        qase(
            106,
            it('Verify that "Back in edit mode" working correctly in All documents tab', function () {
                document.findExistingDocument(documentName + 'Ed', ' Edit');
                createDocument.fillForm('it', documentType);
                document.backBtn.click();

                cy.verifyURLContains(documentPath.DOCS);
                document.getDocumentOnPage(documentName, documentType).should('exist');
                cy.verifyEssenceStatus(documentPath.SRVC_DOCS, String(this.docId), 200);
            }),
        );
    });

    after(function () {
        cy.deleteDocument(String(this.docId))
        cy.deleteDocumentType(String(this.docTypeId));
        cy.logout();
    });
});

describe.skip('Search document', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        document.navigateToDocumentSection();
        cy.createDocumentType(documentType);
        cy.createDocument(documentName + 'searched', 'images/stockholm.jpeg');
    });

    qase(
        96,
        it('Verify that search box working correctly in All documents tab', () => {
            cy.visit(documentPath.DOCS);
            document.documentSearchInput.type(documentName + 'searched');
            cy.searchEssence(documentPath.SRVC_DOCS, documentName + 'searched');
            document.firstRowTable.contains(documentName + 'searched');
        }),
    );

    afterEach(() => {
        cy.get('@docId').then(docId => cy.deleteDocument(String(docId)));
        cy.get('@docTypeId').then(docTypeId => cy.deleteDocumentType(String(docTypeId)));
    });
});
