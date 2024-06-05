import faker from "@faker-js/faker";
import { merge } from "merge-anything";
import { Role } from "../role";

export default function generateRandomRole(overrides = undefined) {
    const newRole: Role = {
        name: `automated_role - ${faker.datatype.number().toString()}`,
        
  };
  if (overrides != undefined) {
    return merge(newRole, overrides);
  } else return newRole;
}
