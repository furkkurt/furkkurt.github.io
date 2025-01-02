const util = require("../utils/util");
const pharmaTable = "registered_radiopharmaceoutical";

async function getPharma(radiopharmaId) {
  if (!radiopharmaId) {
    return util.buildResponse(400, {
      message: "Pharmas ID is required",
    });
  }

  try {
    const pharmas = await util.getItem(pharmaTable, radiopharmaId);
    if (!pharmas) {
      return util.buildResponse(404, {
        message: "Pharmas not found",
      });
    }
    return util.buildResponse(200, pharmas);
  } catch (error) {
    return util.buildResponse(500, {
      message: "Server error, please try again later",
    });
  }
}

async function countPharmas() {
  try {
    const pharmas = await util.scanTable(pharmaTable);
    const count = pharmas.length;
    console.log(`Number of pharmas: ${count}`);
    return util.buildResponse(200, { count });
  } catch (error) {
    return util.buildResponse(500, {
      message: "Server error, please try again later",
    });
  }
}

module.exports.getPharma = getPharma;
module.exports.countPharmas = countPharmas;
