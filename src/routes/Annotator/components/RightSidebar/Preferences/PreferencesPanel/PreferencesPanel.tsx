import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

export function PreferencesPanel() {
  return (
    <Box
      sx={{
        padding: 2,
        border: 1,
        minHeight: 250,
        maxHeight: 250,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
    </Box>
  );
}
