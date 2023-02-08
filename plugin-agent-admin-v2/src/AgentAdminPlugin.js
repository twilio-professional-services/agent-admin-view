import React from 'react';
import { VERSION, View } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import reducers, { namespace } from './states';

import AgentAdminViewNavButton from './components/AgentAdminViewNavButton';
import AgentAdminViewContainer from './components/AgentAdminView/AgentAdminView.Container';
import WorkerUtil from './utils/WorkerUtil';
import { Actions as WorkerActions } from './states/WorkerListState';

import { PLUGIN_NAME } from './utils/constants';

export default class AgentAdminPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);
    
    const { roles } = manager.user;
    if (roles.indexOf("admin") >= 0) {
      console.log(PLUGIN_NAME, 'Flex User is Admin');
      //Agent Admin side nav button and new view
      flex.SideNav.Content.add(
        <AgentAdminViewNavButton key="agent-admin-sidenav-button" />, { sortOrder: 2 }
      );

      flex.ViewCollection.Content.add(
        <View name="agent-admin-view" key="agent-admin-view">
          <AgentAdminViewContainer key="worker-list-view" />
        </View>
      );

    }
    let workers = await WorkerUtil.getWorkers();
    console.log(PLUGIN_NAME, 'Workers data: ', workers);
    manager.store.dispatch(WorkerActions.setWorkers(workers));

  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
