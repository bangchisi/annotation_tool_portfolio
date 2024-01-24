import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { AxiosError } from 'axios';
import ComponentBlocker from 'components/ComponentBlocker/ComponentBlocker';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { axiosErrorHandler, typedAxios } from 'helpers/Axioshelpers';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, FilesLabel } from './Controls.style';
import TrainStartModal from './TrainStartModal/TrainStartModal';
import { DatasetType } from '../Dataset';
import { KeyedMutator } from 'swr';
import { useTypedSWR, useTypedSWRMutation } from 'hooks';
import useSWRMutation from 'swr/mutation';

// 폴더 업로드를 위한 input 엘리먼트 제너릭 선언
declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

// Controls 컴포넌트 props 타입
interface ControlsProps {
  isOnTrain: boolean; // 학습 중인지 여부
  setIsOnTrain: React.Dispatch<React.SetStateAction<boolean>>; // 학습 중인지 여부를 변경하는 함수
  reload: KeyedMutator<DatasetType>; // dataset 데이터를 다시 불러오는 함수
}

// AnnotatedImagesType 타입
type AnnotatedImagesType = {
  num_total_images: number; // 전체 이미지 개수
  num_annotated_images: number; // annotated 된 이미지 개수
};

// Controls 컴포넌트
export default function Controls(props: ControlsProps) {
  const { isOnTrain, reload } = props; // props 디스트럭처링
  const datasetId = Number(useParams().datasetId); // 데이터셋 고유 ID
  const [isLoading, setIsLoading] = useState(false); // 이미지 업로드 중 여부
  const filesInput = useRef<HTMLInputElement>(null); // 파일 업로드를 위한 input 엘리먼트
  const [finetuneName, setFinetuneName] = useState(''); // 생성할 모델 이름
  const [baseModelName, setBaseModelName] = useState('vit_b'); // 기반 모델 이름

  // annotated 이미지 목록 요청
  const { data: annotatedImages } = useTypedSWR<AnnotatedImagesType>({
    method: 'get',
    endpoint: `/dataset/annotated/${datasetId}`,
  });

  // 이미지 업로드 fetcher
  const uploadFetcher = async (
    url: string,
    { arg }: { arg: { images: FormData } },
  ) => {
    return typedAxios('post', `/image?dataset_id=${datasetId}`, arg.images);
  };

  // 이미지 업로드 mutation
  const { trigger: uploadImage } = useSWRMutation(
    `/dataset/${datasetId}`,
    uploadFetcher,
  );

  // 모델 학습 fetcher
  const { trigger: queue } = useTypedSWRMutation<{
    message: string;
    finetuneId: number;
  }>(
    {
      method: 'post',
      endpoint: '/finetune/queue',
    },
    {
      dataset_id: datasetId,
      vit_model_type: 'vit_b',
      finetune_name: finetuneName,
    },
  );

  // 이미지 업로드 함수
  const uploadImages = async (
    datasetId: number | undefined, // 데이터셋 고유 ID
    images: FormData, // 업로드할 이미지 목록
  ) => {
    // 데이터셋 고유 ID가 없거나 이미지 목록이 없으면 함수 종료
    if (!datasetId) return;
    if (!images) return;

    try {
      // 이미지 업로드 중임을 표시
      setIsLoading(true);
      // 이미지 업로드 요청
      await uploadImage({ images });
    } catch (error) {
      axiosErrorHandler('error', 'Failed to upload images');
      // 중복된 이미지가 있을 경우를 처리
      const { response } = error as AxiosError<{
        detail: {
          existedFilenames: string[];
          numInsertedImages: number;
        };
      }>;

      // 중복된 이미지가 없으면 함수 종료
      if (!response) return;

      // 중복된 이미지가 있으면 알림
      const { numInsertedImages, existedFilenames } = response.data.detail;
      alert(`${numInsertedImages}개 이미지가 업로드 되었습니다. 다음 중복된 ${
        existedFilenames.length
      }개 이미지는 업로드되지 않았습니다.
      ${existedFilenames.join(', ')}
      `);
    } finally {
      // 이미지 목록 갱신, 이미지 로딩 해제
      reload();
      setIsLoading(false);
    }
  };

  // 이미지 파일 or 폴더를 선택하고 확인 누르면 실행
  const onFilesChange = async (
    event: React.ChangeEvent<HTMLInputElement>, // input 엘리먼트 이벤트
    isFolder?: boolean, // 폴더 업로드 여부
  ) => {
    const files = event.target.files; // 선택한 파일 목록

    // 선택한 파일 목록이 없으면 함수 종료
    if (!files) return;
    if (files.length <= 0) return;

    const chunkSize = 1000; // 한 번에 업로드할 이미지 개수

    // 선택한 파일 목록을 chunkSize 개수만큼 나눠서 업로드
    for (let i = 0; i < files.length; i += chunkSize) {
      const formData = new FormData(); // 업로드할 이미지 목록

      // 선택한 파일 목록 중 chunkSize 개수만큼 업로드할 이미지 목록에 추가
      for (let j = i; j < Math.min(i + chunkSize, files.length); j++) {
        // 폴더 업로드일 경우 MIP 파일만 업로드
        if (isFolder && !files[j].name.match(/mip\.(jpg|png|tiff)$/i)) continue;
        formData.append('images', files[j]);
      }

      // 선택한 파일 목록이 없으면 함수 종료
      if (!formData.getAll('images').length) {
        alert('해당 폴더에 MIP 파일이 없습니다.');
        continue;
      }

      // 이미지 업로드 함수 호출
      await uploadImages(Number(datasetId), formData);
    }
  };

  // 모델 학습 시작 함수
  const onTrainStart = async () => {
    const validation = await isEnoughSamples(); // 충분한 annotated 이미지가 있는지 확인

    // 충분한 annotated 이미지가 없으면 함수 종료
    if (!validation) return;

    try {
      await queue();
      alert(`${baseModelName} 기반 ${finetuneName} 모델 학습을 시작했습니다.`);
    } catch (error) {
      alert('중복된 모델 이름입니다. 다른 이름을 사용해주세요');
    }
  };

  // 충분한 annotated 이미지가 있는지 확인하는 함수
  async function isEnoughSamples() {
    const criteria = 2; // 최소 annotated 이미지 개수

    // annotated 이미지 목록이 없으면 함수 종료
    if (!annotatedImages) return false;

    const { num_annotated_images } = annotatedImages; // 형식: { num_total_images, num_annotated_images }

    const result = num_annotated_images >= criteria; // 충분한 annotated 이미지가 있는지 여부

    // 충분한 annotated 이미지가 없으면 알림
    if (!result)
      alert(
        `최소 2개 이미지가 annotated 상태여야 합니다.
        현재 annotated 이미지 (${num_annotated_images}개)`,
      );

    // 충분한 annotated 이미지가 있으면 true 반환
    return result;
  }

  // 렌더링
  return (
    <Container>
      {/* 학습 중이면 컴포넌트 블로커 표시 (인터렉션 불가) */}
      {isOnTrain && <ComponentBlocker message="" />}
      {/* finetune 학습 모달 */}
      <TrainStartModal
        onTrainStart={onTrainStart}
        baseModelName={baseModelName}
        setBaseModelName={setBaseModelName}
        finetuneName={finetuneName}
        setFinetuneName={setFinetuneName}
        datasetId={datasetId}
      />
      {/* 폴더 업로드 */}
      <form>
        <label htmlFor=""></label>
        <input
          style={{ display: 'none' }}
          id="folderInput"
          ref={filesInput}
          name="images"
          type="file"
          accept="image/*"
          onChange={(event) => onFilesChange(event, true)}
          webkitdirectory=""
        />
        <FilesLabel
          className="folder-upload-step"
          htmlFor="folderInput"
          sx={{ marginRight: '20px' }}
        >
          <div>
            <DriveFolderUploadOutlinedIcon fontSize="medium" />
            <span>폴더 업로드</span>
          </div>
        </FilesLabel>
      </form>
      {/* 사진 업로드 */}
      <form>
        <label htmlFor=""></label>
        <input
          style={{ display: 'none' }}
          id="filesInput"
          ref={filesInput}
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={onFilesChange}
        />
        <FilesLabel className="upload-step" htmlFor="filesInput">
          <div>
            <CloudUploadRoundedIcon fontSize="medium" />
            <span>사진 업로드</span>
          </div>
        </FilesLabel>
      </form>
      {/* 이미지 업로드 중이면 로딩 스피너 표시 */}
      {isLoading && (
        <LoadingSpinner message="이미지 업로드 중입니다. 잠시만 기다려주세요." />
      )}
    </Container>
  );
}
