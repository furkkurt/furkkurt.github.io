const util = require("../utils/util");
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const drugsTable = "drugs_table";

async function getAllDrugs(limit, lastEvaluatedKey) {
  let params = {
    TableName: drugsTable,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    return util.buildResponse(200, {
      items: data.Items,
      lastEvaluatedKey: data.LastEvaluatedKey,
    });
  } catch (error) {
    return util.buildResponse(500, {
      message: "Server error, please try again later",
    });
  }
}

async function getDrug(drugsId) {
  if (!drugsId) {
    return util.buildResponse(400, {
      message: "Drugs ID is required",
    });
  }

  try {
    const drugs = await util.getItem(drugsTable, drugsId);
    if (!drugs) {
      return util.buildResponse(404, {
        message: "Drugs not found",
      });
    }
    return util.buildResponse(200, drugs);
  } catch (error) {
    return util.buildResponse(500, {
      message: "Server error, please try again later",
    });
  }
}

module.exports.getDrug = getDrug;
module.exports.getAllDrugs = getAllDrugs;
