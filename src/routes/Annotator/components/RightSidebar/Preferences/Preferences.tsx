import { useAppSelector } from 'App.hooks';
import { Container } from './Preferences.style';

import { Tool } from 'types';
import BrushToolPanel from './BrushToolPanel/BrushToolPanel';
import EraserToolPanel from './EraserToolPanel/EraserToolPanel';
import SAMToolPanel from './SAMToolPanel/SAMToolPanel';
import { KeyedMutator } from 'swr';
import { InitDataType } from 'routes/Annotator/Annotator';

// 세부 설정 패널 props
type PreferencesProps = {
  reload: KeyedMutator<InitDataType>; // 카테고리 목록 갱신 함수
};

// 세부 설정 패널 컴포넌트
export default function Preferences(props: PreferencesProps) {
  const seletedTool = useAppSelector((state) => state.annotator.selectedTool); // redux, 현재 선택된 툴

  return (
    <Container>
      {/* 현재 선택된 툴에 따라 해당하는 툴의 세부 설정 패널 렌더링 */}
      {seletedTool === Tool.Brush && <BrushToolPanel />}
      {seletedTool === Tool.Eraser && <EraserToolPanel />}
      {seletedTool === Tool.SAM && <SAMToolPanel reload={props.reload} />}
    </Container>
  );
}
