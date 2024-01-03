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
import { KeyedMutator } from 'swr';
import { useTypedSWRMutation } from 'hooks';

interface InformationProps extends DatasetType {
  isOnTrain: boolean;
  reload: KeyedMutator<DatasetType>;
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
  } = props;
  const [isEdit, setIsEdit] = useState(false);

  const [editSuperDatasetName, setEditSuperDatasetName] =
    useState(superDatasetName);
  const [editDatasetName, setEditDatasetName] = useState(datasetName);
  const [editDescription, setEditDescription] = useState(description);
  const { trigger } = useTypedSWRMutation(
    { method: 'put', endpoint: '/dataset', key: `/dataset/${datasetId}` },
    {
      dataset_id: datasetId,
      dataset_name: editDatasetName,
      superdataset_name: editSuperDatasetName,
      description: editDescription,
    },
  );

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

  const validation = useCallback(() => {
    if (editSuperDatasetName.length > 255) {
      alert('super dataset name은 255자 이하로 입력해주세요.');
      return false;
    }
    if (editDatasetName.length > 45) {
      alert('dataset name은 45자 이하로 입력해주세요.');
      return false;
    }

    return true;
  }, [editSuperDatasetName, editDatasetName]);

  const hasEmpty = useCallback(() => {
    if (!editSuperDatasetName || !editDatasetName) return true;
    return false;
  }, [editSuperDatasetName, editDatasetName]);

  const onDatasetUpdate = useCallback(async () => {
    if (!editSuperDatasetName.trim() || !editDatasetName.trim()) return;
    if (
      datasetName === editDatasetName &&
      superDatasetName === editSuperDatasetName &&
      description === editDescription
    )
      return;

    trigger();
  }, [
    trigger,
    datasetName,
    editDatasetName,
    superDatasetName,
    editSuperDatasetName,
    description,
    editDescription,
  ]);

  const onEscapeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        setIsEdit(false);
        resetForm();
      } else if (e.key === 'Enter') {
        setIsEdit(false);
        const validationCheck = validation();
        if (!validationCheck) {
          resetForm();
          return;
        }
        if (hasEmpty()) {
          resetForm();
          return;
        }
        onDatasetUpdate();
      }
    },
    [setIsEdit, onDatasetUpdate, resetForm, hasEmpty, validation],
  );

  const onClick = useCallback(() => {
    setIsEdit((prev) => !prev);
    const validationCheck = validation();
    if (!validationCheck) {
      resetForm();
      return;
    }

    if (hasEmpty()) {
      resetForm();
      return;
    }
    if (!isEdit) return;
    onDatasetUpdate();
  }, [isEdit, setIsEdit, onDatasetUpdate, hasEmpty, resetForm, validation]);

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
        <CategoryPanel categories={categories} />
      </ContentContainer>
    </Container>
  );
}
