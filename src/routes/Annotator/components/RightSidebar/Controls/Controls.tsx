import { Button } from '@mui/material';
import Explorer from './Explorer/Explorer';
import { Container, TabContainer } from './Controls.style';
import Annotations from './Annotations/Annotations';
import { useState } from 'react';
import { AnnotationType } from 'routes/Annotator/Annotator.types';
// import { Tab } from 'routes/Annotator/Annotator.data';

/** 기능
 * tab을 클릭하면 Annotations or Explorer 컴포넌트를 렌더링
 */

/** props
 * annotations와 images
 */

/** state
 */

export default function Controls() {
  // TEMP
  enum Tab {
    ANNOTATIONS,
    EXPLORER,
  }

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
