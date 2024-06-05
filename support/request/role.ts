import { constants } from "../constant/user-management";

const baseUrl = Cypress.config().baseUrl;

export default class RoleAPI {
    getRoleList() {
      cy.task("getCookie").then((cookie) => {
        cy.request({
          failOnStatusCode: false,
          method: "GET",
          url: `${baseUrl}${constants.endpoints.roles}`,
          headers: {
            "content-type": "application/json;charset=UTF-8",
            cookie: cookie,
          },
        }).then((data: any) => {
          expect(data.status).to.equal(200);
          cy.wrap(data.body.data).as("roleList");
        });
      });
    }
  
    deleteRoleList(roleList, query = "automated_role") {
      let filteredRoleList = roleList.filter((user) => {
        if (user.name.en_EN != undefined) {
          return user.name.en_EN.search(query) != -1;
        }
      });
  
      filteredRoleList.forEach((user) => {
        this.deleteRole(user.id);
      });
    }
  
    deleteRole(id: string) {
      cy.task("getCookie").then((cookie) => {
        cy.request({
          failOnStatusCode: false,
          method: "DELETE",
          url: `${baseUrl}${constants.endpoints.deleteRole}/${id}`,
          headers: {
            "content-type": "application/json;charset=UTF-8",
            cookie: cookie,
          },
        }).then((data: any) => {
          expect(data.status).to.equal(204);
        });
      });
    }
  }