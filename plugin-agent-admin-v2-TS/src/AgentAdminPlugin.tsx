import * as Flex from '@twilio/flex-ui';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import reducers, { namespace } from './states';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import RegisterNotifications from './notifications';
import CustomizeFlexComponents from './components';

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
    RegisterNotifications(manager);
    await CustomizeFlexComponents(manager);
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
