import React from 'react';
import { Actions, withTheme, IconButton } from '@twilio/flex-ui';

import {
  Button,
  TableHead,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

import Person from "@material-ui/icons/Person";
import { Worker } from './AgentAdminView.styles';

class AgentAdminView extends React.Component {

  constructor(props) {
    super(props);

  }
  updateWorker = (worker) => {
    Actions.invokeAction('SetComponentState', {
      name: 'WorkerAttributesDialog',
      state: { isOpen: true, worker }
    });
    
  }

  render() {
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Select </TableCell>

              <TableCell>Worker Name</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Dept.</TableCell>
              <TableCell>Location</TableCell>
              <TableCell> Action </TableCell>
            </TableRow>

          </TableHead>
          <TableBody>
            {this.props.workers.map((wk) => (

              <TableRow key={wk.sid}>
                <TableCell>

                  <Person
                    title='Update Agent'
                    onClick={() => {
                      // do stuff
                    }}
                  />

                </TableCell>

                <TableCell><Worker> {wk.friendlyName} </Worker></TableCell>
                <TableCell><Worker> {wk.attributes.full_name} </Worker></TableCell>
                <TableCell><Worker>{wk.attributes.team_name} </Worker></TableCell>
                <TableCell><Worker> {wk.attributes.department} </Worker></TableCell>
                <TableCell><Worker> {wk.attributes.location} </Worker></TableCell>

                <TableCell>
                  <Button
                    onClick={() => {
                      this.updateWorker(wk);
                    }}
                  > Update </Button>

                </TableCell>

              </TableRow>))}

          </TableBody>

        </Table>
      </div>
    );
  };
}

export default AgentAdminView;
