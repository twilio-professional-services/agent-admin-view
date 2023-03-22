const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator(async function (context, event, callback) {
  let response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { workerSid, channelProps } = event;

  // Make sure that required API values are sent
  if (!workerSid || !channelProps) {
    response.setBody({ success: false, error: "Required fields not sent." });
    return callback(null, response);
  }

  // Make sure that this user is allowed to perform this action
  if (!(event.TokenResult.roles.includes('supervisor') || event.TokenResult.roles.includes('admin'))) {
    response.setStatusCode(403)
    response.setBody({ success: false, error: "User does not have the permissions to perform this action." });
    return callback(null, response);
  }

  const channelSettings = JSON.parse(channelProps);
  console.log('Channel Settings:', channelSettings);

  let client = context.getTwilioClient();

  const updateChannel = async (workerChannelSid, capacity, available) => {
    let workerChannel = await client.taskrouter.workspaces(context.TWILIO_WORKSPACE_SID)
      .workers(workerSid)
      .workerChannels(workerChannelSid)
      .update({ capacity, available });
    return workerChannel;
  }

  //Get all WorkerChannels
  let workerChannels = await client
    .taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .workers(workerSid)
    .workerChannels
    .list();

  const channelNames = Object.keys(channelSettings);
  const filteredWorkerChannels = workerChannels.filter(wc => channelNames.includes(wc.taskChannelUniqueName));

  var results = await Promise.allSettled(
    filteredWorkerChannels.map(async (wc) => {
      console.log('Worker Channel:', wc);
      const cs = channelSettings[wc.taskChannelUniqueName];
      return updateChannel(wc.sid, cs.capacity, cs.available)
        .catch((error) => {
          console.log("error....", error);
          return Promise.reject({ error: error.message, workerChannelSid: wc.sid });
        })
        .then(() => {
          return Promise.resolve(wc.sid);
        });
    })
  );
  console.log('Results:', results);

  let data = [];
  results.forEach((result) => {
    console.log(result);
    let status, message, workerChannelSid;
    if (result.status === "rejected") {
      workerChannelSid = result.reason.workerChannelSid;
      status = 400;
      message = JSON.stringify(result);
    } else {
      workerChannelSid = result.value;
      status = 200;
      message = "success";
    }
    var res = { workerSid, workerChannelSid, message: message, status: status };
    data.push(res);
  });

  response.setBody(data);
  return callback(null, response);
});
