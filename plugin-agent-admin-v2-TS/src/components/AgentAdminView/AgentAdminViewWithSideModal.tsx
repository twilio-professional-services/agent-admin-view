import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Actions, withTheme, IconButton } from '@twilio/flex-ui';
import {
  Button,
  Input,
  Flex,
  Box,
  Label,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  Td
} from "@twilio-paste/core";

import { EditIcon } from "@twilio-paste/icons/esm/EditIcon";
import { AppState, WorkerItem } from '../../states/types';

import {
  TableSortLabel
} from "@material-ui/core";
import { namespace } from '../../states';

type SortDirection = 'asc' | 'desc'

import UpdateWorkerSideModal from '../UpdateWorkerPanel/UpdateWorkerSideModal'

const AgentAdminViewWithSideModal = () => {
  //const [selectedWorker, setSelectedWorker] = useState<WorkerItem | undefined>();
  const [sort, setSort] = useState({ name: "asc" })
  const [teamFilterValue, setTeamFilterValue] = useState('');
  const [skillsFilterValue, setSkillsFilterValue] = useState('');

  const workers = useSelector(
    (state: AppState) => { return state[namespace]?.workerList?.workers || [] }
  );

  const updateTeamFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const teamFilter = e.target.value.replace(/\s/g, "");
    setTeamFilterValue(teamFilter);
  };

  const filterByTeam = (worker: WorkerItem) => {
    return (!teamFilterValue || !worker.attributes.team_name ||
      worker.attributes.team_name.includes(teamFilterValue));
  }

  const updateSkillsFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsFilter = e.target.value.replace(/\s/g, "");
    setSkillsFilterValue(skillsFilter);
  };

  const filterBySkills = (worker: WorkerItem) => {
    return (!skillsFilterValue || !worker.attributes.skillsString ||
      worker.attributes.skillsString.includes(skillsFilterValue));
  }

  const updateNameSort = () => {
    const newSortOrder = sort.name === "asc" ? "desc" : "asc";
    setSort({ name: newSortOrder });
  };

  const sortByName = (v1: WorkerItem, v2: WorkerItem) => {
    const result =
      sort.name === "asc"
        ? v1.attributes.full_name < v2.attributes.full_name ? 1 : -1
        : v1.attributes.full_name > v2.attributes.full_name ? 1 : -1;
    return result;
  };

  const nameSortValue = sort.name as SortDirection;

  let sortedWorkers: Array<WorkerItem> = [];
  if (workers && workers.length > 1) {
    sortedWorkers = workers
      .filter(filterByTeam)
      .filter(filterBySkills)
      .sort(sortByName);
  }

  return (
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
            {sortedWorkers.map((wk: WorkerItem) => (
              <Tr key={wk.sid}>
                <Td> {wk.friendlyName} </Td>
                <Td> {wk.attributes.full_name} </Td>
                <Td>{wk.attributes.team_name} </Td>
                <Td> {wk.attributes.department_name} </Td>
                <Td> {wk.attributes.location} </Td>
                <Td> {wk.attributes.skillsString} </Td>
                <Td>
                    <UpdateWorkerSideModal worker={wk} />
                </Td>
              </Tr>))}
          </TBody>
        </Table>

      </Flex>
    </Box>

  );
};

export default AgentAdminViewWithSideModal;
