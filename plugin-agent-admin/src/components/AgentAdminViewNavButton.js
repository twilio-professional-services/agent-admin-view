import React from 'react';
import { SideLink, Actions } from '@twilio/flex-ui';
 
const AgentAdminViewNavButton = ({ activeView }) => {
   function navigate() {
       Actions.invokeAction('NavigateToView', { viewName: 'agent-admin-view'});
   }
 
   return (
       <SideLink
       showLabel={true}
       icon="Cogs"
       iconActive="Cogs"
       isActive={activeView === 'agent-admin-view'}
       onClick={navigate}>
       Agent Admin
       </SideLink>
   )
}
export default AgentAdminViewNavButton;