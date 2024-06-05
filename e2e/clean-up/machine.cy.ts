import { maintenancePath } from '../../support/constant/maintenance/index';

describe('Maintenance clean up', () => {
    before(() => {
        cy.navigateToBaseURL(Cypress.env('URL'));
        cy.navigateToMaintenanceManager();
    });

    beforeEach(() => {
        cy.preserveCookieOnce('_oauth2_proxy');
    });

    //SKIPPED BECAUSE OF ACTIVE ISSUE (https://gitlab.elunic.software/turck/myturck/-/issues/231)
    xit('Delete all machines', () => {
        cy.request('GET', Cypress.env('URL') + '/service/condition-monitoring/v1/machine-variables').its('body').then(body => {
            body.data.forEach(element => {
                cy.request('DELETE', Cypress.env('URL') + '/service/condition-monitoring/v1/machine-variables/' + element.id);
            });
            
        })
    });
});