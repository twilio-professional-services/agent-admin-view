import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Actions, withTheme, Manager, SidePanel } from '@twilio/flex-ui';
import { Button, Flex, Box, Table, THead, TBody, Th, Tr, Td } from "@twilio-paste/core";

import WorkerUtil from '../../utils/WorkerUtil';
import { Actions as WorkerActions } from '../../states/reducer';
import FormRowText from './FormRowText';
import FormRowSelect from './FormRowSelect';

import { PLUGIN_NAME, teams, departments } from '../../utils/constants';
import { AppState, WorkerItem } from '../../states/types';

interface OwnProps {
  worker: WorkerItem | undefined,
  resetWorker: () => void
}

const UpdateWorkerPanel = ({ worker, resetWorker }: OwnProps) => {
  const [changed, setChanged] = useState(false);
  const [fullName, setFullName] = useState('');
  const [agentId, setAgentId] = useState('');
  const [managerName, setManagerName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [location, setLocation] = useState('');
  const [agentAttr1, setAgentAttr1] = useState('');

  const isOpen = useSelector(
    (state: AppState) => {
      const componentViewStates = state.flex.view.componentViewStates;
      const dialogState = componentViewStates && componentViewStates.WorkerAttributes;
      return dialogState && dialogState.isOpen;
    }
  );

  useEffect(() => {
    //console.log(PLUGIN_NAME, 'useEffect to update state from worker:', worker);
    if (worker) {
      setFullName(worker.attributes.full_name || '');
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

  //For text input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('change event ', e.target);
    const value = e.target.value;
    //Text Field id needs to match State property
    const id = e.target.id;
    setChanged(true);
    switch (id) {
      case 'full_name':
        setFullName(value);
        break;
      case 'agent_id':
        setAgentId(value);
        break;
      case 'manager_name':
        setManagerName(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'agent_attribute_1':
        setAgentAttr1(value);
        break;
    }

  }

  // See the notes in our Flex insights docs
  // https://www.twilio.com/docs/flex/developer/insights/enhance-integration
  //    The team_id attribute is required to display team_name.
  //    The department_id attribute is required to display department_name.
  //
  // Because of the above it's easier to simply set team_id/name to the same values
  // and similarly to set department_id/name to the same values


  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChanged(true);
    const team = e.target.value;
    //Store team in both team_id and team_name for consistent reporting
    setTeamId(team);
    setTeamName(team);
  }

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChanged(true);
    const dept = e.target.value;
    //Store dept in both department_id and department_name for consistent reporting
    setDepartmentId(dept);
    setDepartmentName(dept);
  }

  const saveWorkerAttributes = async () => {
    const workerSid = worker && worker.sid;
    //Only save if worker was selected
    if (workerSid) {
      console.log(PLUGIN_NAME, 'WorkerSid:', workerSid);
      let updatedAttr = {
        full_name: fullName,
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
      <SidePanel
        displayName="AgentAttributesPanel"
        className="agentAttrPanel"
        title={<div>Agent Attributes</div>}
        isHidden={!isOpen}
        handleCloseClick={handleClose}
      >
        <Box overflow='auto' height='auto' maxHeight='600px'>
          <Flex vertical padding="space20" grow>
            <Table variant="borderless">
              <THead>
                <Tr>
                  <Th> Attribute </Th>
                  <Th> Value </Th>
                </Tr>
              </THead>
              <TBody>
                <Tr key='agent_name'>
                  <Td>
                    Name
                  </Td>
                  <Td>
                    {worker?.friendlyName || "Agent"}
                  </Td>
                </Tr>
                <FormRowText id="full_name" label="Full Name" value={fullName} onChangeHandler={handleChange} />
                <FormRowText id="agent_id" label="Agent Id" value={agentId} onChangeHandler={handleChange} />
                <FormRowText id="manager_name" label="Manager" value={managerName} onChangeHandler={handleChange} />
              
                <FormRowSelect 
                  id="team_name" 
                  label="Team" 
                  value={teamName} 
                  options={teams}
                  onChangeHandler={handleTeamChange} />

                <FormRowSelect 
                  id="department_name" 
                  label="Dept." 
                  value={departmentName} 
                  options={departments}
                  onChangeHandler={handleDeptChange} />

                <FormRowText id="location" label="Location" value={location} onChangeHandler={handleChange} />
                <FormRowText id="agent_attribute_1" label="Custom 1" value={agentAttr1} onChangeHandler={handleChange} />

                <Tr key='button'>
                  <Td />
                  <Td>
                    <Button
                      variant="primary" size="small"
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

  );
}

export default withTheme(UpdateWorkerPanel);
