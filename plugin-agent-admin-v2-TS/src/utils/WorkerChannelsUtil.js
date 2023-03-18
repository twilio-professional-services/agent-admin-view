import { Manager } from '@twilio/flex-ui';
import { PLUGIN_NAME } from './constants';

const manager = Manager.getInstance();

class WorkerChannelsUtil {

  getWorkerChannels = async (workerSid) => {
    console.debug('Getting all worker channels for', workerSid);
    const fetchUrl = `${process.env.FLEX_APP_FUNCTIONS_BASE}/getWorkerChannels`;
    const fetchBody = {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
      workerSid
    };
    const fetchOptions = {
      method: 'POST',
      body: new URLSearchParams(fetchBody),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    };

    let workerChannels = [];
    try {
      const response = await fetch(fetchUrl, fetchOptions);
      workerChannels = await response.json();
      console.debug(PLUGIN_NAME, 'Channels:', workerChannels);
    } catch (error) {
      console.error(PLUGIN_NAME, 'Failed to get Channels');
    }
    
    return workerChannels;
  }

  updateWorkerChannelCapacity = async (workerSid, workerChannelSid, capacity, available) => {

    console.debug('Updating worker channel', workerChannelSid, 'for worker', workerSid);
    const fetchUrl = `${process.env.FLEX_APP_FUNCTIONS_BASE}/setWorkerChannelCapacity`;
    // send attributes as json
    const fetchBody = {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
      workerSid,
      workerChannelSid,
      capacity, 
      available
    };
    console.log('Update worker channel with payload: ', fetchBody);
    const fetchOptions = {
      method: 'POST',
      body: new URLSearchParams(fetchBody),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    };

    let workerChannel;
    try {
      const response = await fetch(fetchUrl, fetchOptions);
      workerChannel = await response.json();
      console.debug(PLUGIN_NAME, 'Updated channel:', workerChannel);
    } catch (error) {
      console.error(PLUGIN_NAME, 'Failed to update channel');
    }
    return workerChannel;
  }
}

const workerChannelsUtil = new WorkerChannelsUtil();

export default workerChannelsUtil;