import { Button, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Container,
  TitleContainer,
  ContentContainer,
} from './Information.style';
import { DatasetType } from '../Dataset';
import { getFormattedDate } from 'helpers/DateHelpers';
import CategoryPanel from './CategoryPanel/CategoryPanel';
import ComponentBlocker from 'components/ComponentBlocker/ComponentBlocker';

interface InformationProps extends DatasetType {
  isOnTrain: boolean;
  handleCategoryDeleted: () => void;
  handleCategoryAdded: () => void;
}

export default function Information(props: InformationProps) {
  const {
    datasetName,
    created,
    description,
    categories,
    isOnTrain,
    handleCategoryDeleted,
    handleCategoryAdded,
  } = props;
  return (
    <Container>
      {isOnTrain && <ComponentBlocker message="현재 학습중인 Dataset입니다." />}
      <TitleContainer>
        <Typography variant="h6" className="title">
          {datasetName}
          <Button
            color="primary"
            sx={{
              minWidth: '32px',
              width: '32px',
              height: '32px',
              borderRadius: '32px',
              padding: 0,
              marginLeft: '8px',
            }}
          >
            <MoreHorizIcon
              sx={{
                color: 'gray',
              }}
            />
          </Button>
        </Typography>
        <span className="created">created {getFormattedDate(created)}</span>
      </TitleContainer>
      <ContentContainer>
        <Typography variant="h6" className="description">
          Description
        </Typography>
        <span className="content">{description}</span>
        <CategoryPanel
          handleCategoryAdded={handleCategoryAdded}
          handleCategoryDeleted={handleCategoryDeleted}
          categories={categories}
        />
      </ContentContainer>
    </Container>
  );
}
