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

// Dataset 정보 컴포넌트 props 타입. DatasetType을 상속받음.
interface InformationProps extends DatasetType {
  isOnTrain: boolean; // 학습 중인지 여부
  reload: KeyedMutator<DatasetType>;
}

// Dataset 정보 컴포넌트
export default function Information(props: InformationProps) {
  const {
    datasetId, // 데이터셋 ID
    superDatasetName, // 대분류 이름
    datasetName, // 데이터셋 이름
    created, // 생성 날짜
    description, // 데이터셋 설명
    categories, // 카테고리 목록
    isOnTrain, // 학습 중인지 여부
  } = props;
  const [isEdit, setIsEdit] = useState(false); // 수정 모드인지 여부

  const [editSuperDatasetName, setEditSuperDatasetName] =
    useState(superDatasetName); // 수정 중인 대분류 이름
  const [editDatasetName, setEditDatasetName] = useState(datasetName); // 수정 중인 데이터셋 이름
  const [editDescription, setEditDescription] = useState(description); // 수정 중인 데이터셋 설명

  // 수정 요청
  const { trigger } = useTypedSWRMutation(
    { method: 'put', endpoint: '/dataset', key: `/dataset/${datasetId}` },
    {
      dataset_id: datasetId,
      dataset_name: editDatasetName,
      superdataset_name: editSuperDatasetName,
      description: editDescription,
    },
  );

  // 수정 내용 초기화
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

  // 유효성 검사. 대분류 이름과 데이터셋 이름의 길이가 255, 45를 넘지 않도록 함.
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

  // 수정 중인 데이터셋 이름이나 대분류 이름이 비어있는지 여부
  const hasEmpty = useCallback(() => {
    if (!editSuperDatasetName || !editDatasetName) return true;
    return false;
  }, [editSuperDatasetName, editDatasetName]);

  // 데이터셋 수정 핸들러
  const onDatasetUpdate = useCallback(async () => {
    if (!editSuperDatasetName.trim() || !editDatasetName.trim()) return;
    if (
      datasetName === editDatasetName &&
      superDatasetName === editSuperDatasetName &&
      description === editDescription
    )
      return;

    // 데이터셋 정보 수정 요청
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

  // ESC 키 입력 이벤트 핸들러
  const onEscapeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        // ESC 키 입력 시 수정 모드 종료. 수정 내용 초기화
        setIsEdit(false);
        resetForm();
      } else if (e.key === 'Enter') {
        // Enter 키 입력 시 수정 모드 종료. 수정 내용 반영
        setIsEdit(false);

        // 유효성 검사
        const validationCheck = validation();
        if (!validationCheck) {
          resetForm();
          return;
        }
        if (hasEmpty()) {
          resetForm();
          return;
        }

        // 유효성 검사 통과 시 수정 내용 반영
        onDatasetUpdate();
      }
    },
    [setIsEdit, onDatasetUpdate, resetForm, hasEmpty, validation],
  );

  // 수정 버튼 클릭 이벤트 핸들러
  const onClick = useCallback(() => {
    // 수정 모드 전환
    setIsEdit((prev) => !prev);

    // 유효성 검사
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

    // 유효성 검사 통과 시 수정 내용 반영
    onDatasetUpdate();
  }, [isEdit, setIsEdit, onDatasetUpdate, hasEmpty, resetForm, validation]);

  return (
    <Container className="information-step">
      {/* 학습 중인 데이터셋이면 인터렉션 막음 */}
      {isOnTrain && <ComponentBlocker message="현재 학습중인 Dataset입니다." />}
      <TitleContainer>
        {/* 수정 모드일때 */}
        {isEdit && (
          <Fragment>
            {/* 대분류 수정 입력 */}
            <NameField
              value={editSuperDatasetName}
              placeholder="super dataset name"
              size="small"
              onChange={(e) => setEditSuperDatasetName(e.target.value)}
              onKeyDown={onEscapeKeyDown}
            />
            /{/* 데이터셋 수정 입력 */}
            <NameField
              value={editDatasetName}
              placeholder="dataset name"
              size="small"
              onChange={(e) => setEditDatasetName(e.target.value)}
              onKeyDown={onEscapeKeyDown}
            />
          </Fragment>
        )}
        {/* 수정 모드가 아닐 때 */}
        {!isEdit && (
          // 대분류,데이터셋 이름 표시
          <Typography variant="h6" className="title">
            {superDatasetName}/{datasetName}
          </Typography>
        )}
        {/* 수정 버튼 */}
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
        {/* 데이터셋 생성 날짜 */}
        <span style={{ marginLeft: 'auto' }} className="created">
          created {getFormattedDate(created)}
        </span>
      </TitleContainer>
      <ContentContainer>
        {/* 데이터셋 설명 */}
        <Typography variant="h6" className="description">
          Description
        </Typography>
        {/* 수정 모드일때 */}
        {isEdit && (
          <DescriptionField
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={onEscapeKeyDown}
            multiline
          />
        )}
        {/* 수정 모드가 아닐 때 */}
        {!isEdit && <span className="content">{description}</span>}
        <CategoryPanel categories={categories} />
      </ContentContainer>
    </Container>
  );
}
