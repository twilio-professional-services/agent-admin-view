import React from 'react';
import { SideLink, Actions } from '@twilio/flex-ui';


interface OwnProps {
    activeView?: string;
    viewName: string;
}
const AgentAdminViewNavButton = (props: OwnProps) => {
    function navigate() {
        Actions.invokeAction('NavigateToView', { viewName: props.viewName });
    }

    return (
        <SideLink
            key="Adminview"
            showLabel={true}
            icon="Cogs"
            iconActive="Cogs"
            isActive={props.viewName === props.activeView}
            onClick={navigate} >
            Agent Admin 
        </SideLink>
        
    )
}
export default AgentAdminViewNavButton;