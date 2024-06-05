import { faker } from "@faker-js/faker";
import { merge } from "merge-anything";
import { User } from "../users";

export default function generateRandomUser(overrides = undefined) {
  const newUser: User = {
    userName: `automated_user${faker.datatype.number().toString()}`,
    email:`kenanp.qa+${faker.datatype.number().toString()}@gmail.com`,//create new email
    password:'Secure123!',
    passwordRepeat:"Secure123!",
    firstName:faker.name.firstName(),
    lastName:faker.name.lastName(),
    roles:["Admin"]
  };

  if (overrides != undefined) {
    return merge(newUser, overrides);
  } else return newUser;
}
