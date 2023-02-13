import { Label, Tr, Th, Td, Select, Option } from "@twilio-paste/core";

const FormRowSelect = ({ id, label, value, options, onChangeHandler }) => {
  return (
    <Tr key={id}>
      <Th scope="row">
        <Label htmlFor={id}> {label} </Label>
      </Th>
      <Td>
        <Select
          value={value}
          onChange={onChangeHandler}
          id={id}
        >
          {options.map((option) => {
            return (<Option key={option.value} value={option.value}> {option.label} </Option>)
          })}
        </Select>
      </Td>
    </Tr>
  );
}

export default FormRowSelect;