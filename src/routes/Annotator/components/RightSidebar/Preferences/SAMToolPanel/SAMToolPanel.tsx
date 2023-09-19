import { Fragment } from 'react';
import { Box, Button, Slider, Typography } from '@mui/material';

export default function SAMToolPanel() {
  return (
    <Fragment>
      <Button variant="outlined">Everything</Button>
      <Button variant="outlined">Everything</Button>
      <Button variant="outlined">Everything</Button>
      <Button variant="outlined">Everything</Button>
      <Button variant="outlined">Everything</Button>
      <Button variant="outlined">Everything</Button>
      <Box sx={{ padding: 1 }}>
        <Typography gutterBottom>Points</Typography>
        <Slider
          defaultValue={20}
          valueLabelDisplay="auto"
          step={5}
          marks
          min={10}
          max={100}
        />
      </Box>
    </Fragment>
  );
}
