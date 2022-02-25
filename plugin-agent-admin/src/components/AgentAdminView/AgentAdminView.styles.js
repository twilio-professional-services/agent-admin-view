import styled from 'react-emotion';
import { FlexBox } from '@twilio/flex-ui';
import { TableCell, TextField } from "@material-ui/core";

export const Worker = styled('div')`
  font-size: 12px;
`;

export const FilterTextField = styled(TextField)`
  width: 100px;
  font-size: 12px;
  align-items: top;
`;

export const TableHeaderCell = styled(TableCell)`
  height: 60px;
  font-size: 14px;
`;


export const Other = styled('div')`
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  text-align: center;
`;