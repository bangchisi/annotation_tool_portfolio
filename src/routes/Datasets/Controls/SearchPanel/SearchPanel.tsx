import { TextField } from '@mui/material';
import { FormContainer, SearchButton } from './SearchPanel.style';

export default function SearchPanel() {
  return (
    <FormContainer>
      <TextField type="text" size="small" placeholder="Search.." />
      <SearchButton
        type="submit"
        variant="contained"
        size="small"
        onClick={(e) => e.preventDefault()}
      >
        Search
      </SearchButton>
    </FormContainer>
  );
}
