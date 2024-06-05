import 'cypress-v10-preserve-cookie';
import { faker } from '@faker-js/faker';
import { qase } from 'cypress-qase-reporter/dist/mocha';

import { documentPath } from '../../support/constant/document-manager/index';
import { NewDocumentCategory } from '../../page-object/document-manager/create-document-category.po';
import { DocumentPage } from '../../page-object/document-manager/document.po';

const documentCategory = new NewDocumentCategory();
const documentType = `Type - ${faker.datatype.number()}`;
const document = new DocumentPage();

describe('Document category - Create', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        document.navigateToDocumentCategorySection();
        documentCategory.addDocumentCategoreBtn.click();
    });

    qase(
        114,
        it('Verify that "Add document category" working correctly', () => {
            cy.intercept('POST', documentPath.SRVC_DOC_TYPES).as('createdDocTypeRes');
            documentCategory.nameInput.type(documentType);
            documentCategory.createDocumentTypeBtn.click();

            cy.verifyURLContains(documentPath.DOC_CATS);
            documentCategory.verifyDocumentTypeExist(documentType);
        }),
    );

    after(() => {
        cy.wait('@createdDocTypeRes').then(createdDocTypeRes => {
            const docTypeId = createdDocTypeRes.response.body.data.id;
            cy.deleteDocumentType(docTypeId);
            cy.logout();
        });
    });
});

describe('Document category - Edit', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.createDocumentType(documentType);
        document.navigateToDocumentCategorySection();
    });

    qase(
        113,
        it('Verify that the "Edit document" working correctly in Document category tab', function () {
            cy.visit(documentPath.DOC_CATS + "/" + this.docTypeId).wait(3000);
            documentCategory.nameInput.type('it');
            documentCategory.saveChangesBtn.click();
            cy.wait(5000);
            cy.verifyURLContains(documentPath.DOC_CATS);
            documentCategory.verifyDocumentTypeExist(documentType + 'it');
        }),
    );

    after(function () {
        cy.deleteDocumentType(String(this.docTypeId));
        cy.logout();
    });
})

describe('Document category - Navigation', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        cy.createDocumentType(documentType);
    });

    context('Create mode', () => {
        beforeEach(() => {
            cy.preserveCookieOnce('_oauth2_proxy');
            document.navigateToDocumentCategorySection();
            documentCategory.addDocumentCategoreBtn.click();
        });

        qase(
            111,
            it('Verify that "Cancel option in Adding document category" working correctly', () => {
                documentCategory.nameInput.type(documentType);
                documentCategory.cancelBtn.click();
                cy.verifyURLContains(documentPath.DOC_CATS);
            }),
        );

        qase(
            112,
            it('Verify that "Back option in Adding document category" working correctly', () => {
                documentCategory.nameInput.type(documentType);
                documentCategory.backBtn.click();
                cy.verifyURLContains(documentPath.DOC_CATS);
            }),
        );
    });

    after(function () {
        cy.deleteDocumentType(String(this.docTypeId));
        cy.logout();
    });
})

describe('Document category - Search', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.setAppLanguage(Cypress.env('LANGUAGE'))
        document.navigateToDocumentCategorySection();
        cy.createDocumentType(documentType);
    });

    qase(
        108,
        it('Verify that search box working correctly in Document Category tab', () => {
            documentCategory.documentSearchInput.type(documentType,);
            cy.searchEssence(documentPath.SRVC_DOC_TYPES, documentType);
            //documentCategory.firstRowTable.contains(documentType);
        }),
    );

    afterEach(() => {
        cy.get('@docTypeId').then(docTypeId => cy.deleteDocumentType(String(docTypeId)));
        cy.logout();
    });
});
