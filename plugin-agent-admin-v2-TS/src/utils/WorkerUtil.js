import { Manager, Notifications } from '@twilio/flex-ui';
const manager = Manager.getInstance();
import { NotificationIds } from '../notifications';

const PLUGIN_NAME = 'AgentAdminPlugin';

class WorkerUtil {
  //Format skills and levels as a string for display
  getSkillsString = (worker) => {
    if (!worker.attributes.routing || !worker.attributes.routing.skills) return "NONE";
    const skills = worker.attributes.routing.skills;
    const levels = worker.attributes.routing.levels;
    let str = "";
    if (skills.length == 0) return "NONE";
    for (let i = 0; i < skills.length; i++) {
      let skill = skills[i];
      str += skill;
      if (levels) {
        let lvl = levels[skill];
        if (lvl) str = str + "(" + lvl + ")";
      }
      if (i < skills.length - 1) str += " / ";
    }
    return str;
  }

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
    workers.forEach(wk => wk.attributes.skillsString = this.getSkillsString(wk));
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
      Notifications.showNotification(NotificationIds.UPDATE_WORKER_SUCCESS);
    } catch (error) {
      console.error(PLUGIN_NAME, 'Failed to update worker');
      Notifications.showNotification(NotificationIds.UPDATE_WORKER_FAILED);
    }
    return worker;
  }

  //New Batch Update Workers
  batchUpdateWorkers = async (workerSids, workerAttr) => {
    //Throttle from UI?
    //Change implementation
    //Implement inside new function
    workerSids.forEach(sid => {
      console.log(PLUGIN_NAME, 'Batch Updating worker:', sid);
      this.updateWorker(sid, workerAttr);
    })
  }

}




const workerUtil = new WorkerUtil();

export default workerUtil;