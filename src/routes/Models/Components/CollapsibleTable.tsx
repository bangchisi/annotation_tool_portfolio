import styled from '@emotion/styled';
import { Box, Collapse, Container, Paper } from '@mui/material';
import CollapsibleRow from 'routes/Models/Components/CollapsibleRow';
import { CollapsibleRowType } from 'routes/Models/logTypes';

const Wrapper = styled(Container)`
  background-color: rgb(243, 246, 249);
  padding: 24px;
  box-shadow: inset 0 3px 6px 0 rgba(0 0 0 / 0.08);
`;
const CollapsibleTableContainer = styled(Box)`
  /*  */
`;
const CollapsibleTableBody = styled(Paper)`
  background-color: rgb(243, 246, 249);
  box-shadow: none;
`;

type CollapsibleTableProps = {
  rowData: CollapsibleRowType[];
  open: boolean;
};

const CollapsibleTable = ({ rowData, open }: CollapsibleTableProps) => {
  return (
    <Collapse in={open} timeout="auto">
      <Wrapper>
        <CollapsibleTableContainer>
          <CollapsibleTableBody>
            {rowData.map((row, index) => (
              <CollapsibleRow key={index} rowData={row} />
            ))}
          </CollapsibleTableBody>
        </CollapsibleTableContainer>
      </Wrapper>
    </Collapse>
  );
};

export default CollapsibleTable;
