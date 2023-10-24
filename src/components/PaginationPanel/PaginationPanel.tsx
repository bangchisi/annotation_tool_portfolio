import { Pagination, PaginationItem } from '@mui/material';
import { Container } from './PaginationPanel.style';

interface PaginationProps {
  onCurrentPageChange: (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => void;
  currentPage: number;
  lastPage: number;
}

export default function PaginationPanel(props: PaginationProps) {
  const { onCurrentPageChange, currentPage, lastPage } = props;
  return (
    <Container>
      <Pagination
        onChange={onCurrentPageChange}
        defaultPage={1}
        count={lastPage}
        page={currentPage}
        renderItem={(item) => <PaginationItem {...item} />}
      />
    </Container>
  );
}
