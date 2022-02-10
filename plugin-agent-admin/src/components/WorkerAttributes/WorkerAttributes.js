import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, Manager, SidePanel } from '@twilio/flex-ui';

import {
  Button,
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
  team_name: '',
  department: '',
  location: ''
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
      this.setState({
        team_name: this.props.worker.attributes.team_name || '' ,
        department: this.props.worker.attributes.department || '',
        location: this.props.worker.attributes.location || ''

      })
    }
  }
  changeTeam = e => {
    const value = e.target.value;
    this.setState({ team_name: value });
  }
  changeDept = e => {
    const value = e.target.value;
    this.setState({ department: value });
  }
  changeLocation = e => {
    const value = e.target.value;
    this.setState({ location: value });
  }
  saveWorkerAttributes = async () => {
    const workerSid = this.props.worker && this.props.worker.sid;
    //Only save if worker was selected
    if (workerSid) {
      console.log(PLUGIN_NAME, 'WorkerSid:', workerSid);
      let updatedAttr = {
        team_name: this.state.team_name,
        department: this.state.department,
        location: this.state.location
      };
      console.log(PLUGIN_NAME, 'Updated Worker Attr:', updatedAttr);
      await WorkerUtil.updateWorker(workerSid, updatedAttr);
      //Refresh redux
      let workers = await WorkerUtil.getWorkers();
      const manager = Manager.getInstance();
      manager.store.dispatch(WorkerActions.setWorkers(workers));

      this.handleClose();
    }
  }


  render() {
    const { worker } = this.props;
    return (

      <SidePanel
        displayName="AgentAttributesPanel"
        className="agentAttrPanel"
        title={<div>Agent Attributes</div>}
        isHidden={!this.props.isOpen}
        handleCloseClick={this.handleClose}
      >
        <div>
          Please update the attributes for {worker?.attributes?.full_name || "Agent"}
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Attribute </TableCell>
              <TableCell> Value </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key='team'>
              <TableCell> Team </TableCell>
              <TableCell>
                <TextField id='team-value' value={this.state.team_name} onChange={this.changeTeam} />
              </TableCell>
            </TableRow>
            <TableRow key='dept'>
              <TableCell> Department </TableCell>
              <TableCell>
                <TextField id='department-value' value={this.state.department} onChange={this.changeDept} />
              </TableCell>
            </TableRow>
            <TableRow key='location'>
              <TableCell> Location </TableCell>
              <TableCell>
                <TextField id='location-value' value={this.state.location} onChange={this.changeLocation} />
              </TableCell>
            </TableRow>
          </TableBody>

        </Table>

        <Button
          id="saveButton"
          onClick={this.saveWorkerAttributes}
          color="primary"
        >
          Save
        </Button>


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
