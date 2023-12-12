import styled from '@emotion/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Button,
  Collapse,
  Container,
  IconButton,
  Paper,
} from '@mui/material';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import CollapsibleTable from 'routes/Models/Components/CollapsibleTable';
import DeleteButton from 'routes/Models/Components/DeleteButton';
import FlexTableRow from 'routes/Models/Components/FlexTableRow';
import {
  CollapsibleRowType,
  LogType,
  VisibleRowType,
  groupLogToTableData,
} from 'routes/Models/logTypes';

const Wrapper = styled(Container)`
  background-color: rgb(243, 246, 249);
  border: 1px solid rgb(216, 222, 228);
  border-radius: 12px;
  padding: 12px 36px 0px 36px;
  margin-bottom: 24px;
  transition: all 0.15s ease-in-out;

  &:hover {
    box-shadow: rgba(136, 146, 157, 0.2) 2px 2px 4px 1px;
  }
`;
const FlexTableContainer = styled(Box)`
  border: 1px solid rgb(216, 222, 228);
  border-radius: 12px;
  margin-bottom: 36px;
`;
const FlexTableBody = styled(Paper)`
  border: 1px solid rgb(216, 222, 228);
  border-radius: 12px;
  box-shadow: none;
`;
const FlexTableFooter = styled(Paper)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
  box-shadow: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  height: 45px;
`;

const TableHeader = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 12px 18px 16px;

  h2 {
    font-weight: 500;
    font-size: 30px;
    color: rgb(33, 43, 54);
  }

  button {
    padding: 0;
    border-radius: 12px;
    &:hover {
      background-color: transparent;
    }
  }
`;

type VisibleTableProps = {
  log: LogType;
  handleDelete: (finetuneId: number, finetuneName: string) => void;
};

const FlexTable = ({ log, handleDelete }: VisibleTableProps) => {
  const [openModelTable, setOpenModelTable] = useState(false);
  const groupedLog = useMemo(() => groupLogToTableData(log), [log]);

  const visibleTableData = useMemo(
    () => groupedLog.slice(0, 2) as VisibleRowType[],
    [groupedLog],
  );
  const collapsibleTableData = useMemo(
    () => groupedLog.slice(2) as CollapsibleRowType[],
    [groupedLog],
  );

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((prev) => !prev);

  const onDeleteClick = useCallback(() => {
    handleDelete(log.finetuneId, log.finetuneName);
  }, [handleDelete, log.finetuneId, log.finetuneName]);

  const onTableHeaderClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );

  return (
    <Wrapper className="flex-table-container">
      <Box>
        <TableHeader>
          <Button
            disableRipple
            onClick={() => setOpenModelTable((prev) => !prev)}
          >
            <h2>{log.finetuneName}</h2>
          </Button>
          <DeleteButton onClick={onDeleteClick}>
            <span>삭제</span>
          </DeleteButton>
        </TableHeader>
      </Box>

      <Collapse in={openModelTable} timeout="auto">
        <FlexTableContainer className="flex-table">
          <FlexTableBody className="flex-table-body">
            {visibleTableData.map((row, index) => (
              <FlexTableRow key={index} rowData={row} />
            ))}
            <CollapsibleTable rowData={collapsibleTableData} open={open} />
            <FlexTableFooter>
              <IconButton
                aria-label="expand row"
                size="medium"
                onClick={handleOpen}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </FlexTableFooter>
          </FlexTableBody>
        </FlexTableContainer>
      </Collapse>
    </Wrapper>
  );
};

export default FlexTable;
