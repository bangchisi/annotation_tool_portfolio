import React from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Container } from './Annotation.style';

export interface AnnotationType {
  id: number;
  polygon: number;
}

export function Annotation({ id, polygon }: AnnotationType) {
  return (
    <Container>
      (id: {id})
      <Select
        value="thing"
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        sx={{
          height: '70%',
          marginLeft: 'auto',
          marginRight: 2,
          border: 1,
          backgroundColor: 'white',
        }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="thing">thing</MenuItem>
        <MenuItem value="other">other</MenuItem>
        <MenuItem value="something">something</MenuItem>
      </Select>
    </Container>
  );
}
