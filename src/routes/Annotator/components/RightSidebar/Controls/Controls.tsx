import { Button } from '@mui/material';
import Explorer from './Explorer/Explorer';
// import { ChangeEvent } from 'react';
import { Container, TabContainer } from './Controls.style';
import Annotations from './Annotations/Annotations';
import { useState } from 'react';

// interface ControlsProps {
//   value: number;
//   category: string;
//   handleValueChange: (event: React.SyntheticEvent, newValue: number) => void;
//   handleCategoryChange: (event: ChangeEvent<HTMLSelectElement>) => void;
// }

export default function Controls() {
  const [selectedTab, setSelectedTab] = useState<string>('annotations');

  return (
    <Container>
      <TabContainer>
        <Button variant="text" onClick={() => setSelectedTab('annotations')}>
          Annotations
        </Button>
        <Button variant="text" onClick={() => setSelectedTab('explorer')}>
          Explorer
        </Button>
      </TabContainer>
      {selectedTab === 'annotations' ? <Annotations /> : <Explorer />}
    </Container>
  );
}
