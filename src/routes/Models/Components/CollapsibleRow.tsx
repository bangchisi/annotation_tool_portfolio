import { Box, styled } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { CollapsibleRowType } from 'routes/Models/logTypes';
import { formatStringForTable } from 'utils';

const headerClassName = 'flex-header';
const contentClassName = 'flex-content';

const Row = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  flex-shrink: 1;
  width: 100%;

  &:last-of-type > .td {
    border-bottom: none !important;
  }
`;

const Cell = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-height: 8px;
  color: #0e1116;

  &.th {
    font-weight: 500;
    padding: 8px;
    background-color: rgba(0, 0, 0, 0.05);
    user-select: none;
  }

  &.td {
    box-sizing: initial;
    padding: 16px;
  }

  &:last-of-type {
    border-right: none;
  }
`;

type CollapsibleRowProps = {
  rowData: CollapsibleRowType;
};

const CollapsibleRow = ({ rowData }: CollapsibleRowProps) => {
  const headers = useMemo(() => Object.keys(rowData), [rowData]);
  const values = useMemo(() => Object.values(rowData), [rowData]);
  const rows = useMemo(() => [headers, values], [headers, values]);

  const isHeader = (rowIndex: number) => (rowIndex === 0 ? true : false);

  const getCellWidth = useCallback((row: (typeof rows)[0]) => {
    const cellWidth = 100 / row.length;
    return `${cellWidth}%`;
  }, []);

  return (
    <>
      {/* 헤더와 내용 각각 1줄씩 출력을 위해 rows 배열에 넣어 순회 */}
      {rows.map((row, rowIndex) => (
        // 실제 테이블의 행을 출력
        <Row
          key={rowIndex}
          className={isHeader(rowIndex) ? headerClassName : contentClassName}
        >
          {row.map((content, columnIndex) => (
            <Cell
              key={columnIndex}
              className={isHeader(rowIndex) ? 'th' : 'td'}
              sx={{
                width: getCellWidth(row),
              }}
            >
              {formatStringForTable(String(content))}
            </Cell>
          ))}
        </Row>
      ))}
    </>
  );
};

export default CollapsibleRow;
