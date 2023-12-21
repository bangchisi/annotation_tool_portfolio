import { Box, styled } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { VisibleRowType } from 'routes/Models/logTypes';
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
  border-bottom: 1px solid rgb(224, 224, 224);
  color: #0e1116;

  &.flex-header {
    /*  */
  }

  &:first-of-type > .th:first-of-type {
    border-top-left-radius: 12px;
  }
  &:first-of-type > .th:last-of-type {
    border-top-right-radius: 12px;
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

const Cell = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 8px;
  border-left: 1px solid rgba(0, 0, 0, 0.04);

  &:last-of-type {
    border-left: none;
  }

  &.th {
    background-color: rgba(243, 246, 249, 0.75);
    font-weight: 500;
    padding: 8px;
    user-select: none;
  }

  &.td {
    box-sizing: initial;
    padding: 12px;
  }
`;

type VisibleRowProps = {
  rowData: VisibleRowType;
};

const FlexTableRow = ({ rowData }: VisibleRowProps) => {
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
      {rows.map((row, rowIndex) => {
        // 실제 테이블의 행을 출력
        return (
          <Row
            key={rowIndex}
            className={isHeader(rowIndex) ? headerClassName : contentClassName}
          >
            {row.map((content, columnIndex) => {
              return (
                <Cell
                  key={columnIndex}
                  className={isHeader(rowIndex) ? 'th' : 'td'}
                  sx={{
                    width: getCellWidth(row),
                  }}
                >
                  {formatStringForTable(String(content))}
                </Cell>
              );
            })}
          </Row>
        );
      })}
    </>
  );
};

export default FlexTableRow;
