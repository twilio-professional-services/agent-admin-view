import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@twilio/flex-ui';
import {
  Input,
  Flex,
  Box,
  Label,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  useSideModalState
} from "@twilio-paste/core";

import { AppState, WorkerItem } from '../../states/types';
import WorkerRow from './WorkerRow';
import { TableSortLabel } from "@material-ui/core";
import { namespace } from '../../states';
import UpdateWorkerSideModal from '../UpdateWorkerPanel/UpdateWorkerSideModal';

const ScrollWrapper = styled('div')`
  overflow: auto;
`;
type SortDirection = 'asc' | 'desc';

const AgentAdminViewWithSideModal = () => {
  const [selectedWorker, setSelectedWorker] = useState<WorkerItem | undefined>();
  const [sort, setSort] = useState({ name: "asc" })
  const [teamFilterValue, setTeamFilterValue] = useState('');
  const [skillsFilterValue, setSkillsFilterValue] = useState('');

  const workers = useSelector(
    (state: AppState) => { return state[namespace]?.workerList?.workers || [] }
  );

  const dialog = useSideModalState({});

  const openEditWorkerAttr = (worker: WorkerItem) => {
    setSelectedWorker(worker);
    dialog.show();
  }

  const resetWorker = () => {
    setSelectedWorker(undefined);
    dialog.hide();
  }

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
    <ScrollWrapper>
      <Flex width="100%">
        <Flex grow width="100%">
          <Box overflowY='auto' maxHeight='700px' width="100%">
            <Table tableLayout="fixed">
              <THead stickyHeader top={0}>
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
                  <WorkerRow key={wk.sid} wk={wk} openEditWorkerAttr={openEditWorkerAttr} />
                ))}
              </TBody>
            </Table>
          </Box>
        </Flex>

        <UpdateWorkerSideModal dialogState={dialog} worker={selectedWorker} resetWorker={resetWorker} />
      </Flex>
    </ScrollWrapper>

  );
};

export default AgentAdminViewWithSideModal;
