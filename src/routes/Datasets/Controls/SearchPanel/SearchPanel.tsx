import { TextField } from '@mui/material';
import { FormContainer } from './SearchPanel.style';
import { DatasetType } from 'routes/Datasets/Datasets';
import { useRef, useState } from 'react';

interface SearchPanelProps {
  datasets: DatasetType[];
  setFilteredDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
}

export default function SearchPanel(props: SearchPanelProps) {
  const { datasets, setFilteredDatasets } = props;
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

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
          const filtered = datasets.filter(
            (dataset) =>
              dataset.superDatasetName
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase()) ||
              dataset.datasetName
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase()) ||
              dataset.categories.some((category) =>
                category.name
                  .toLocaleLowerCase()
                  .includes(searchText.toLocaleLowerCase()),
              ),
          );

          console.log(filtered);
          setFilteredDatasets(filtered);
        }}
      />
    </FormContainer>
  );
}
