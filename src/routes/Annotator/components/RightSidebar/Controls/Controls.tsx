import Explorer from './Explorer/Explorer';
import { Container, TabButton, TabContainer } from './Controls.style';
import Annotations from './Annotations/Annotations';
import { useState } from 'react';

export default function Controls() {
  enum Tab {
    ANNOTATIONS,
    EXPLORER,
  }

  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.ANNOTATIONS);

  return (
    <Container>
      <TabContainer>
        <TabButton
          data-selected={selectedTab === Tab.ANNOTATIONS}
          variant="button"
          onClick={() => setSelectedTab(Tab.ANNOTATIONS)}
        >
          Annotations
        </TabButton>
        <TabButton
          data-selected={selectedTab === Tab.EXPLORER}
          variant="button"
          onClick={() => setSelectedTab(Tab.EXPLORER)}
        >
          Explorer
        </TabButton>
      </TabContainer>
      {selectedTab === Tab.ANNOTATIONS && <Annotations />}
      {selectedTab === Tab.EXPLORER && <Explorer />}
    </Container>
  );
}
