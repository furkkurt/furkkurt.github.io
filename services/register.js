const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-north-1",
});
const util = require("../utils/util");
const bcrypt = require("bcryptjs");
const userTable = "admins";

async function register(userInfo) {
  const name = userInfo.name;
  const email = userInfo.email;
  const username = userInfo.username.toLowerCase().trim();
  const password = userInfo.password;

  if (!username || !name || !email || !password) {
    return util.buildResponse(401, {
      message: "All fields are required",
    });
  }

  const dynamoUser = await util.getItem(userTable, username);
  if (dynamoUser && dynamoUser.id) {
    return util.buildResponse(401, {
      message:
        "username already exist in out database. please choose a different username",
    });
  }

  const encryptedPW = bcrypt.hashSync(password.trim(), 10);
  const user = {
    name: name,
    email: email,
    id: username,
    password: encryptedPW,
  };

  const savedUserResponse = await util.saveItem(userTable, user);
if (savedUserResponse !== true) {
  return util.buildResponse(503, {
    message: "Server Error. Please try again later.",
    error: savedUserResponse // Hata bilgisini ekleyin
  });
}

  return util.buildResponse(200, { username: username });
}

module.exports.register = register;
