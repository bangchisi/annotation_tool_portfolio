import React from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export interface AnnotationType {
  id: number;
  polygon: number;
}

export function Annotation({ id, polygon }: AnnotationType) {
  return (
    <Box
      className="annotation"
      sx={{
        borderBottom: 1,
        display: 'flex',
        height: 45,
        backgroundColor: 'rgba(50, 50, 195, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          borderRight: 1,
          width: 10,
          height: '100%',
          border: 1,
          borderBottom: 0,
          backgroundColor: 'white',
          marginRight: 1,
        }}
      ></Box>
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
    </Box>
  );
}
