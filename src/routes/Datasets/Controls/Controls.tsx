import CreateDatasetModal from './CreateDatasetModal/CreateDatasetModal';
import { Container, LeftControl } from './Controls.style';
import SearchPanel from './SearchPanel/SearchPanel';
// import Sort from './Sort/Sort';
import { DatasetType } from '../Datasets';
import { KeyedMutator } from 'swr';

// props 타입
interface ControlsProps {
  datasets: DatasetType[]; // 데이터셋 목록
  updateDatasets: KeyedMutator<DatasetType[]>; // 데이터셋 목록 업데이트 함수
  setFilteredDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>; // 검색 결과 데이터셋 목록 업데이트 함수
}

// Controls 컴포넌트
export default function Controls(props: ControlsProps) {
  // props 디스트럭처링
  const { datasets, updateDatasets, setFilteredDatasets } = props;

  // 렌더링
  return (
    <Container>
      {/* FIX: 기획 단계에 왼쪽 패널이었으나 현재는 상단 패널이므로 LeftControl에서 이름 변경 요망. */}
      <LeftControl>
        {/* TODO: 데이터셋 정렬은 현재 미구현이기 때문에 구현 필요. */}
        {/* <Sort /> */}
        {/* 데이터셋 검색을 위한 패널 */}
        <SearchPanel
          datasets={datasets}
          setFilteredDatasets={setFilteredDatasets}
        />
      </LeftControl>
      {/* 데이터셋 생성을 위한 모달 */}
      <CreateDatasetModal updateDatasets={updateDatasets} />
    </Container>
  );
}
