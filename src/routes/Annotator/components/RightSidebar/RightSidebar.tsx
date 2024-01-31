import { Container } from './RightSidebar.style';
import Controls from './Controls/Controls';
import Preferences from './Preferences/Preferences';
import { KeyedMutator } from 'swr';
import { InitDataType } from 'routes/Annotator/Annotator';
// import Minimap from './Minimap/Minimap';

// 우측 사이드바 props
type RightSidebarProps = {
  reload: KeyedMutator<InitDataType>; // 카테고리 목록 객체 갱신 함수
};

// 우측 사이드바 컴포넌트
export default function RightSidebar(props: RightSidebarProps) {
  return (
    <Container>
      {/* 컨트롤 패널 */}
      <Controls />
      {/* 툴 세부 설정 패널 */}
      <Preferences reload={props.reload} />
      {/* 미니맵 구현되지 않음 */}
      {/* <Minimap view={null} image={null} /> */}
    </Container>
  );
}
