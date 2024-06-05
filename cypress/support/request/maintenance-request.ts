declare namespace Cypress {
    interface Chainable {
        createNewMaintenanceStep(newStepName: String): void;
        createNewMaintenancePlan(newPlanName: String, planDescription: String, interval: String): void;
        deleteMaintenanceStep(stepId: any): void;
        deleteMaintenancePlan(planId: any): void;
        deleteMaintenanceStepWithoutWrapper(stepId: any): void;
        deleteMaintenancePlanWithoutWrapper(planId: any): void;
        getAllMaintenanceSteps(): void;
    }
  }
  
  Cypress.Commands.add('createNewMaintenanceStep', (newStepName: String) => {
    cy.request('POST', Cypress.env('URL') + '/service/maintenance/v1/procedure-steps', 
    {
        "name": newStepName,
        "mandatory": true,
        "skippable": false,
        "type": "description",
        "description": "description_" + newStepName,
        "content": {
          "images": [],
          "documents": []
        },
        "tags": [
          "tag-" + newStepName
        ]
    }).its('body').then(body => { 
      let id = body.data.id
      cy.wrap(id).as('stepId');
    });
    cy.reload();
  });

  Cypress.Commands.add('createNewMaintenancePlan', (newPlanName: String, planDescription: String, interval: String) => {
    cy.request('POST', Cypress.env('URL') + '/service/maintenance/v1/procedures', 
    {
      "name": newPlanName,
      "description": "description_" + newPlanName,
      "interval": interval,
      "intervalUnit": "hours",
      "assetTypeId": "97a9407c-ce04-4268-83cf-e1da782bcf13",
      "steps": [
        {
          "name": "step_01 " + newPlanName,
          "mandatory": true,
          "skippable": true,
          "type": "description",
          "description": "step_01 " + planDescription,
          "content": {
            "images": [],
            "documents": []
          }
        },
        {
          "name": "step_02 " + newPlanName,
          "mandatory": true,
          "skippable": true,
          "type": "description",
          "description": "step_02 " + planDescription,
          "content": {
            "images": [],
            "documents": []
          }
        },
        {
          "name": "step_03 " + newPlanName,
          "mandatory": true,
          "skippable": true,
          "type": "description",
          "description": "step_03 " + planDescription,
          "content": {
            "images": [],
            "documents": []
          }
        }
      ]
    })
    .its('body').then(body => {
      let id = body.data.id;
      let stepOne = body.data.steps[0].name;
      let stepTwo = body.data.steps[1].name;
      let stepThree = body.data.steps[2].name;
      cy.wrap(stepOne).as('stepOneName');
      cy.wrap(stepTwo).as('stepTwoName');
      cy.wrap(stepThree).as('stepThreeName');
      cy.wrap(id).as('planId');
    });
    cy.reload();
  });

  Cypress.Commands.add('deleteMaintenanceStep', (stepId: any) => { 
    cy.get(stepId).then(val => { 
      cy.request('DELETE', Cypress.env('URL') + '/service/maintenance/v1/procedure-steps/'+ val);
    });
  });

  Cypress.Commands.add('deleteMaintenancePlan', (planId: any) => {
    cy.get(planId).then((id) => {
      cy.request('DELETE', Cypress.env('URL') + '/service/maintenance/v1/procedures/'+ id);
    })
  });

  Cypress.Commands.add('deleteMaintenanceStepWithoutWrapper', (stepId: any) => { 
      cy.request('DELETE', Cypress.env('URL') + '/service/maintenance/v1/procedure-steps/'+ stepId);
  });

  Cypress.Commands.add('deleteMaintenancePlanWithoutWrapper', (planId: any) => {
      cy.request('DELETE', Cypress.env('URL') + '/service/maintenance/v1/procedures/'+ planId);
  });

  Cypress.Commands.add('getAllMaintenanceSteps', () => { 
     return cy.request('GET', Cypress.env('URL') + '/service/maintenance/v1/procedure-steps');
  })