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
  border-radius: 7px;
  padding: 12px 36px 0px 36px;
  margin-bottom: 12px;
  transition: all 0.15s ease-in-out;

  &:hover {
    box-shadow: rgba(136, 146, 157, 0.15) 0px 3px 6px 0px;
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
  margin: 0 12px 12px 16px;

  h2 {
    font-size: 18px;
    color: rgb(33, 43, 54);
    margin: 0;
  }

  button.header {
    padding: 0;
    border-radius: 12px;
    &:hover {
      background-color: transparent;
    }
  }
`;

type VisibleTableProps = {
  index: number;
  log: LogType;
  handleDelete: (finetuneId: number, finetuneName: string) => void;
};

const FlexTable = ({ index, log, handleDelete }: VisibleTableProps) => {
  const [openModelTable, setOpenModelTable] = useState(
    index === 0 ? true : false,
  );
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

  const handleTableHeaderClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setOpenModelTable((prev) => !prev);
    },
    [],
  );

  return (
    <Wrapper className="flex-table-container">
      <Box>
        <TableHeader>
          <Button
            disableRipple
            onClick={handleTableHeaderClick}
            className="header"
          >
            <h2>{log.finetuneName}</h2>
          </Button>
          <DeleteButton onClick={onDeleteClick} className="delete-button">
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
                id="details-button"
                aria-label="expand row"
                size="medium"
                onClick={handleOpen}
                sx={{
                  borderRadius: '7px',
                  padding: '5px',
                }}
                disableFocusRipple={true}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginLeft: '5px',
                  }}
                >
                  디테일 {open ? '닫기' : '열기'}
                </span>
              </IconButton>
            </FlexTableFooter>
          </FlexTableBody>
        </FlexTableContainer>
      </Collapse>
    </Wrapper>
  );
};

export default FlexTable;
