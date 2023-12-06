import { Button, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Container,
  TitleContainer,
  ContentContainer,
  NameField,
  DescriptionField,
} from './Information.style';
import { DatasetType } from '../Dataset';
import { getFormattedDate } from 'helpers/DateHelpers';
import CategoryPanel from './CategoryPanel/CategoryPanel';
import ComponentBlocker from 'components/ComponentBlocker/ComponentBlocker';
import { Fragment, useEffect, useState } from 'react';
import DatasetModel from '../models/Dataset.model';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

interface InformationProps extends DatasetType {
  isOnTrain: boolean;
  handleCategoryDeleted: () => void;
  handleCategoryAdded: () => void;
  getDataset: (datasetId: number | undefined) => Promise<void>;
}

export default function Information(props: InformationProps) {
  const {
    datasetId,
    superDatasetName,
    datasetName,
    created,
    description,
    categories,
    isOnTrain,
    handleCategoryDeleted,
    handleCategoryAdded,
    getDataset,
  } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDatasetUpdate = async (datasetId: number) => {
    if (!editSuperDatasetName || !editDatasetName) return;
    setIsLoading(true);
    try {
      await DatasetModel.updateDataset(
        datasetId,
        editSuperDatasetName,
        editDatasetName,
        editDescription,
      );
    } catch (error) {
      axiosErrorHandler(error, 'Failed to update dataset information.');
    } finally {
      setIsLoading(false);
      getDataset(datasetId);
    }
  };

  useEffect(() => {
    if (!isEdit) {
      onDatasetUpdate(datasetId);
    }
  }, [isEdit]);

  const [editSuperDatasetName, setEditSuperDatasetName] =
    useState(superDatasetName);
  const [editDatasetName, setEditDatasetName] = useState(datasetName);
  const [editDescription, setEditDescription] = useState(description);

  return (
    <Container>
      {/* {isLoading && (
        <LoadingSpinner message="Dataset 정보 업데이트 중입니다.." />
      )} */}
      {isOnTrain && <ComponentBlocker message="현재 학습중인 Dataset입니다." />}
      <TitleContainer>
        {isEdit && (
          <Fragment>
            <NameField
              value={editSuperDatasetName}
              placeholder="super dataset name"
              size="small"
              onChange={(e) => setEditSuperDatasetName(e.target.value)}
            />
            /
            <NameField
              value={editDatasetName}
              placeholder="dataset name"
              size="small"
              onChange={(e) => setEditDatasetName(e.target.value)}
            />
          </Fragment>
        )}
        {!isEdit && (
          <Typography variant="h6" className="title">
            {superDatasetName}/{datasetName}
          </Typography>
        )}
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
          onClick={() => setIsEdit((prev) => !prev)}
        >
          <EditOutlinedIcon
            sx={{
              color: 'gray',
            }}
          />
        </Button>
        <span style={{ marginLeft: 'auto' }} className="created">
          created {getFormattedDate(created)}
        </span>
      </TitleContainer>
      <ContentContainer>
        <Typography variant="h6" className="description">
          Description
        </Typography>
        {isEdit && (
          <DescriptionField
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            multiline
          />
        )}
        {!isEdit && <span className="content">{description}</span>}
        <CategoryPanel
          handleCategoryAdded={handleCategoryAdded}
          handleCategoryDeleted={handleCategoryDeleted}
          categories={categories}
        />
      </ContentContainer>
    </Container>
  );
}
