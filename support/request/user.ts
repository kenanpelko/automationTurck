import { constants } from "../constant/user-management";
import { User } from "../users";

const baseUrl = Cypress.config().baseUrl;

export default class UserAPI {
  addUser(user: User) {
    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: false,
        method: "POST",
        url: `${baseUrl}${constants.user.users}`,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          cookie: cookie,
        },
        body: {
          user: {
            name: user.userName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: [
              {
                id: "505316a3-7180-3871-e7f1-d12fbadd9c6b",
                key: "urn:sio:role:admin-producer",
              },
            ],
            imageId: null,
          },
          options: {
            sendResetPasswordMail: false,
            setPassword: true,
            password: user.password,
          },
        },
      }).then((data: any) => {
        expect(data.status).to.equal(201);
      });
    });
  }

  getUserList() {
    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: false,
        method: "GET",
        url: `${baseUrl}${constants.user.users}`,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          cookie: cookie,
        },
      }).then((data: any) => {
        expect(data.status).to.equal(200);
        cy.wrap(data.body.data).as("userList");
      });
    });
  }

  deleteUsersList(userList, query = "automated_user") {
    let filteredUserList = userList.filter((user) => {
      return user.name.search(query) != -1;
    });

    filteredUserList.forEach((user) => {
      this.delereUser(user.id);
    });
  }

  delereUser(id: string) {
    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: false,
        method: "DELETE",
        url: `${baseUrl}${constants.user.deleteUser}/${id}`,
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
