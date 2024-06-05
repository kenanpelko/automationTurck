import { maintenancePath } from '../../support/constant/maintenance/index';

describe('Maintenance clean up', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.navigateToMaintenanceManager();
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
    });

    it('Delete all steps', () => {
        cy.request('GET', Cypress.env('URL') + maintenancePath.newStepCreatedPath).its('body').then(body => {
            cy.log(body.data);
            body.data.forEach(element => {
                cy.deleteMaintenanceStepWithoutWrapper(element.id);
            });
        })
    });

    it('Delete all plans', () => {
        cy.request('GET', Cypress.env('URL') + maintenancePath.maintenancePlansPath).its('body').then(body => {
            body.data.forEach(element => {
                cy.deleteMaintenancePlanWithoutWrapper(element.id);
            });
        })
    });
});