import { FormControl, NativeSelect } from '@mui/material';

export default function Categories() {
  const handleChange = () => {
    console.log('Cateogries, handleChange');
  };

  return (
    <FormControl id="category-dropdown" fullWidth>
      <NativeSelect
        defaultValue={'thing'}
        inputProps={{
          name: 'category',
          id: 'uncontrolled-native',
        }}
        onChange={handleChange}
      >
        <option value={'thing'}>thing</option>
        <option value={'other'}>other</option>
        <option value={'something'}>something</option>
      </NativeSelect>
    </FormControl>
  );
}
