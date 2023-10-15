import { useAppSelector } from 'App.hooks';
import { Container } from './Preferences.style';

import { Tool } from 'routes/Annotator/Annotator';
import SAMToolPanel from './SAMToolPanel/SAMToolPanel';
import BrushToolPanel from './BrushToolPanel/BrushToolPanel';
import EraserToolPanel from './EraserToolPanel/EraserToolPanel';

export default function Preferences() {
  const seletedTool = useAppSelector((state) => state.annotator.selectedTool);
  return (
    <Container>
      {seletedTool === Tool.Brush && <BrushToolPanel />}
      {seletedTool === Tool.Eraser && <EraserToolPanel />}
      {seletedTool === Tool.SAM && <SAMToolPanel />}
    </Container>
  );
}
