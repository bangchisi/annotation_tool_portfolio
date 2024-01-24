import { useAppDispatch, useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import PaginationPanel from 'components/PaginationPanel/PaginationPanel';
import { typedAxios } from 'helpers/Axioshelpers';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { setTool } from 'routes/Annotator/slices/annotatorSlice';
import { Tool } from 'types';
import Controls from './Controls/Controls';
import { Container, Content } from './Dataset.style';
import ImageList from './ImageList/ImageList';
import Information from './Information/Information';
import { useTypedSWR } from 'hooks';
import { LogType } from 'routes/Models/logTypes';
import useSWRMutation from 'swr/mutation';

// Dataset 컴포넌트 props 타입
export interface DatasetType {
  superDatasetName: string; // 상위 데이터셋 이름
  datasetId: number; // 데이터셋 고유 ID
  datasetName: string; // 데이터셋 이름
  lastUpdate: string; // 마지막 업데이트 날짜
  created: string; // 생성 날짜
  description: string; // 데이터셋 설명
  directory: string; // 데이터셋 디렉토리
  categories: CategoryType[]; // 데이터셋 카테고리 목록
  numImages: number; // 데이터셋 이미지 수
  numPages: number; // 데이터셋 페이지 수
  imageIds: number[][]; // 데이터셋 이미지 ID 목록
}

// Dataset 컴포넌트 카테고리 타입
export interface CategoryType {
  categoryId: number; // 카테고리 고유 ID
  name: string; // 카테고리 이름
  color: string; // 카테고리 색상
  superCategory: string; // 상위 카테고리 이름
}

// Dataset 컴포넌트
export default function Dataset() {
  const userId = useAppSelector((state) => state.auth.user.userId); // 로그인한 사용자 ID
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const datasetId = Number(useParams().datasetId); // 데이터셋 고유 ID
  const dispatch = useAppDispatch(); // 디스패치 함수
  const [isOnTrain, setIsOnTrain] = useState(false); // 학습 중 여부, 학습 중이면 인터렉션 비활성화

  // 데이터셋 정보 요청
  const { data, isLoading, error, mutate } = useTypedSWR<DatasetType>({
    method: 'get',
    endpoint: `/dataset/${datasetId}`,
  });

  // finetune 모델 목록 요청
  const { data: finetuneList } = useTypedSWR<LogType[]>({
    method: 'get',
    endpoint: `/finetune/${userId}`,
  });

  // 이미지 삭제 fetcher 함수
  const deleteImageFetcher = async (
    url: string,
    { arg }: { arg: { imageId: number } },
  ) => {
    return typedAxios('delete', `/image/${arg.imageId}`);
  };

  // 이미지 삭제 트리거
  const { trigger: deleteImageTrigger } = useSWRMutation(
    `/dataset/${datasetId}`,
    deleteImageFetcher,
  );

  // 이미지 삭제 함수
  async function deleteImage(imageId: number) {
    // 삭제 확인
    const confirmDelete = confirm('정말로 삭제하시겠습니까?');
    // 취소하면 종료
    if (!confirmDelete) return;

    // 이미지 삭제 요청
    await deleteImageTrigger({ imageId });
  }

  // 페이지 변경 이벤트
  const onCurrentpageChange = (
    event: React.ChangeEvent<unknown>, // 이벤트
    page: number, // 변경할 페이지
  ) => {
    // 현재 페이지 변경
    setCurrentPage(page);
  };

  // 처음 진입 혹은 뒤로가기로 데이터셋 페이지로 돌아왔을 때
  useEffect(() => {
    if (!datasetId) return;
    // 선택한 툴을 select tool로 변경
    dispatch(setTool(Tool.Select));
    // 현재 페이지를 1로 설정
    mutate();
  }, [datasetId, dispatch, mutate]);

  // 학습 여부 변경 시 인터렉션 비활성화를 위한 useEffect
  useEffect(() => {
    const log = finetuneList?.find(
      (log) => log.datasetId === datasetId && !log.isDone,
    );

    // 학습 여부에 따라 학습 여부 상태 설정
    if (!log) setIsOnTrain(false);
    else setIsOnTrain(true);
  }, [finetuneList, datasetId, setIsOnTrain]);

  // 데이터셋이 비어있는지 여부
  const isImageListEmpty = useMemo(() => {
    if (!data) {
      return true;
    }

    // 현재 페이지가 1이고, 이미지 ID 목록이 비어있으면 true
    if (
      currentPage === 1 &&
      data.imageIds.length === 0 &&
      data.imageIds.length === 0
    ) {
      return true;
    } else {
      return false;
    }
  }, [data, currentPage]);

  const [hasScroll, setHasScroll] = useState(false); // 스크롤 여부

  // 스크롤 여부 감지
  useEffect(() => {
    const detectScroll = () => {
      const { scrollHeight } = document.body; // 스크롤 높이
      const viewportHeight = window.innerHeight; // 뷰포트 높이

      // 스크롤 높이가 뷰포트 높이보다 크면 스크롤이 있는 것으로 판단
      if (scrollHeight > viewportHeight) {
        setHasScroll(true);
      } else {
        setHasScroll(false);
      }
    };

    // 스크롤 감지 실행
    detectScroll();
    // 스크롤 감지 debounce
    const debounceDetectScroll = debounce(detectScroll, 50);
    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', debounceDetectScroll);

    // 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('resize', debounceDetectScroll);
    };
  }, [data, data?.imageIds]);

  // 에러 발생 시
  if (error) {
    console.log('Dataset.tsx error');
    console.dir(error);
  }

  // 데이터 로딩 중일 때
  if (isLoading) {
    return (
      <LoadingSpinner message="데이터셋을 불러오는 중입니다. 잠시만 기다려주세요." />
    );
  }

  // 렌더링
  return (
    <Container id="dataset">
      {/* 상단 기능 패널 */}
      <Controls
        isOnTrain={isOnTrain}
        setIsOnTrain={setIsOnTrain}
        reload={mutate}
      />
      {data && (
        <>
          {/* 데이터셋 정보 */}
          <Information {...data} isOnTrain={isOnTrain} reload={mutate} />
          <Content>
            {/* 상단 pagination 버튼 */}
            {!isImageListEmpty && (
              <PaginationPanel
                onCurrentPageChange={onCurrentpageChange}
                currentPage={currentPage}
                lastPage={data.imageIds.length}
              />
            )}
            {/* 이미지 목록 */}
            <ImageList
              imageIds={data.imageIds[currentPage - 1]}
              deleteImage={deleteImage}
              isOnTrain={isOnTrain}
            />
            {/* 하단 pagination 버튼 */}
            {!isImageListEmpty && hasScroll && (
              <PaginationPanel
                onCurrentPageChange={onCurrentpageChange}
                currentPage={currentPage}
                lastPage={data.imageIds.length}
              />
            )}
          </Content>
        </>
      )}
    </Container>
  );
}
