import { Input, Label, Tr, Td } from "@twilio-paste/core";

const FormRow = ({ id, label, value, onChangeHandler }) => {
  return (
    <Tr key={id}>
      <Td>
        <Label htmlFor={id}> {label} </Label>
      </Td>
      <Td>
        <Input type="text" id={id} value={value} onChange={onChangeHandler} />
      </Td>
    </Tr>
  )
}

export default FormRow;