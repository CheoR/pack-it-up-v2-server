import { db } from "../data/db";

export const Query = {
  users: () => {
    return db.users;
  }
};
