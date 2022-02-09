const TokenValidator = require("twilio-flex-token-validator").functionValidator;

exports.handler = TokenValidator(async function (context, event, callback) {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const { workerSid, updatedAttributes } = event;
    const updateAttr = JSON.parse(updatedAttributes);

    const worker = await client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .workers(workerSid)
      .fetch();

    console.log('Worker:', worker);
    // Worker Attributes are encoded as Json string
    let workersAttributes = JSON.parse(worker.attributes);

    workersAttributes = {
      ...workersAttributes,
      ...updateAttr,
    };

    const updateWorker = await client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .workers(workerSid)
      .update({ attributes: JSON.stringify(workersAttributes) });

    console.log('Updated', workerSid, 'attributes with', updatedAttributes);

    response.appendHeader("Content-Type", "application/json");
    response.setBody(JSON.parse(updateWorker.attributes));
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
