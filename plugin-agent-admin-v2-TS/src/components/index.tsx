import * as Flex from "@twilio/flex-ui";
import { View } from '@twilio/flex-ui';
import AgentAdminViewNavButton from '../components/AgentAdminViewNavButton';
//Sidepanel has TypeScript issue (with Node 14). Use Paste Side Modal instead
//import AgentAdminView from './components/AgentAdminView/AgentAdminView';
import AgentAdminViewWithSideModal from '../components/AgentAdminView/AgentAdminViewWithSideModal';
import WorkerUtil from '../utils/WorkerUtil';
import { Actions as WorkerActions } from '../states/reducer';
import { PLUGIN_NAME } from '../utils/constants';

export default async(manager: Flex.Manager) => {
  
    const { roles } = manager.user;
    if (roles.indexOf("admin") >= 0) {
      console.log(PLUGIN_NAME, 'Flex User is Admin');
      //Agent Admin side nav button and new view
      Flex.SideNav.Content.add(
        <AgentAdminViewNavButton viewName="agent-admin-view" activeView="agent-desktop" key="agent-admin-sidenav-button" />, { sortOrder: 2 }
      );

      Flex.ViewCollection.Content.add(
        <View name="agent-admin-view" key="agent-admin-view">
          <AgentAdminViewWithSideModal key="worker-list-view" />
        </View>
      );
      let workers = await WorkerUtil.getWorkers();
      console.log(PLUGIN_NAME, 'Workers data: ', workers);
      manager.store.dispatch(WorkerActions.setWorkers(workers));
    }
    
  }