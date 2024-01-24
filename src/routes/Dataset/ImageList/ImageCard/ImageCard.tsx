import { Button } from '@mui/material';
import classnames from 'classnames';
import ComponentBlocker from 'components/ComponentBlocker/ComponentBlocker';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { getImagePath } from 'helpers/ImagesHelpers';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Container,
  ImageContainer,
  ImageContainerPadding,
  ImageLink,
  Title,
  TitleContainer,
  Wrapper,
} from './ImageCard.style';
import { useTypedSWR } from 'hooks';

// ImageCard 컴포넌트 props 타입
interface ImageCardProps {
  imageId: number; // 이미지 고유 ID
  deleteImage: (imageId: number) => Promise<void>; // 이미지 삭제 함수
  isOnTrain: boolean; // 학습 중인지 여부
}

// 이미지 정보 타입
interface ImageInfo {
  isAnnotated: boolean; // annotated 여부
  filename: string; // 파일 이름
}

// ImageCard 컴포넌트
export default function ImageCard(props: ImageCardProps) {
  const [imageInfo, setImageInfo] = useState<ImageInfo | undefined>(undefined); // 이미지 정보
  const { imageId, deleteImage, isOnTrain } = props;

  const imagePath = getImagePath(Number(imageId), 200); // 이미지 경로
  const link = `/annotator/${imageId}`; // 이미지 클릭 시 이동할 링크

  // 이미지 정보 요청
  const { data, error } = useTypedSWR<{
    filename: string;
    isAnnotated: boolean;
  }>({
    method: 'get',
    endpoint: `/image/info/${imageId}`,
  });

  // 이미지 정보 설정
  // FIX: setImageInfo를 사용하는 방법은 비효율적이라 생각. 초기에 이미지 정보를 같이 받아서 처리하는게 좋아보임.
  useEffect(() => {
    const fetchImageInfo = async () => {
      try {
        if (data) {
          setImageInfo(data);
        } else {
          setImageInfo(undefined);
        }
      } catch (error) {
        axiosErrorHandler(error, '이미지 정보를 가져오는데 실패했습니다.');
      }
    };

    fetchImageInfo();
  }, [data]);

  const [isImageLoaded, setIsImageLoaded] = useState(false); // 이미지 로드 여부
  const imgRef = useRef<HTMLImageElement>(null); // 이미지 엘리먼트 ref

  useEffect(() => {
    // 이미지 태그에 직접 이벤트 핸들러를 바인딩하면 이벤트 핸들러가 실행되지 않을 수 있습니다.
    // 하지만 Image 클래스 인스턴스를 만들고 이미지 소스를 src 속성에 연결하면 이벤트 핸들러를 잘 실행합니다.
    const img = new Image(); // Image 클래스 인스턴스 생성
    img.src = imagePath; // 이미지 소스 설정

    // 이미지 로드 이벤트 핸들러
    img.onload = () => {
      // 이미지가 없으면 종료
      if (imgRef.current === null) return;

      const { naturalHeight: originalHeight } = imgRef.current; // 이미지 원래 높이
      const ratio = 200 / originalHeight; // 이미지 높이 비율. 썸네일 높이를 200px로 고정

      // 이미지 크기 조정
      imgRef.current.style.transform = `scale(${ratio})`;
      setIsImageLoaded(true);
    };
  }, [imagePath]);

  const [isTitleClipped, setIsTitleClipped] = useState(false); // 이미지 제목이 잘리는지 여부
  const imgTitleRef = useRef<HTMLSpanElement>(null); // 이미지 제목 엘리먼트 ref
  useEffect(() => {
    if (imgTitleRef.current === null) return;
    const { offsetWidth, scrollWidth } = imgTitleRef.current; // 이미지 제목의 너비와 스크롤 너비

    // offsetWidth가 scrollWidth보다 작으면 이미지 제목이 잘린 것으로 판단
    if (offsetWidth < scrollWidth) {
      setIsTitleClipped(true);
    }
  }, [imageInfo]);

  // 이미지 제목 클래스 이름. 이미지 제목이 잘리면 clipped 클래스를 추가
  const imageTitleClassName = useMemo(
    () => classnames('image-title', isTitleClipped && 'clipped'),
    [isTitleClipped],
  );

  if (error) {
    console.log(error);
  }

  return (
    <Wrapper>
      <ImageContainerPadding />
      <Container className="image-card-step">
        {/* 학습중인 데이터셋이면 인터렉션 막음 */}
        {isOnTrain && (
          <ComponentBlocker message="현재 학습중인 이미지입니다." />
        )}
        {/* 썸네일 */}
        <ImageLink to={link}>
          <ImageContainer>
            <img
              src={imagePath}
              ref={imgRef}
              style={{
                visibility: isImageLoaded ? 'visible' : 'hidden',
              }}
            />
          </ImageContainer>
          {/* 이미지 이름 */}
          <TitleContainer className="image-title-container">
            <Title ref={imgTitleRef} className={imageTitleClassName}>
              {imageInfo === undefined
                ? // 초기 이미지 제목은 빈 문자열로 설정
                  ''
                : // 이미지 정보 가져오기 이후 있으면 이미지 이름을 표시
                  imageInfo?.filename || 'No Image Name'}
            </Title>
          </TitleContainer>
        </ImageLink>
        {/* 이미지 삭제 버튼 */}
        <Button
          onClick={() => deleteImage(imageId)}
          disableFocusRipple={true}
          sx={{
            minWidth: '0px',
            fontSize: '0.8rem',
            padding: '4px 4px',
            justifySelf: 'flex-end',
            alignSelf: 'flex-end',
          }}
        >
          삭제
        </Button>
      </Container>
    </Wrapper>
  );
}
