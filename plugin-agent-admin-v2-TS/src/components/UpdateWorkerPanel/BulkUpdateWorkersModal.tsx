import React, { useState } from 'react';
import { Manager } from '@twilio/flex-ui';
import {
  Button,
  Flex,
  Box,
  Table,
  THead,
  TBody,
  Th,
  Tr
} from "@twilio-paste/core";

import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';

import { useUID } from "@twilio-paste/uid-library";
import FormRowText from './FormRowText';
import FormRowSelect from './FormRowSelect';
import { PLUGIN_NAME, teams, departments } from '../../utils/constants';
import { SelectedWorkerSids } from '../AgentAdminView/AgentAdminViewWithSideModal';
import WorkerUtil from '../../utils/WorkerUtil';
import { Actions as WorkerActions } from '../../states/reducer';

interface OwnProps {
  workerSelection: SelectedWorkerSids
}

const BulkUpdateWorkersModal = ({ workerSelection } : OwnProps) => {
  // Modal properties
  const [isOpen, setIsOpen] = React.useState(false);
  
  const [teamId, setTeamId] = useState(teams[0].value);
  const [teamName, setTeamName] = useState(teams[0].value);
  const [departmentId, setDepartmentId] = useState(departments[0].value);
  const [departmentName, setDepartmentName] = useState(departments[0].value);
  const [location, setLocation] = useState('');

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const modalHeadingID = useUID();

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const team = e.target.value;
    //Store team in both team_id and team_name for consistent reporting
    setTeamId(team);
    setTeamName(team);
  }

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept = e.target.value;
    //Store dept in both department_id and department_name for consistent reporting
    setDepartmentId(dept);
    setDepartmentName(dept);
  }

  //For text input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //console.log('change event ', e.target);
    const value = e.target.value;
    const id = e.target.id;
    switch (id) {
      case 'location':
        setLocation(value);
        break;
    }
  }


  const saveWorkerAttributes = async ( ) => {
    console.log(PLUGIN_NAME, 'Updating Workers:', workerSelection);
    let updatedAttr = {
      team_id: teamId,
      team_name: teamName,
      department_id: departmentId,
      department_name: departmentName,
      location
    };
    console.log(PLUGIN_NAME, 'Updated Worker Attr:', updatedAttr);
    //create function to support bulk update
    const workerSids = Object.keys(workerSelection).filter( sid => workerSelection[sid] );
    console.log(PLUGIN_NAME, 'Worker Sids:', workerSids);
    await WorkerUtil.batchUpdateWorkers(workerSids, updatedAttr);
    //Refresh redux
    let workers = await WorkerUtil.getWorkers();
    Manager.getInstance().store.dispatch(WorkerActions.setWorkers(workers));
    setIsOpen(false);
  }


  return (
    <div>
      <Button variant="primary" onClick={handleOpen}>
        Bulk Update Attributes
      </Button>
      <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
        <ModalHeader>
          <ModalHeading as="h3" id={modalHeadingID}>
            Update Selected Workers
          </ModalHeading>
        </ModalHeader>
        <ModalBody>

          <Flex vertical padding="space20" grow width="100%">
            <Box width="100%">
              <Table variant="borderless">
                <THead>
                  <Tr>
                    <Th> Attribute </Th>
                    <Th> Value </Th>
                  </Tr>
                </THead>
                <TBody>
                  <FormRowSelect
                    id="team_name"
                    label="Team"
                    value={teamName}
                    options={teams}
                    onChangeHandler={handleTeamChange} 
                  />
                  <FormRowSelect
                    id="department_name"
                    label="Dept."
                    value={departmentName}
                    options={departments}
                    onChangeHandler={handleDeptChange} 
                  />
                  <FormRowText id="location" label="Location" value={location} onChangeHandler={handleChange} />
                </TBody>
              </Table>


            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <ModalFooterActions>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              id="saveButton"
              onClick={saveWorkerAttributes}
            >
              Save
            </Button>
          </ModalFooterActions>
        </ModalFooter>

      </Modal>
    </div>
  );
};

export default BulkUpdateWorkersModal;