import { Box } from '@mui/material';

export default function Minimap() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      id="annotator-minimap"
    >
      <img src="/test.png" width="200" height="200" />
    </Box>
  );
}
