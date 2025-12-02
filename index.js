const registerService = require("./services/register");
const loginService = require("./services/login");
const verifyService = require("./services/verify");
const util = require("./utils/util");
const drugsService = require("./services/drugs");
const radiopharmaService = require("./services/radiopharma");
const allergensService = require("./services/allergens");

const allergensPath = "/allergens";
const pharmaPath = "/radiopharmaceutical";
const registerPath = "/register";
const loginPath = "/login";
const verifyPath = "/verify";
const drugsPath = "/drugs";
const healthpath = "/health";

exports.handler = async (event) => {
  console.log("Request Event : ", event);
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === healthpath:
      response = await util.buildResponse(200, "Başarılı!");
      break;
    case event.httpMethod === "POST" && event.path === registerPath:
      const registerBody = JSON.parse(event.body);
      response = await registerService.register(registerBody);
      break;
    case event.httpMethod === "POST" && event.path === loginPath:
      const loginBody = JSON.parse(event.body);
      response = await loginService.login(loginBody);
      break;
    case event.httpMethod === "POST" && event.path === verifyPath:
      const verifyBody = JSON.parse(event.body);
      response = verifyService.verify(verifyBody);
      break;
    case event.httpMethod === "GET" && event.path === drugsPath:
      let drugsId =
          event.queryStringParameters && event.queryStringParameters.drugsId;
        if (drugsId === "all") {
          const limit =
            (event.queryStringParameters &&
              parseInt(event.queryStringParameters.limit)) ||
            1000;
          const lastEvaluatedKey =
            event.queryStringParameters &&
            JSON.parse(event.queryStringParameters.lastEvaluatedKey || null);
          response = await drugsService.getAllDrugs(limit, lastEvaluatedKey);
        } else {
          response = await drugsService.getDrug(drugsId);
        }
        return response;

    case event.httpMethod === "GET" && event.path === pharmaPath:
      let radiopharmaId =
        event.queryStringParameters &&
        event.queryStringParameters.radiopharmaId;
      radiopharmaId =
        radiopharmaId === "all" ? radiopharmaId : Number(radiopharmaId);
      console.log("radiopharmaId : ", radiopharmaId);
      if (radiopharmaId === "all") {
        response = await util.scanTable("registered_radiopharmaceutical");
        response = util.buildResponse(200, response);
      } else {
        response = await radiopharmaService.getPharma(radiopharmaId);
      }
      return response;

    case event.httpMethod === "GET" && event.path === allergensPath:
      let allergensId =
        event.queryStringParameters &&
        event.queryStringParameters.allergensId;
        allergensId =
        allergensId === "all" ? allergensId : Number(allergensId);
      console.log("allergensId : ", allergensId);
      if (allergensId === "all") {
        response = await util.scanTable("registered_radiopharmaceutical");
        response = util.buildResponse(200, response);
      } else {
        response = await allergensService.getAllergen(allergensId);
      }
      return response;

    default:
      response = util.buildResponse(404, "404 Not Found");
  }
  return response;
};
