
import React, { useState } from 'react';

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
import { PLUGIN_NAME, capacityOptions,teams, departments } from '../../utils/constants';
import { SelectedWorkerSids } from '../AgentAdminView/AgentAdminViewWithSideModal';
import WorkerChannelCapacity from './WorkerChannelCapacity';

interface OwnProps {
  workerSelection: SelectedWorkerSids
}

const BulkUpdateWorkersModal = ({ workerSelection } : OwnProps) => {
  // Modal properties
  const [isOpen, setIsOpen] = React.useState(false);
  const [changed, setChanged] = useState(false);

  const [teamId, setTeamId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [location, setLocation] = useState('');

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const modalHeadingID = useUID();



  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChanged(true);
    const team = e.target.value;
    //Store team in both team_id and team_name for consistent reporting
    setTeamId(team);
    setTeamName(team);
  }

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChanged(true);
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
    setChanged(true);
    switch (id) {
      case 'location':
        setLocation(value);
        break;
    }
  }

  const channelSettingsChanged = (taskChannelName: string, hasChanged: boolean, newAvailable: boolean, newCapacity: number) => {
    //Handle Bulk Worker Channel Changes
    //use workerSelection
    //Update channel capacity for each worker
    //Match taskChannelName to workerChannelSid
    console.log(PLUGIN_NAME, 'Updating Worker Channel:', taskChannelName, 'Available:', newAvailable, 'Capacity:', newCapacity);

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
    //await WorkerUtil.newBulkUpdateMethod(workerSids, updatedAttr);
    //create function to support bulk update
  }


  return (
    <div>
      <Button variant="primary" onClick={handleOpen}>
        Bulk Update
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
                    value="none"
                    options={teams}
                    onChangeHandler={handleTeamChange} 
                  />
                  <FormRowSelect
                    id="department_name"
                    label="Dept."
                    value="none"
                    options={departments}
                    onChangeHandler={handleDeptChange} 
                  />
                  <FormRowText id="location" label="Location" value="none" onChangeHandler={handleChange} />
                  <WorkerChannelCapacity
                      workerChannelSid="chat"
                      taskChannelName="chat"
                      options={capacityOptions}
                      channelSettingsChanged={channelSettingsChanged}
                      key="chat"
                    />
                    <WorkerChannelCapacity
                      workerChannelSid="sms"
                      taskChannelName="sms"
                      options={capacityOptions}
                      channelSettingsChanged={channelSettingsChanged}
                      key="sms"
                    />
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
              variant="primary" size="small"
              id="saveButton"
              onClick={saveWorkerAttributes}
              // disabled={!changed}
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