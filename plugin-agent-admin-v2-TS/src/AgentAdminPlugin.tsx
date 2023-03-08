import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { VERSION, View } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import reducers, { namespace } from './states';
import { CustomizationProvider } from '@twilio-paste/core/customization';

import AgentAdminViewNavButton from './components/AgentAdminViewNavButton';
import AgentAdminView from './components/AgentAdminView/AgentAdminView';
import WorkerUtil from './utils/WorkerUtil';
import { Actions as WorkerActions } from './states/reducer';

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
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider,
    });
    
    this.registerReducers(manager);
    
    const { roles } = manager.user;
    if (roles.indexOf("admin") >= 0) {
      console.log(PLUGIN_NAME, 'Flex User is Admin');
      //Agent Admin side nav button and new view
      flex.SideNav.Content.add(
        <AgentAdminViewNavButton viewName="agent-admin-view" activeView="agent-desktop" key="agent-admin-sidenav-button" />, { sortOrder: 2 }
      );

      flex.ViewCollection.Content.add(
        <View name="agent-admin-view" key="agent-admin-view">
          <AgentAdminView key="worker-list-view" />
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
  registerReducers(manager: Flex.Manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
