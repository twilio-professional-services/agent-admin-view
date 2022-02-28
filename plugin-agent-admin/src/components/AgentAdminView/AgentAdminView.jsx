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

import { Worker, FilterTextField, TableHeaderCell } from './AgentAdminView.styles';
import WorkerAttributes from '../WorkerAttributes/WorkerAttributes';

const INITIAL_STATE = {
  selectedWorker: undefined,
  sort: { name: "asc" },
  filters: { team: "" }
};

class AgentAdminView extends React.Component {

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE

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


  updateNameSort = (e) => {
    const newSortOrder = this.state.sort.name === "asc" ? "desc" : "asc";
    this.setState({
      sort: { ...this.state.sort, name: newSortOrder },
    });
  };

  sortName = (v1, v2) => {
    const result =
      this.state.sort.name === "asc"
        ? v1.full_name < v2.full_name ? 1 : -1
        : v1.full_name > v2.full_name ? 1 : -1;
    return result;
  };

  getSkillsString = (worker) => {
    if (!worker.attributes.routing || !worker.attributes.routing.skills) return "NONE";
    const skills = worker.attributes.routing.skills;
    const levels = worker.attributes.routing.levels;
    let str = "";
    if (skills.length==0) return "NONE";
    for (let i = 0; i < skills.length; i++) {
      let skill = skills[i];
      str += skill;
      if (levels) {
        let lvl = levels[skill];
        if (lvl) str = str + "(" + lvl + ")";
      }
      if (i < skills.length - 1) str += " / ";
    }
    return str;
  }

  render() {
    const nameSortValue = this.state.sort.name;
    const teamFilterValue = this.state.filters.team;

    const sortedWorkers = this.props.workers
      .sort(this.sortName)
      .filter(this.filterTeam);

    return (
      <FlexBox>
        <FlexBox vertical>

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
                <TableHeaderCell>Skills</TableHeaderCell>
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
                  <TableCell><Worker> {this.getSkillsString(wk)} </Worker></TableCell>
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
        </FlexBox>

        <WorkerAttributes key="worker-attributes" worker={this.state.selectedWorker} resetWorker={this.resetWorker} />
      </FlexBox>
    );
  };
}

export default AgentAdminView;
