import Role from "../models/Role.js";

export const createRole = async (req, res, next) => {
  try {
    // await new Role({
    //   roleId: new Date().getTime(),
    //   name: "Doctor",
    // }).save();
    // res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
