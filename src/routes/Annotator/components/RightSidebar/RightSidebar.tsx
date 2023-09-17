import { ChangeEvent, useState } from 'react';

import { Tabs, Tab, Box } from '@mui/material';
import { CustomTabPanel } from 'components/CustomTabPanel';
import Annotations from '../Annotations';
import Explorer from './Explorer/Explorer';
import { PreferencesPanel } from '../PreferencesPanel';
import { Container } from './RightSidebar.style';

export default function RightSidebar() {
  const [value, setValue] = useState(0);
  const [category, setCategory] = useState('thing');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // ChangeEventHandler<HTMLSelectElement>
  const handleCategoryChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    setCategory(event.target.value);
  };

  return (
    <Container>
      <div id="annotator-controls">
        <Tabs
          id="annotator-tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Annotations"
            id="tab-annotations"
            aria-controls="tabpanel-annotations"
          />
          <Tab
            label="Explorer"
            id="tab-explorer"
            aria-controls="tabpanel-explorer"
          />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <Annotations
            category={category}
            handleChange={handleCategoryChange}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Explorer />
        </CustomTabPanel>
      </div>
      <div id="annotator-preferences">
        <PreferencesPanel />
      </div>
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
    </Container>
  );
}
