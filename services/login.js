const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-north-1",
});
const util = require("../utils/util");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");

const { buildResponse } = require("../utils/util");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "admins";

async function login(user) {
  if (!user || !user.username || !user.password) {
    return util.buildResponse(401, {
      message: "username and password are required ",
    });
  }
  const username = user.username.toLowerCase().trim();
  const password = user.password;

  const dynamoUser = await getUser(username);
  if (!dynamoUser || !dynamoUser.id) {
    return util.buildResponse(403, {
      message: "user does not exist",
    });
  }
  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return buildResponse(403, {
      message: "password is incorrect",
    });
  }
  const userInfo = {
    username: dynamoUser.id,
    name: dynamoUser.name,
  };
  const token = auth.generateToken(userInfo);
  const response = {
    user: userInfo,
    token: token,
  };
  return util.buildResponse(200, response);
}

async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: {
      id: username,
    },
  };

  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        return response.Item;
      },
      (error) => {
        console.error("there is an error getting user :", error);
      }
    );
}

module.exports.login = login;
