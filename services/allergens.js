const util = require("../utils/util");
const allergensTable = "temporary_licence_allergens";

async function getAllergen(allergenId) {
  if (!allergenId) {
    return util.buildResponse(400, {
      message: "Allergen ID is required",
    });
  }

  try {
    const allergen = await util.getItem(allergensTable, allergenId);
    if (!allergen) {
      return util.buildResponse(404, {
        message: "Allergen not found",
      });
    }
    return util.buildResponse(200, allergen);
  } catch (error) {
    return util.buildResponse(500, {
      message: "Server error, please try again later",
    });
  }
}

module.exports.getAllergen = getAllergen;
