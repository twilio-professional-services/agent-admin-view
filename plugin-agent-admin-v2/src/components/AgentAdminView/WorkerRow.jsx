import { Button, Tr, Td } from "@twilio-paste/core";
import { EditIcon } from "@twilio-paste/icons/esm/EditIcon";

const WorkerRow = ({ wk, openEditWorkerAttr }) => {
  return (<Tr key={wk.sid}>
    <Td> {wk.friendlyName} </Td>
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