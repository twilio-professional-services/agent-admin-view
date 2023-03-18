import * as Flex from '@twilio/flex-ui';
import { Action as ReduxAction } from 'redux';
import { namespace } from 'states';

export interface Action extends ReduxAction {
  //workers: Array<WorkerItem>
  //but use generic payload instead
  payload?: any;
}

interface WorkerAttributes {
  SID: string;
  contact_uri: string;
  disabled_skills?: {
    levels: { [skillName: string]: number };
    skills: string[];
  };
  image_url: string;
  roles: string[];
  routing?: {
    levels: { [skillName: string]: number };
    skills: string[];
  };

  email: string;
  full_name: string;
  agent_id?: string;
  location?: string;
  manager?: string;
  team_id?: string;
  team_name?: string;
  department_id?: string;
  department_name?: string;
  skillsString?: string
  agent_attribute_1?: string
}


export interface WorkerItem {
  sid: string,
  friendlyName: string,
  attributes: WorkerAttributes
}

export interface WorkerChannel {
  taskChannelUniqueName: string,
  sid: string,
  configuredCapacity: string,
  available: boolean
}

export interface WorkerChannelCapacityResponse {
  accountSid: string;
  assignedTasks: number;
  available: boolean;
  availableCapacityPercentage: number;
  configuredCapacity: number;
  dateCreated: string;
  dateUpdated: string;
  sid: string;
  taskChannelSid: string;
  taskChannelUniqueName: string;
  workerSid: string;
  workspaceSid: string;
  url: string;
}

// workers are stored in [agent-admin].workerList.workers

export interface WorkerListState {
  workers: Array<WorkerItem> | undefined
}

interface CustomState {
  workerList: WorkerListState
}

//Define "flex" app state
export interface AppState {
  flex: Flex.AppState;
  [namespace]: CustomState;
}
