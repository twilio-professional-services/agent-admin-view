import React, { useState, useEffect } from 'react';

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
import { PLUGIN_NAME, capacityOptions } from '../../utils/constants';
import { SelectedWorkerSids } from '../AgentAdminView/AgentAdminViewWithSideModal';
import WorkerChannelCapacity from './WorkerChannelCapacity';
import WorkerChannelsUtil from '../../utils/WorkerChannelsUtil';

interface OwnProps {
  workerSelection: SelectedWorkerSids
}

const BulkUpdateCapacityModal = ({ workerSelection }: OwnProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [changed, setChanged] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const workerSids = Object.keys(workerSelection).filter(sid => workerSelection[sid]);
    if (workerSids && workerSids.length > 1) setEnabled(true)
    else setEnabled(false);
  }, [workerSelection]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const modalHeadingID = useUID();

  const channelSettingsChanged = (taskChannelName: string, hasChanged: boolean, newAvailable: boolean, newCapacity: number) => {
    setChanged(true);
    //Handle Bulk Worker Channel Changes
    //use workerSelection
    //Update channel capacity for each worker
    //Match taskChannelName to workerChannelSid
    console.log(PLUGIN_NAME, 'Updating Worker Channel:', taskChannelName, 'Available:', newAvailable, 'Capacity:', newCapacity);

  }

  const saveChannelCapacity = async () => {
    //Reduce selection to array
    const workerSids = Object.keys(workerSelection).filter(sid => workerSelection[sid]);
    console.log(PLUGIN_NAME, 'Worker Sids:', workerSids);

    await WorkerChannelsUtil.batchUpdateChannelCapacity(workerSids, {});
    //create function to support bulk update

    setIsOpen(false);
  }


  return (
    <div>
      <Button
        variant="primary"
        onClick={handleOpen}
        disabled={!enabled}
      >
        Bulk Update Capacity
      </Button>
      <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
        <ModalHeader>
          <ModalHeading as="h3" id={modalHeadingID}>
            Update Channel Capacity for Selected Workers
          </ModalHeading>
        </ModalHeader>
        <ModalBody>

          <Flex vertical padding="space20" grow width="100%">
            <Box width="100%">
              <Table variant="borderless">
                <THead>
                  <Tr>
                    <Th> Channel </Th>
                    <Th> Capacity </Th>
                  </Tr>
                </THead>
                <TBody>
                  <WorkerChannelCapacity
                    workerChannelSid="chat"
                    taskChannelName="chat"
                    channelAvailable={true}
                    configuredCapacity={1}
                    options={capacityOptions}
                    channelSettingsChanged={channelSettingsChanged}
                    key="chat"
                  />
                  <WorkerChannelCapacity
                    workerChannelSid="sms"
                    taskChannelName="sms"
                    channelAvailable={true}
                    configuredCapacity={1}
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
              variant="primary"
              id="saveButton"
              onClick={saveChannelCapacity}
              disabled={!changed}
            >
              Save
            </Button>
          </ModalFooterActions>
        </ModalFooter>

      </Modal>
    </div>
  );
};

export default BulkUpdateCapacityModal;