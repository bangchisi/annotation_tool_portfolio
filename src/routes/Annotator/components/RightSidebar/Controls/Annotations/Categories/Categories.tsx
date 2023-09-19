import { FormControl, NativeSelect } from '@mui/material';
import { ChangeEvent } from 'react';

interface CategoriesProps {
  currentCategory: string;
  handleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default function Categories(props: CategoriesProps) {
  return (
    <FormControl id="category-dropdown" fullWidth>
      <NativeSelect
        defaultValue={'thing'}
        inputProps={{
          name: 'category',
          id: 'uncontrolled-native',
        }}
        onChange={props.handleChange}
      >
        <option value={'thing'}>thing</option>
        <option value={'other'}>other</option>
        <option value={'something'}>something</option>
      </NativeSelect>
    </FormControl>
  );
}
