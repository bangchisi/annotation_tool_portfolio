import { TextField } from '@mui/material';
import { FormContainer } from './SearchPanel.style';

export default function SearchPanel() {
  return (
    <FormContainer onSubmit={(e) => e.preventDefault()}>
      <TextField type="text" size="small" placeholder="Search.." />
    </FormContainer>
  );
}
