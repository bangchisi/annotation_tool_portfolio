import { TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { DatasetType } from 'routes/Datasets/Datasets';
import { FormContainer } from './SearchPanel.style';

interface SearchPanelProps {
  datasets: DatasetType[];
  setFilteredDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
}

export default function SearchPanel(props: SearchPanelProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const { datasets, setFilteredDatasets } = props;
  const [searchText, setSearchText] = useState('');
  const lowerCasedSearchText = searchText
    .toLocaleLowerCase()
    .replace(/\s/g, '');

  const hasMatchingWord = (dataset: DatasetType) => {
    const { superDatasetName, datasetName, categories } = dataset;
    const categoriesStr = categories.map(({ name }) => name).join('★^오^★');

    return [superDatasetName, datasetName, categoriesStr]
      .join('★^오^★')
      .replace(/\s/g, '')
      .toLocaleLowerCase()
      .includes(lowerCasedSearchText);
  };

  return (
    <FormContainer onSubmit={(e) => e.preventDefault()}>
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
          const filtered = datasets.filter(hasMatchingWord);
          setFilteredDatasets(filtered);
          console.log(filtered);
        }}
      />
    </FormContainer>
  );
}
