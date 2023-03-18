import React, { useState, useEffect } from 'react';

import { Flex, Box, Select, Option, Label, Tr, Td, Switch } from "@twilio-paste/core";

interface OwnProps {
  workerChannelSid: string,
  taskChannelName: string,
  options: Array<string>,
  channelSettingsChanged: (channelSid: string, changed: boolean, available: boolean, capacity: number) => void;
}

const CapacityChannel = ({ workerChannelSid, taskChannelName , options, channelSettingsChanged }: OwnProps) => {
  const [changed, setChanged] = useState(false);
  const [capacity, setCapacity] = useState("0");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    // notify the parent of the new settings
    channelSettingsChanged(workerChannelSid, changed, available, parseInt(capacity));
  }, [available, capacity]);

  const handleCapacityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChanged(true);
    const capacity = e.target.value;
    setCapacity(capacity);
    if (capacity == "0") {
      //Auto disable
      setAvailable(false);
    } else {
      //Auto enable?
      //setAvailable(true);
    }
  }

  const onAvailableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvailable(!available)
    setChanged(true);
  }

  return (
    <Tr key={taskChannelName}>
      <Td>
        <Switch checked={available} onChange={onAvailableChange} >
          {taskChannelName}
        </Switch>
      </Td>
      <Td>
        <Flex vAlignContent="center">
          <Box width="50%" >
            <Label htmlFor={taskChannelName}> Capacity:&nbsp;  </Label>
          </Box>
          <Box>
            <Select
              value={capacity}
              onChange={handleCapacityChange}
              id={taskChannelName}
            >
              {options.map((option) => {
                return (<Option key={option} value={option}> {option} </Option>)
              })}
            </Select>
          </Box>
        </Flex>
      </Td>
    </Tr>
  )
}

export default CapacityChannel;
