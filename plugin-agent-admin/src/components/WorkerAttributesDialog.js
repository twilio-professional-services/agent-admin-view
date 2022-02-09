import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, Manager, withTaskContext } from '@twilio/flex-ui';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import WorkerUtil from '../utils/WorkerUtil';
import { Actions as WorkerActions } from '../states/WorkerListState';

const PLUGIN_NAME = 'AgentAdminPlugin';

const INITIAL_STATE = {
  team: '',
  department: '',
  teams: ['East', 'West', 'Central', 'EMEA', 'APAC'],
  departments: ['ProServ', 'Support', 'Sales', 'Engineering', 'Project Management']
}

class WorkerAttributesDialog extends React.Component {
  state = INITIAL_STATE;

  handleClose = () => {
    this.closeDialog();
  }

  closeDialog = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'WorkerAttributesDialog',
      state: { isOpen: false, worker: undefined }
    });
  }

  changeTeam = e => {
    const value = e.target.value;
    this.setState({ team: value });
  }
  changeDept = e => {
    const value = e.target.value;
    this.setState({ department: value });
  }

  saveWorkerAttributes = async () => {
    const workerSid = this.props.worker.sid;
    console.log(PLUGIN_NAME, 'WorkerSid:', workerSid);
    let updatedAttr = {
      team_name: this.state.team,
      department: this.state.department
     };
    console.log(PLUGIN_NAME, 'Updated Worker Attr:', updatedAttr);
    await WorkerUtil.updateWorker(workerSid, updatedAttr);
    //Refresh redux
    let workers = await WorkerUtil.getWorkers();
    const manager = Manager.getInstance();
    manager.store.dispatch(WorkerActions.setWorkers(workers));


    this.setState(INITIAL_STATE);
    this.closeDialog();
  }
  

  render() {
    return (
      <Dialog
        open={this.props.isOpen || false}
        onClose={this.handleClose}
      >
        <DialogContent>
          <DialogContentText>
            Please update the attributes for {this.props?.worker?.attributes?.full_name || "Agent"}
            </DialogContentText>
            <br /> <br />
            Team: &nbsp;
            <Select value={this.state.team} onChange={this.changeTeam} name="team">
              <MenuItem value=''>Select Team</MenuItem>
              {this.state.teams.map((option) => (
                <MenuItem key={option} value={option} > {option} </MenuItem>
              ))}
            </Select>
            <br /> <br />
            Department: &nbsp;
            <Select value={this.state.department} onChange={this.changeDept} name="department">
              <MenuItem value=''>Select Department</MenuItem>
              {this.state.departments.map((option) => (
                <MenuItem key={option} value={option} > {option} </MenuItem>
              ))}
            </Select>
          
        </DialogContent>

        <DialogActions>
          <Button
            onClick={this.saveWorkerAttributes}
            color="primary"
          >
            Save
          </Button>

        </DialogActions>
      </Dialog>
    );
  }
}
//inject workers from state into props
const mapStateToProps = state => {
  const componentViewStates = state.flex.view.componentViewStates;
  const dialogState = componentViewStates && componentViewStates.WorkerAttributesDialog;
  const isOpen = dialogState && dialogState.isOpen;
  const worker = dialogState && dialogState.worker;
  
  return {
    isOpen,
    worker,
  };
};

export default connect(mapStateToProps)(withTheme(WorkerAttributesDialog));
