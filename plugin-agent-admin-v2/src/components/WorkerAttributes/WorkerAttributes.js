import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, Manager, SidePanel } from '@twilio/flex-ui';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@twilio-paste/core/theme';
import { Button, Input, Text, Heading, Flex, Label, Table, THead, TBody, Th, Tr, Td } from "@twilio-paste/core";

import WorkerUtil from '../../utils/WorkerUtil';
import { Actions as WorkerActions } from '../../states/WorkerListState';

const PLUGIN_NAME = 'AgentAdminPlugin';

const INITIAL_STATE = {
  agent_id: '',
  manager: '',
  team_id: '',
  team_name: '',
  department_id: '',
  department_name: '',
  location: '',
  agent_attribute_1: '',
  changed: false
}
//NEW SidePanel
class WorkerAttributes extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE
  }

  handleClose = () => {
    this.setState(INITIAL_STATE);
    //Clear selectedWorker from parent component
    this.props.resetWorker();
    this.closeDialog();
  }

  closeDialog = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'WorkerAttributes',
      state: { isOpen: false }
    });
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.worker && this.props.worker !== prevProps.worker) {
      //Init state from worker
      const wk = this.props.worker;
      this.setState({
        agent_id: wk.attributes.agent_id || '',
        manager: wk.attributes.manager || '',
        team_id: wk.attributes.team_id || '',
        team_name: wk.attributes.team_name || '',
        department_id: wk.attributes.department_id || '',
        department_name: wk.attributes.department_name || '',
        location: wk.attributes.location || '',
        agent_attribute_1: wk.attributes.agent_attribute_1 || ''
      })
    }
  }

  handleChange = e => {
    console.log('change event ', e.target);
    const value = e.target.value;
    //Text Field id needs to match State property
    const id = e.target.id;
    let newState = { changed: true };
    newState[id] = value;
    this.setState(newState);
  }

  saveWorkerAttributes = async () => {
    const workerSid = this.props.worker && this.props.worker.sid;
    //Only save if worker was selected
    if (workerSid) {
      console.log(PLUGIN_NAME, 'WorkerSid:', workerSid);
      const { agent_id, manager, team_id, team_name,
        department_id, department_name, location, agent_attribute_1 } = this.state;
      let updatedAttr = {
        agent_id,
        manager,
        team_id,
        team_name,
        department_id,
        department_name,
        agent_attribute_1,
        location
      };
      console.log(PLUGIN_NAME, 'Updated Worker Attr:', updatedAttr);
      await WorkerUtil.updateWorker(workerSid, updatedAttr);
      //Refresh redux
      let workers = await WorkerUtil.getWorkers();
      Manager.getInstance().store.dispatch(WorkerActions.setWorkers(workers));

      this.handleClose();
    }
  }


  render() {
    const { isOpen, worker } = this.props;
    const { changed, agent_id, manager, team_id, team_name,
      department_id, department_name, location, agent_attribute_1 } = this.state;
    return (
      <Theme.Provider theme="flex">
        <SidePanel
          displayName="AgentAttributesPanel"
          className="agentAttrPanel"
          title={<div>Agent Attributes</div>}
          isHidden={!isOpen}
          handleCloseClick={this.handleClose}
        >
          <Paper elevation={2} style={{ height: 'auto', maxHeight: 600, overflow: 'auto' }}>
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
                  {worker?.attributes?.full_name || "Agent"}
                  </Td>
                </Tr>

                <Tr key='agent_id'>
                  <Td>
                    <Label htmlFor="agent_id"> Agent ID </Label>
                  </Td>
                  <Td>
                    <Input id='agent_id' value={agent_id} onChange={this.handleChange} />
                  </Td>
                </Tr>
                <Tr key='manager'>
                  <Td>
                    <Label htmlFor="manager"> Manager </Label>
                  </Td>
                  <Td>
                    <Input id='manager' value={manager} onChange={this.handleChange} />
                  </Td>
                </Tr>
                <Tr key='team_id'>
                  <Td>
                    <Label htmlFor="team_id"> Team ID </Label>
                  </Td>
                  <Td>
                    <Input id='team_id' value={team_id} onChange={this.handleChange} />
                  </Td>
                </Tr>
                <Tr key='team_name'>
                  <Td>
                    <Label htmlFor="team_name"> Team Name </Label>
                  </Td>
                  <Td>
                    <Input id='team_name' value={team_name} onChange={this.handleChange} />
                  </Td>
                </Tr>
                <Tr key='department_id'>
                  <Td>
                    <Label htmlFor="department_id"> Country (Dept. ID) </Label>
                  </Td>
                  <Td>
                    <Input id='department_id' value={department_id} onChange={this.handleChange} />
                  </Td>
                </Tr>
                <Tr key='department_name'>
                  <Td>
                    <Label htmlFor="department_name"> Department Name </Label>
                  </Td>
                  <Td>
                    <Input id='department_name' value={department_name} onChange={this.handleChange} />
                  </Td>
                </Tr>
                <Tr key='location'>
                  <Td>
                    <Label htmlFor="location"> Location </Label>
                  </Td>
                  <Td>
                    <Input id='location' value={location} onChange={this.handleChange} />
                  </Td>
                </Tr>
                <Tr key='agent_attribute_1'>
                  <Td>
                    <Label htmlFor="agent_attribute_1"> Custom 1 </Label>
                  </Td>
                  <Td>
                    <Input id='agent_attribute_1' value={agent_attribute_1} onChange={this.handleChange} />
                  </Td>
                </Tr>


                <Tr key='button'>
                  <Td />
                  <Td>
                    <Button
                      id="saveButton"
                      onClick={this.saveWorkerAttributes}
                      disabled={!changed}
                    >
                      Save
                    </Button>
                  </Td>
                </Tr>
              </TBody>
            </Table>

          </Flex>
          </Paper>
        </SidePanel >
       
      </Theme.Provider >

    );
  }
}

const mapStateToProps = state => {
  const componentViewStates = state.flex.view.componentViewStates;
  const dialogState = componentViewStates && componentViewStates.WorkerAttributes;
  const isOpen = dialogState && dialogState.isOpen;
  return {
    isOpen
  };
};

export default connect(mapStateToProps)(withTheme(WorkerAttributes));
