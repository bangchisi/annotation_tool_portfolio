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

  const onDatasetUpdate = async (datasetId: number) => {
    if (!editSuperDatasetName || !editDatasetName) {
      alert('super dataset과 dataset의 이름을 입력해주세요.');
      setEditSuperDatasetName(superDatasetName);
      setEditDatasetName(datasetName);
      setEditDescription(description);
      return;
    }
    try {
      await DatasetModel.updateDataset(
        datasetId,
        editSuperDatasetName,
        editDatasetName,
        editDescription,
      );
    } catch (error) {
      axiosErrorHandler(error, 'Failed to update dataset information.');
    }
  };

  const [editSuperDatasetName, setEditSuperDatasetName] =
    useState(superDatasetName);
  const [editDatasetName, setEditDatasetName] = useState(datasetName);
  const [editDescription, setEditDescription] = useState(description);

  return (
    <Container>
      {isOnTrain && <ComponentBlocker message="현재 학습중인 Dataset입니다." />}
      <TitleContainer>
        {isEdit && (
          <Fragment>
            <NameField
              value={editSuperDatasetName}
              placeholder="super dataset name"
              size="small"
              label="super dataset name"
              onChange={(e) => setEditSuperDatasetName(e.target.value)}
            />
            <Typography variant="h6" className="slash">
              /
            </Typography>
            <NameField
              value={editDatasetName}
              placeholder="dataset name"
              size="small"
              label="dataset name"
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
          onClick={() => {
            if (isEdit) {
              onDatasetUpdate(datasetId).then(() => getDataset(datasetId));
            }
            setIsEdit((prev) => !prev);
          }}
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
            size="small"
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
