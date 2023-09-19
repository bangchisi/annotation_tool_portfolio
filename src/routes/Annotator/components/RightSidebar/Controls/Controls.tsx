import { Button } from '@mui/material';
import Explorer from './Explorer/Explorer';
import { Container, TabContainer } from './Controls.style';
import Annotations from './Annotations/Annotations';
import { useState } from 'react';
import { Tab } from 'routes/Annotator/Annotator.data';

export default function Controls() {
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.ANNOTATIONS);

  return (
    <Container>
      <TabContainer>
        <Button variant="text" onClick={() => setSelectedTab(Tab.ANNOTATIONS)}>
          Annotations
        </Button>
        <Button variant="text" onClick={() => setSelectedTab(Tab.EXPLORER)}>
          Explorer
        </Button>
      </TabContainer>
      {selectedTab === Tab.ANNOTATIONS && <Annotations />}
      {selectedTab === Tab.EXPLORER && <Explorer />}
    </Container>
  );
}
