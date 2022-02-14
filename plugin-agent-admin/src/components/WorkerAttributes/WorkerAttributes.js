import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, Manager, SidePanel, FlexBox } from '@twilio/flex-ui';
import { Button } from "@twilio/flex-ui-core";
import {
  Container,
  Caption,
  AttributeTableCell,
  AttributeName,
  AttributeTextField,
  ButtonsContainer
} from './WorkerAttributes.styles';

import {
  TableHead,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField
} from "@material-ui/core";

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
    const { isOpen, worker, theme } = this.props;
    const { changed, agent_id, manager, team_id, team_name, 
      department_id, department_name, location, agent_attribute_1 } = this.state;
    return (

      <SidePanel
        displayName="AgentAttributesPanel"
        className="agentAttrPanel"
        title={<div>Agent Attributes</div>}
        isHidden={!isOpen}
        handleCloseClick={this.handleClose}
      >
        <Container vertical>
          <Caption>
            Agent: {worker?.attributes?.full_name || "Agent"}
          </Caption>
          <Table>
            <TableHead>
              <TableRow>
                <AttributeTableCell> Attribute </AttributeTableCell>
                <TableCell> Value </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            <TableRow key='agent_id'>
                <AttributeTableCell>
                  <AttributeName> Agent ID </AttributeName>
                </AttributeTableCell>
                <TableCell>
                  <AttributeTextField id='agent_id' value={agent_id} onChange={this.handleChange} />
                </TableCell>
              </TableRow>
              <TableRow key='manager'>
                <AttributeTableCell>
                  <AttributeName> Manager </AttributeName>
                </AttributeTableCell>
                <TableCell>
                  <AttributeTextField id='manager' value={manager} onChange={this.handleChange} />
                </TableCell>
              </TableRow>
              <TableRow key='team_id'>
                <AttributeTableCell>
                  <AttributeName> Team ID </AttributeName>
                </AttributeTableCell>
                <TableCell>
                  <AttributeTextField id='team_id' value={team_id} onChange={this.handleChange} />
                </TableCell>
              </TableRow>
              <TableRow key='team_name'>
                <AttributeTableCell>
                  <AttributeName> Team Name </AttributeName>
                </AttributeTableCell>
                <TableCell>
                  <AttributeTextField id='team_name' value={team_name} onChange={this.handleChange} />
                </TableCell>
              </TableRow>
              <TableRow key='department_id'>
                <AttributeTableCell>
                  <AttributeName> Country (Dept. ID) </AttributeName>
                </AttributeTableCell>
                <TableCell>
                  <AttributeTextField id='department_id' value={department_id} onChange={this.handleChange} />
                </TableCell>
              </TableRow>
              <TableRow key='department_name'>
                <AttributeTableCell>
                  <AttributeName> Department Name </AttributeName>
                </AttributeTableCell>
                <TableCell>
                  <AttributeTextField id='department_name' value={department_name} onChange={this.handleChange} />
                </TableCell>
              </TableRow>
              <TableRow key='location'>
                <AttributeTableCell>
                  <AttributeName> Location </AttributeName>
                </AttributeTableCell>
                <TableCell>
                  <AttributeTextField id='location' value={location} onChange={this.handleChange} />
                </TableCell>
              </TableRow>
              <TableRow key='agent_attribute_1'>
                <AttributeTableCell>
                  <AttributeName> Custom 1 </AttributeName>
                </AttributeTableCell>
                <TableCell>
                  <AttributeTextField id='agent_attribute_1' value={agent_attribute_1} onChange={this.handleChange} />
                </TableCell>
              </TableRow>
            </TableBody>

          </Table>
          <ButtonsContainer>
            <Button
              id="saveButton"
              onClick={this.saveWorkerAttributes}
              themeOverride={theme.WorkerSkills.SaveButton}
              roundCorners={false}
              disabled={!changed}
            >
              SAVE
            </Button>
          </ButtonsContainer>

        </Container>
      </SidePanel >

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
