import React from 'react';
import { Actions, withTheme, IconButton, FlexBox } from '@twilio/flex-ui';

import {
  Button,
  TableHead,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TextField
} from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import { Worker, FilterTextField, TableHeaderCell } from './AgentAdminView.styles';
import WorkerAttributes from '../WorkerAttributes/WorkerAttributes';

const INITIAL_STATE = {
  selectedWorker: undefined
};

class AgentAdminView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedWorker: undefined,
      sort: { name: "asc" },
      filters: { team: "", skills: "" }
    }

  }
  updateWorker = (worker) => {
    this.setState({ selectedWorker: worker });
    Actions.invokeAction('SetComponentState', {
      name: 'WorkerAttributes',
      state: { isOpen: true }
    });

  }

  resetWorker = () => {
    this.setState(INITIAL_STATE);

  }


  updateTeamFilter = (e) => {
    const teamFilter = e.target.value.replace(/\s/g, "");
    this.setState({ filters: { ...this.state.filters, team: teamFilter } });
  };

  filterTeam = (worker) => {
    return (!this.state.filters.team ||
      !worker.attributes.team_name ||
      worker.attributes.team_name.includes(this.state.filters.team));
  }

  updateSkillsFilter = (e) => {
    const skillsFilter = e.target.value.replace(/\s/g, "");
    this.setState({ filters: { ...this.state.filters, skills: skillsFilter } });
  };

  filterSkills = (worker) => {
    return (!this.state.filters.skills ||
      !worker.attributes.skillsString ||
      worker.attributes.skillsString.includes(this.state.filters.skills));
  }

  updateNameSort = (e) => {
    const newSortOrder = this.state.sort.name === "asc" ? "desc" : "asc";
    this.setState({
      sort: { ...this.state.sort, name: newSortOrder },
    });
  };

  sortName = (v1, v2) => {
    const result =
      this.state.sort.name === "asc"
        ? v1.attributes.full_name < v2.attributes.full_name ? 1 : -1
        : v1.attributes.full_name > v2.attributes.full_name ? 1 : -1;
    return result;
  };

  render() {
    const nameSortValue = this.state.sort.name;
    const { teamFilterValue, skillsFilterValue } = this.state.filters;

    const sortedWorkers = this.props.workers
      .filter(this.filterTeam)
      .filter(this.filterSkills)
      .sort(this.sortName);
      
    console.log("workers", sortedWorkers);
    return (
      <FlexBox>
        <FlexBox vertical>
        <Paper elevation={0} style={{ maxHeight: '100%', overflow: 'auto', margin: '6px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>
                  Worker Name
                </TableHeaderCell>
                <TableHeaderCell>
                  <TableSortLabel
                    active
                    direction={nameSortValue}
                    onClick={this.updateNameSort}
                  >
                    Full Name
                  </TableSortLabel>
                </TableHeaderCell>
                <TableHeaderCell>
                  <FilterTextField
                    size="small"
                    label="Team"
                    value={teamFilterValue}
                    onChange={this.updateTeamFilter}
                  />
                </TableHeaderCell>
                <TableHeaderCell>Dept.</TableHeaderCell>
                <TableHeaderCell>Location</TableHeaderCell>
                <TableHeaderCell>
                <FilterTextField
                    size="small"
                    label="Skills"
                    value={skillsFilterValue}
                    onChange={this.updateSkillsFilter}
                  />
                  </TableHeaderCell>
                <TableHeaderCell> Action </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedWorkers.map((wk) => (
                <TableRow key={wk.sid}>
                  <TableCell><Worker> {wk.friendlyName} </Worker></TableCell>
                  <TableCell><Worker> {wk.attributes.full_name} </Worker></TableCell>
                  <TableCell><Worker>{wk.attributes.team_name} </Worker></TableCell>
                  <TableCell><Worker> {wk.attributes.department_name} </Worker></TableCell>
                  <TableCell><Worker> {wk.attributes.location} </Worker></TableCell>
                  <TableCell><Worker> {wk.attributes.skillsString} </Worker></TableCell> 
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
          </Paper>
        </FlexBox>

        <WorkerAttributes key="worker-attributes" worker={this.state.selectedWorker} resetWorker={this.resetWorker} />
      </FlexBox>
    );
  };
}

export default AgentAdminView;
