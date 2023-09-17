import { ChangeEventHandler } from 'react';
import { FormControl, NativeSelect } from '@mui/material';
import AnnotationList from './RightSidebar/AnnotationList/AnnotationList';

export default function Annotations(props: {
  category: string;
  handleChange: ChangeEventHandler<HTMLSelectElement>;
}) {
  return (
    <div id="annotator-annotations">
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
      <AnnotationList />
    </div>
  );
}
