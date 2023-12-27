import { useAppSelector } from 'App.hooks';
import { Container } from './Preferences.style';

import { Tool } from 'types';
import BrushToolPanel from './BrushToolPanel/BrushToolPanel';
import EraserToolPanel from './EraserToolPanel/EraserToolPanel';
import SAMToolPanel from './SAMToolPanel/SAMToolPanel';
import { KeyedMutator } from 'swr';
import { InitDataType } from 'routes/Annotator/Annotator';

type PreferencesProps = {
  reload: KeyedMutator<InitDataType>;
};

export default function Preferences(props: PreferencesProps) {
  const seletedTool = useAppSelector((state) => state.annotator.selectedTool);
  return (
    <Container>
      {seletedTool === Tool.Brush && <BrushToolPanel />}
      {seletedTool === Tool.Eraser && <EraserToolPanel />}
      {seletedTool === Tool.SAM && <SAMToolPanel reload={props.reload} />}
    </Container>
  );
}
