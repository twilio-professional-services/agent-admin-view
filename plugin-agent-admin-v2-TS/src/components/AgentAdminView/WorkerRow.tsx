import React, { useState, useEffect } from 'react';
import { Button, Tr, Td, Checkbox } from "@twilio-paste/core";
import { EditIcon } from "@twilio-paste/icons/esm/EditIcon";
import { WorkerItem } from '../../states/types';

interface OwnProps {
  wk: WorkerItem,
  openEditWorkerAttr: (wk: WorkerItem) => void,
  workerSelectionChanged: (workerSid: string, selected: boolean) => void,
  selectAll: boolean
}

const WorkerRow = ({ wk, openEditWorkerAttr, workerSelectionChanged, selectAll }: OwnProps) => {
  const [workerChecked, setWorkerChecked] = useState(false);

  const handleWorkerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkerChecked(e.target.checked);
    workerSelectionChanged(wk.sid, e.target.checked);
  }

  useEffect(() => {
    setWorkerChecked(selectAll);
    workerSelectionChanged(wk.sid, selectAll);
  }, 
  [selectAll]);

  return (
    <Tr key={wk.sid}>
      <Td align="center">
        <Checkbox
          checked={workerChecked}
          id={wk.sid}
          name={wk.sid}
          onChange={handleWorkerSelect}
        >
          {wk.friendlyName}
        </Checkbox>
      </Td>
      <Td> {wk.attributes.full_name} </Td>
      <Td> {wk.attributes.team_name} </Td>
      <Td> {wk.attributes.department_name} </Td>
      <Td> {wk.attributes.location} </Td>
      <Td> {wk.attributes.skillsString} </Td>
      <Td>
        <Button variant="primary_icon" id="updateButton" size="small"
          onClick={() => {
            openEditWorkerAttr(wk);
          }}
        > <EditIcon decorative={false} title="Update" /> </Button>
      </Td>
    </Tr>)
}

export default WorkerRow;