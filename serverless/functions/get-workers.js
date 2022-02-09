const TokenValidator = require("twilio-flex-token-validator").functionValidator;

exports.handler = TokenValidator(async function (context, event, callback) {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
 
  //Max limit is 1000 increase from 100 to avoid pagination
  try {
    const workers = await client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .workers.list({limit: 100});

    //Check response format
    console.log('Retrieved ', workers.length, ' workers');
    
    response.appendHeader("Content-Type", "application/json");
    response.setBody(workers);
    return callback(null, response);
  } catch (err) {
    returnError(callback, response, err.message);
  }
});

const returnError = (callback, response, errorString) => {
  console.error(errorString);
  response.appendHeader("Content-Type", "plain/text");
  response.setBody(errorString);
  response.setStatusCode(500);
  return callback(null, response);
};
