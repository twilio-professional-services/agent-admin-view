import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Actions, withTheme, Manager, SidePanel } from '@twilio/flex-ui';
import { Theme } from '@twilio-paste/core/theme';
import { Button, Input, Text, Heading, Flex, Box, Label, Table, THead, TBody, Th, Tr, Td } from "@twilio-paste/core";

import WorkerUtil from '../../utils/WorkerUtil';
import { Actions as WorkerActions, ACTION_SET_WORKERS } from '../../states/WorkerListState';
import FormRow from './FormRow';
const PLUGIN_NAME = 'AgentAdminPlugin';

const WorkerAttributes = ({ worker, resetWorker }) => {
  const [changed, setChanged] = useState(false);
  const [agentId, setAgentId] = useState('');
  const [managerName, setManagerName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [location, setLocation] = useState('');
  const [agentAttr1, setAgentAttr1] = useState('');

  const isOpen = useSelector(
    state => {
      const componentViewStates = state.flex.view.componentViewStates;
      const dialogState = componentViewStates && componentViewStates.WorkerAttributes;
      return dialogState && dialogState.isOpen;
    }
  );

  useEffect(() => {
    //console.log(PLUGIN_NAME, 'useEffect to update state from worker:', worker);
    if (worker) {
      setAgentId(worker.attributes.agent_id || '');
      setManagerName(worker.attributes.manager || '');
      setTeamId(worker.attributes.team_id || '');
      setTeamName(worker.attributes.team_name || '');
      setDepartmentId(worker.attributes.department_id || '');
      setDepartmentName(worker.attributes.department_name || '');
      setLocation(worker.attributes.location || '');
      setAgentAttr1(worker.attributes.agent_attribute_1 || '');
    }
    //No return cleanup function
  }, [worker]);


  const handleClose = () => {
    //Clear selectedWorker from parent component
    resetWorker();
    Actions.invokeAction('SetComponentState', {
      name: 'WorkerAttributes',
      state: { isOpen: false }
    });
  }

  const handleChange = e => {
    console.log('change event ', e.target);
    const value = e.target.value;
    //Text Field id needs to match State property
    const id = e.target.id;
    setChanged(true);
    switch (id) {
      case 'agent_id':
        setAgentId(value);
        break;
      case 'manager_name':
        setManagerName(value);
        break;
      case 'team_id':
        setTeamId(value);
        break;
      case 'team_name':
        setTeamName(value);
        break;
      case 'department_id':
        setDepartmentId(value);
        break;
      case 'department_name':
        setDepartmentName(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'agent_attribute_1':
        setAgentAttr1(value);
        break;
    }

  }

  const saveWorkerAttributes = async () => {
    const workerSid = worker && worker.sid;
    //Only save if worker was selected
    if (workerSid) {
      console.log(PLUGIN_NAME, 'WorkerSid:', workerSid);
      let updatedAttr = {
        agent_id: agentId,
        manager: managerName,
        team_id: teamId,
        team_name: teamName,
        department_id: departmentId,
        department_name: departmentName,
        agent_attribute_1: agentAttr1,
        location
      };
      console.log(PLUGIN_NAME, 'Updated Worker Attr:', updatedAttr);
      await WorkerUtil.updateWorker(workerSid, updatedAttr);
      //Refresh redux
      let workers = await WorkerUtil.getWorkers();
      Manager.getInstance().store.dispatch(WorkerActions.setWorkers(workers));

      handleClose();
    }
  }

  return (
    <Theme.Provider theme="flex">
      <SidePanel
        displayName="AgentAttributesPanel"
        className="agentAttrPanel"
        title={<div>Agent Attributes</div>}
        isHidden={!isOpen}
        handleCloseClick={handleClose}
      >
        <Box overflow='auto' height='auto' maxHeight='600px'>
          <Flex vertical padding="space40" grow>
            <Table>
              <THead>
                <Tr>
                  <Th> Attribute </Th>
                  <Th> Value </Th>
                </Tr>
              </THead>
              <TBody>
                <Tr key='agent_name'>
                  <Td>
                    <Label> Name </Label>
                  </Td>
                  <Td>
                    {worker?.attributes?.full_name || worker?.friendlyName || "Agent"}
                  </Td>
                </Tr>
                <FormRow id="agent_id" label="Agent Id" value={agentId} onChangeHandler={handleChange} />
                <FormRow id="manager_name" label="Manager" value={managerName} onChangeHandler={handleChange} />
                <FormRow id="team_id" label="Team Id" value={teamId} onChangeHandler={handleChange} />
                <FormRow id="team_name" label="Team Name" value={teamName} onChangeHandler={handleChange} />
                <FormRow id="department_id" label="Dept. Id" value={departmentId} onChangeHandler={handleChange} />
                <FormRow id="department_name" label="Dept. Name" value={departmentName} onChangeHandler={handleChange} />
                <FormRow id="location" label="Location" value={location} onChangeHandler={handleChange} />
                <FormRow id="agent_attribute_1" label="Custom 1" value={agentAttr1} onChangeHandler={handleChange} />
              
                <Tr key='button'>
                  <Td />
                  <Td>
                    <Button
                      id="saveButton"
                      onClick={saveWorkerAttributes}
                      disabled={!changed}
                    >
                      Save
                    </Button>
                  </Td>
                </Tr>
              </TBody>
            </Table>

          </Flex>
        </Box>
      </SidePanel >

    </Theme.Provider >
  );
}

export default withTheme(WorkerAttributes);
