import { Label, Tr, Th, Td, Select, Option } from "@twilio-paste/core";

interface Option {
  value: string,
  label: string
}

interface OwnProps {
  id: string,
  label: string,
  value: string,
  options: Array<Option>
  onChangeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const FormRowSelect = ({ id, label, value, options, onChangeHandler }: OwnProps) => {
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