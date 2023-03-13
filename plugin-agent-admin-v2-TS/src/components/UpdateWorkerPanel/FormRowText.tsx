import { Input, Label, Tr, Td } from "@twilio-paste/core";

interface OwnProps {
  id: string,
  label: string,
  value: string,
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FormRowText = ({ id, label, value, onChangeHandler }: OwnProps) => {
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

export default FormRowText;