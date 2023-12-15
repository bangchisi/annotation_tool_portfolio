import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useAppSelector } from 'App.hooks';
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

interface DatasetListProps {
  datasets: DatasetType[];
  filteredDatasets: DatasetType[];
  setFilteredDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
  setDatasetList: (userId: string) => Promise<void>;
}

export default function DatasetList(props: DatasetListProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [exportId, setExportId] = useState<number>();
  const [open, setOpen] = useState(false);

  const { datasets, filteredDatasets, setFilteredDatasets, setDatasetList } =
    props;
  // const list = filteredDatasets.length > 0 ? filteredDatasets : datasets;
  const list = filteredDatasets;

  useEffect(() => {
    setDatasetList(user.userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredDatasets(datasets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasets]);

  // Accordion 관련 코드
  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange = useCallback(
    (id: string) => () => {
      setExpanded((prev) => (prev === id ? false : id));
    },
    [],
  );
  const groupedDatasets = useMemo(
    () =>
      filteredDatasets.reduce(
        (group, dataset) => {
          if (!group[dataset.superDatasetName]) {
            group[dataset.superDatasetName] = [];
          }
          group[dataset.superDatasetName].push(dataset);
          return group;
        },
        {} as { [key: string]: DatasetType[] },
      ),
    [filteredDatasets],
  );

  return (
    <Container className="dataset-list">
      {Object.entries(groupedDatasets).map(([superDataSetKey, list]) => {
        return (
          <StyledAccordion
            key={superDataSetKey}
            expanded={expanded === superDataSetKey}
            onChange={handleChange(superDataSetKey)}
          >
            <StyledAccordionSummary
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
            <StyledAccordionDetails>
              {list.map((dataset) => {
                return (
                  <DatasetCard
                    key={dataset.datasetId}
                    {...dataset}
                    setDatasetList={setDatasetList}
                    setExportId={setExportId}
                    setOpen={setOpen}
                  />
                );
              })}
            </StyledAccordionDetails>
          </StyledAccordion>
        );
      })}

      <ExportDatasetModal open={open} exportId={exportId} setOpen={setOpen} />
    </Container>
  );
}
