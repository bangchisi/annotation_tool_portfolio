import { Fragment, useState } from 'react';
import { Container } from './Preferences.style';
import SAMToolPanel from './SAMToolPanel/SAMToolPanel';

export default function Preferences() {
  const [currentTool, setCurrentTool] = useState<string>('sam');
  return (
    <Container>
      {currentTool === 'select' ? (
        <Fragment />
      ) : currentTool === 'sam' ? (
        <SAMToolPanel />
      ) : (
        <Fragment />
      )}
    </Container>
  );
}
