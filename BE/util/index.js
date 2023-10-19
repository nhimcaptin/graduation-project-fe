import escapeStringRegexp from "escape-string-regexp";
import Resource from "../models/Resource.js";
import Action from "../models/Action.js";
import Role from "../models/Role.js";

export const convertFilter = (data) => {
  const filterConditionsArray = data && data.split(",");
  const obj = {};
  (filterConditionsArray || []).forEach((x) => {
    if (x.indexOf("==") >= 0) {
      const [label, value] = x.split("==");
      obj[label] = value;
    }
    if (x.indexOf("@=") >= 0) {
      const [label, value] = x.split("@=");
      obj[label] = { $regex: escapeStringRegexp(value) };
    }
  });
  return obj;
};

export const getPermissions = async (id) => {
  try {
    const listRole = await Role.find(id ? { _id: id } : {});
    const role = [];
    for (let i = 0; i < listRole.length; i++) {
      const _role = listRole[i];
      const permissions = [];
      const lengthPermissions = _role.permissions.length;
      for (let j = 0; j < lengthPermissions; j++) {
        const _permissions = _role.permissions[j];
        const obj = {};
        const actions = [];
        const lengthActions = _permissions.actions.length;
        obj["resource"] = await Resource.findById(_permissions.resource);
        for (let k = 0; k < lengthActions; k++) {
          const _actions = _permissions.actions;
          const objActions = await Action.findById(_actions[k]);
          actions.push(objActions);
        }
        obj["actions"] = actions;
        permissions.push(obj);
        role.push({ ..._role._doc, permissions });
      }
    }
    if (role.length === 0 && listRole.length > 0) {
      role.push({ ...listRole[0]._doc, permissions: [] });
    }
    return role;
  } catch (err) {
    return err;
  }
};
