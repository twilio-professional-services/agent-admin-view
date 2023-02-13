import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Actions, withTheme, IconButton } from '@twilio/flex-ui';
import { Theme } from '@twilio-paste/core/theme';
import { Button, Input, Flex, Box, Label, Table, THead, TBody, Th, Tr, Td } from "@twilio-paste/core";

import { EditIcon } from "@twilio-paste/icons/esm/EditIcon";

import {
  TableSortLabel
} from "@material-ui/core";

import WorkerAttributes from '../WorkerAttributes/WorkerAttributes';

const AgentAdminView = () => {
  const [selectedWorker, setSelectedWorker] = useState('');
  const [sort, setSort] = useState({ name: "asc" })
  const [teamFilterValue, setTeamFilterValue] = useState('');
  const [skillsFilterValue, setSkillsFilterValue] = useState('');

  const workers = useSelector(
    state => { return state['agent-admin']?.workerList?.workers || [] }
  );

  const openEditWorkerAttr = (worker) => {
    setSelectedWorker(worker);
    Actions.invokeAction('SetComponentState', {
      name: 'WorkerAttributes',
      state: { isOpen: true }
    });

  }

  const resetWorker = () => {
    setSelectedWorker('');
  }

  const updateTeamFilter = (e) => {
    const teamFilter = e.target.value.replace(/\s/g, "");
    setTeamFilterValue(teamFilter);
  };

  const filterByTeam = (worker) => {
    return (!teamFilterValue || !worker.attributes.team_name ||
      worker.attributes.team_name.includes(teamFilterValue));
  }

  const updateSkillsFilter = (e) => {
    const skillsFilter = e.target.value.replace(/\s/g, "");
    setSkillsFilterValue(skillsFilter);
  };

  const filterBySkills = (worker) => {
    return (!skillsFilterValue || !worker.attributes.skillsString ||
      worker.attributes.skillsString.includes(skillsFilterValue));
  }

  const updateNameSort = (e) => {
    const newSortOrder = sort.name === "asc" ? "desc" : "asc";
    setSort({ name: newSortOrder });
  };

  const sortByName = (v1, v2) => {
    const result =
      sort.name === "asc"
        ? v1.attributes.full_name < v2.attributes.full_name ? 1 : -1
        : v1.attributes.full_name > v2.attributes.full_name ? 1 : -1;
    return result;
  };

  const nameSortValue = sort.name;

  let sortedWorkers = [];
  if (workers && workers.length > 1) {
    sortedWorkers = workers
      .filter(filterByTeam)
      .filter(filterBySkills)
      .sort(sortByName);
  }

  return (
    <Theme.Provider theme="flex">
      <Box overflow='auto' maxHeight='100%'>
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
                    onClick={updateNameSort}
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
                        onChange={updateTeamFilter}
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
                        onChange={updateSkillsFilter}
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
                        openEditWorkerAttr(wk);
                      }}
                    > <EditIcon decorative={false} title="Update" /> </Button>
                  </Td>
                </Tr>))}
            </TBody>
          </Table>


          <WorkerAttributes key="worker-attributes" worker={selectedWorker} resetWorker={resetWorker} />
        </Flex>
      </Box>
    </Theme.Provider>
  );
};
//}

export default AgentAdminView;
