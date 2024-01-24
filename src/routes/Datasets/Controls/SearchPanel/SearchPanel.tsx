import { TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { DatasetType } from 'routes/Datasets/Datasets';
import { FormContainer } from './SearchPanel.style';

// SearchPanel 컴포넌트 props 타입
interface SearchPanelProps {
  datasets: DatasetType[]; // 데이터셋 목록
  setFilteredDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>; // 검색 결과 업데이트 함수
}

// SearchPanel 컴포넌트
export default function SearchPanel(props: SearchPanelProps) {
  const searchRef = useRef<HTMLInputElement>(null); // 검색창 ref
  const { datasets, setFilteredDatasets } = props; // 데이터셋 목록, 검색 결과 업데이트 함수
  const [searchText, setSearchText] = useState(''); // 검색창 텍스트
  // 검색창 텍스트를 공백과 대소문자를 무시하고 비교하기 위해 공백과 대소문자를 제거한 문자열 생성
  const lowerCasedSearchText = searchText
    .toLocaleLowerCase()
    .replace(/\s/g, '');

  // 데이터셋이 검색창 텍스트를 포함하는지 확인하는 함수
  const hasMatchingWord = (dataset: DatasetType) => {
    const { superDatasetName, datasetName, categories } = dataset; // 데이터셋 정보
    const categoriesStr = categories.map(({ name }) => name).join('★^오^★'); // 카테고리 목록을 문자열로 변환

    // 데이터셋 이름, 대분류 이름, 카테고리 목록을 하나의 문자열로 변환하여 검색창 텍스트를 포함하는지 확인 후 return
    return [superDatasetName, datasetName, categoriesStr]
      .join('★^오^★')
      .replace(/\s/g, '')
      .toLocaleLowerCase()
      .includes(lowerCasedSearchText);
  };

  // 렌더링
  return (
    <FormContainer className="search-step" onSubmit={(e) => e.preventDefault()}>
      {/* 검색어 입력 */}
      <TextField
        ref={searchRef}
        type="text"
        value={searchText}
        size="small"
        placeholder="Search.."
        className="dataset-search-input"
        onChange={(e) => setSearchText(e.target.value)}
        inputProps={{ ref: searchRef }}
        onKeyUp={() => {
          // 검색 결과 업데이트
          const filtered = datasets.filter(hasMatchingWord);
          setFilteredDatasets(filtered);
        }}
      />
    </FormContainer>
  );
}
