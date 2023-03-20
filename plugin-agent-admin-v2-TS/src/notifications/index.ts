import * as Flex from '@twilio/flex-ui';
import {
  Notifications,
  NotificationBar,
  NotificationType,
} from "@twilio/flex-ui";

export enum NotificationIds {
  UPDATE_WORKER_SUCCESS = 'UpdateWorkerSuccess',
  UPDATE_WORKER_FAILED = 'UpdateWorkerFailed'
}


const registerNotifications = (manager: Flex.Manager) => {
  
  // manager.strings ={
  //   ...manager.strings,
  //   [NotificationIds.UPDATE_WORKER_SUCCESS] = 'Agent {{workerName}} Updated';

  // }

  Notifications.registerNotification({
    id: NotificationIds.UPDATE_WORKER_SUCCESS,
    content: "Agent Attributes and/or Channel Capacity Updated", 
    closeButton: true,
    timeout: 3000,
    type: NotificationType.success
  });

  Notifications.registerNotification({
    id: NotificationIds.UPDATE_WORKER_FAILED,
    content: "Failed to Update Agent Attributes and/or Channel Capacity", 
    closeButton: true,
    timeout: 3000,
    type: NotificationType.error
  });

};


export default  (manager: Flex.Manager) => {
  registerNotifications(manager);
};


