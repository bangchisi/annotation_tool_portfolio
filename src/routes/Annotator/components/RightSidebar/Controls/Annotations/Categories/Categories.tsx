import { FormControl, NativeSelect } from '@mui/material';

export default function Categories() {
  return (
    <FormControl id="category-dropdown" fullWidth>
      <NativeSelect
        defaultValue={'thing'}
        inputProps={{
          name: 'category',
          id: 'uncontrolled-native',
        }}
      >
        <option value={'thing'}>thing</option>
        <option value={'other'}>other</option>
        <option value={'something'}>something</option>
      </NativeSelect>
    </FormControl>
  );
}
