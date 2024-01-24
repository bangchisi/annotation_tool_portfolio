import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useModal } from 'components/ModalWrapper/ModalWrapper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DatasetType } from '../Datasets';
import DatasetCard from './DatasetCard/DatasetCard';
import {
  Container,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './DatasetList.style';
import ExportDatasetModal from './ExportDatasetModal/ExportDatasetModal';
import { KeyedMutator } from 'swr';

// DatasetList 컴포넌트 props 타입
interface DatasetListProps {
  datasets: DatasetType[]; // 데이터셋 목록
  updateDatasets: KeyedMutator<DatasetType[]>; // 데이터셋 목록 업데이트 함수
  filteredDatasets: DatasetType[]; // 검색 결과
  setFilteredDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>; // 검색 결과 업데이트 함수
}

// DatasetList 컴포넌트
export default function DatasetList(props: DatasetListProps) {
  const [exportId, setExportId] = useState<number>(); // 데이터셋 내보내기를 위한 데이터셋 id
  const { open, handleOpen, handleClose } = useModal(); // 모달을 위한 커스텀 훅

  // props 디스트럭처링
  const { datasets, updateDatasets, filteredDatasets, setFilteredDatasets } =
    props;
  // const list = filteredDatasets.length > 0 ? filteredDatasets : datasets;

  // dataset 목록이 업데이트되면 검색 결과 업데이트
  useEffect(() => {
    // dataset 목록이 없으면 종료
    if (!datasets) return;
    // dataset 목록이 있으면 검색 결과 업데이트
    setFilteredDatasets(datasets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasets]);

  // Accordion 관련 코드
  const [expanded, setExpanded] = useState<string | false>(false); // Accordion 확장 여부

  // Accordion 확장 여부 변경 함수
  const handleChange = useCallback(
    (id: string) => () => {
      setExpanded((prev) => (prev === id ? false : id));
    },
    [],
  );

  // 검색 결과가 업데이트되면 대분류별로 데이터셋을 그룹화
  const groupedDatasets = useMemo(
    () =>
      filteredDatasets.reduce(
        (group, dataset) => {
          // 대분류 이름이 속성에 없으면 추가
          if (!group[dataset.superDatasetName]) {
            group[dataset.superDatasetName] = [];
          }
          // 대분류 이름에 해당하는 데이터셋 추가
          group[dataset.superDatasetName].push(dataset);

          // 그룹화된 데이터셋 return
          return group;
        },
        {} as { [key: string]: DatasetType[] }, // 타이핑된 초기값
      ),
    [filteredDatasets],
  );

  // 렌더링
  return (
    <Container className="dataset-list">
      {/* 대분류별로 데이터셋 렌더링 */}
      {Object.entries(groupedDatasets).map(([superDataSetKey, list]) => {
        return (
          // Accordion 컴포넌트
          <StyledAccordion
            key={superDataSetKey}
            expanded={expanded === superDataSetKey}
            onChange={handleChange(superDataSetKey)}
            disableGutters
          >
            {/* 대분류 아코디언 펼치기 버튼 */}
            <StyledAccordionSummary
              className="dataset-list-step"
              expandIcon={
                <ArrowDropDownIcon
                  fontSize="large"
                  htmlColor="var(--light-gray)"
                  sx={{
                    marginRight: '7px',
                  }}
                />
              }
            >
              <h2>{superDataSetKey}</h2>
            </StyledAccordionSummary>
            {/* 대분류 아코디언 펼친 내용 */}
            <StyledAccordionDetails>
              {list.map((dataset) => {
                return (
                  <DatasetCard
                    key={dataset.datasetId}
                    {...dataset}
                    updateDatasets={updateDatasets}
                    setExportId={setExportId}
                    handleOpen={handleOpen}
                  />
                );
              })}
            </StyledAccordionDetails>
          </StyledAccordion>
        );
      })}
      {/* 데이터셋 내보내기 모달 */}
      <ExportDatasetModal
        open={open}
        exportId={exportId}
        handleClose={handleClose}
      />
    </Container>
  );
}
