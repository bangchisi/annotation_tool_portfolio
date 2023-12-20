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
import { Fragment, useCallback, useState } from 'react';
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

  const [editSuperDatasetName, setEditSuperDatasetName] =
    useState(superDatasetName);
  const [editDatasetName, setEditDatasetName] = useState(datasetName);
  const [editDescription, setEditDescription] = useState(description);

  const resetForm = useCallback(() => {
    setEditDatasetName(datasetName);
    setEditSuperDatasetName(superDatasetName);
    setEditDescription(description);
  }, [
    setEditDatasetName,
    setEditSuperDatasetName,
    setEditDescription,
    datasetName,
    superDatasetName,
    description,
  ]);

  const hasEmpty = useCallback(() => {
    if (!editSuperDatasetName || !editDatasetName) return true;
    return false;
  }, [editSuperDatasetName, editDatasetName]);

  const onDatasetUpdate = useCallback(
    async (datasetId: number) => {
      if (!editSuperDatasetName.trim() || !editDatasetName.trim()) return;
      if (
        datasetName === editDatasetName &&
        superDatasetName === editSuperDatasetName &&
        description === editDescription
      )
        return;

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
        getDataset(datasetId);
      }
    },
    [
      editSuperDatasetName,
      editDatasetName,
      editDescription,
      getDataset,
      datasetName,
      superDatasetName,
      description,
    ],
  );

  const onEscapeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        setIsEdit(false);
        resetForm();
      } else if (e.key === 'Enter') {
        setIsEdit(false);
        if (hasEmpty()) {
          resetForm();
          return;
        }
        onDatasetUpdate(datasetId);
      }
    },
    [setIsEdit, onDatasetUpdate, datasetId, resetForm, hasEmpty],
  );

  const onClick = useCallback(() => {
    setIsEdit((prev) => !prev);
    if (hasEmpty()) {
      resetForm();
      return;
    }
    if (!isEdit) return;
    onDatasetUpdate(datasetId);
  }, [isEdit, setIsEdit, onDatasetUpdate, datasetId, hasEmpty, resetForm]);

  return (
    <Container className="information-step">
      {isOnTrain && <ComponentBlocker message="현재 학습중인 Dataset입니다." />}
      <TitleContainer>
        {isEdit && (
          <Fragment>
            <NameField
              value={editSuperDatasetName}
              placeholder="super dataset name"
              size="small"
              onChange={(e) => setEditSuperDatasetName(e.target.value)}
              onKeyDown={onEscapeKeyDown}
            />
            /
            <NameField
              value={editDatasetName}
              placeholder="dataset name"
              size="small"
              onChange={(e) => setEditDatasetName(e.target.value)}
              onKeyDown={onEscapeKeyDown}
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
          onClick={onClick}
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
            onKeyDown={onEscapeKeyDown}
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
