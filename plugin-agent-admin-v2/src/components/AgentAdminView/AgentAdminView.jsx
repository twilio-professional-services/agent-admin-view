import React from 'react';
import { Actions, withTheme, IconButton, FlexBox } from '@twilio/flex-ui';

import { Theme } from '@twilio-paste/core/theme';
import { Button, Input, Flex, Box, Label, Text, TextArea, Table, THead, TBody, Th, Tr, Td } from "@twilio-paste/core";

import { EditIcon } from "@twilio-paste/icons/esm/EditIcon";

import {
  TableSortLabel
} from "@material-ui/core";

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
      <Theme.Provider theme="flex">
        <Box overflow='auto' maxHeight= '100%'>
        <Flex>
          <Table>
            <THead>
              <Tr>
                <Th>
                  Worker Name
                </Th>
                <Th>
                  <TableSortLabel
                    active
                    direction={nameSortValue}
                    onClick={this.updateNameSort}
                  >
                    Full Name
                  </TableSortLabel>
                </Th>
                <Th>
                  <Flex width='size20' vAlignContent="center">
                    <Label htmlFor="team_filter"> Team: &nbsp; </Label>
                    <Flex width='size10'>
                      <Input id="team_filter"
                        type="text"
                        size="small"
                        label="Team"
                        value={teamFilterValue}
                        onChange={this.updateTeamFilter}
                      /></Flex>
                  </Flex>
                </Th>
                <Th>Dept.</Th>
                <Th>Location</Th>
                <Th>
                  <Flex width='size20' vAlignContent="center">
                    <Label htmlFor="skills_filter"> Skills: &nbsp; </Label>
                    <Flex width='size10'>
                      <Input id="skills_filter"
                        type="text"
                        size="small"
                        label="Skills"
                        value={skillsFilterValue}
                        onChange={this.updateSkillsFilter}
                      />
                    </Flex>
                  </Flex>
                </Th>
                <Th> Action </Th>
              </Tr>
            </THead>
            <TBody>
              {sortedWorkers.map((wk) => (
                <Tr key={wk.sid}>
                  <Td> {wk.friendlyName} </Td>
                  <Td> {wk.attributes.full_name} </Td>
                  <Td>{wk.attributes.team_name} </Td>
                  <Td> {wk.attributes.department_name} </Td>
                  <Td> {wk.attributes.location} </Td>
                  <Td> {wk.attributes.skillsString} </Td>
                  <Td>
                    <Button variant="primary_icon"
                      onClick={() => {
                        this.updateWorker(wk);
                      }}
                    > <EditIcon decorative={false} title="Update" /> </Button>
                  </Td>
                </Tr>))}
            </TBody>
          </Table>


          <WorkerAttributes key="worker-attributes" worker={this.state.selectedWorker} resetWorker={this.resetWorker} />
        </Flex>
        </Box>
      </Theme.Provider>
    );
  };
}

export default AgentAdminView;
