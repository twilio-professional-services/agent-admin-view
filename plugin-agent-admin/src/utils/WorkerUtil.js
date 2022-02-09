import { Manager } from '@twilio/flex-ui';
const manager = Manager.getInstance();
const PLUGIN_NAME = 'AgentAdminPlugin';

class WorkerUtil {
  getWorkers = async () => {
    console.debug('Getting all workers');
    const fetchUrl = `${process.env.FLEX_APP_FUNCTIONS_BASE}/get-workers`;
    const fetchBody = {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
    };
    const fetchOptions = {
      method: 'POST',
      body: new URLSearchParams(fetchBody),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    };

    let workers = [];
    try {
      const response = await fetch(fetchUrl, fetchOptions);
      workers = await response.json();
      console.debug(PLUGIN_NAME, 'Workers:', workers);
    } catch (error) {
      console.error(PLUGIN_NAME, 'Failed to get workers');
    }
    //Fix attributes, Json string back to object
    workers.forEach(wk => wk.attributes = JSON.parse(wk.attributes));
    return workers;
  }

  updateWorker = async (workerSid, workerAttr) => {
    console.debug('Updating worker:', workerSid);
    const fetchUrl = `${process.env.FLEX_APP_FUNCTIONS_BASE}/update-worker`;
    // send attributes as json
    const fetchBody = {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
      workerSid,
      updatedAttributes: JSON.stringify(workerAttr)
    };
    console.log('Update worker with payload: ', fetchBody);
    const fetchOptions = {
      method: 'POST',
      body: new URLSearchParams(fetchBody),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    };

    let worker;
    try {
      const response = await fetch(fetchUrl, fetchOptions);
      worker = await response.json();
      console.debug(PLUGIN_NAME, 'Updated worker:', worker);
    } catch (error) {
      console.error(PLUGIN_NAME, 'Failed to update worker');
    }
    return worker;
  }
}

const workerUtil = new WorkerUtil();

export default workerUtil;