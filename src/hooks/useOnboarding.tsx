import { Typography, styled } from '@mui/material';
import { StepType, useTour } from '@reactour/tour';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';

import AutoFixOffOutlinedIcon from '@mui/icons-material/AutoFixOffOutlined';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import SaveIcon from '@mui/icons-material/Save';

const ButtonContainer = styled(HelpOutlinedIcon)(() => {
  return {
    cursor: 'pointer',
    width: '2rem',
    height: '2rem',
    marginRight: '10px',
    color: '#57606A',
    '&:hover': {
      color: '#000000',
    },
  };
});

export const OnboardingContent = (
  title: string,
  descriptions: string[],
  components?: React.ReactNode,
) => {
  return (
    <>
      <Typography variant="h5">{title}</Typography>
      {descriptions.length > 0 &&
        descriptions.map((description) => (
          <>
            <br />
            <Typography key={description} variant="body1">
              {description}
            </Typography>
          </>
        ))}
      {components && components}
    </>
  );
};

export const steps: { [key: string]: StepType[] } = {
  datasets: [
    {
      selector: '.search-step',
      content: OnboardingContent('Dataset 검색', [
        'Project, Dataset, 카테고리 이름으로 검색할 수 있습니다.',
      ]),
    },
    {
      selector: '.create-dataset-step',
      content: OnboardingContent('Dataset 생성', [
        '새로운 Dataset을 생성할 수 있습니다.',
      ]),
      action: clickElement,
    },
    {
      selector: '.modal-step',
      content: OnboardingContent('Dataset 생성을 위한 항목', [
        'Super Dataset Name: 프로젝트 이름',
        'Dataset Name: Dataset 이름',
        'Description: Dataset에 대한 설명',
        'Categories: Dataset에 포함될 카테고리',
      ]),
      highlightedSelectors: ['.modal-step'],
      actionAfter: () => {
        const target = document.querySelector(
          '.close-modal-button',
        ) as HTMLElement;

        if (!target) return;
        target.click();
      },
    },
    {
      selector: '.dataset-list-step',
      content: OnboardingContent('Dataset 선택', [
        'Dataset을 선택하면 해당 Dataset 상세 페이지로 이동합니다.',
      ]),
      highlightedSelectors: ['.dataset-card'],
      action: clickElement,
      actionAfter: clickElement,
    },
  ],
  dataset: [
    {
      selector: '.upload-step',
      content: OnboardingContent('이미지 업로드', [
        '이미지를 업로드할 수 있습니다.',
        `'폴더 업로드'는 해당 폴더의 MIPS 파일만 업로드합니다.`,
        `'사진 업로드'는 MIPS가 아닌 파일도 업로드 개별로 가능합니다.`,
      ]),
      highlightedSelectors: ['.upload-step', '.folder-upload-step'],
    },
    {
      selector: '.information-step',
      content: OnboardingContent('Dataset 정보', [
        'Dataset에 대한 정보를 확인할 수 있습니다.',
        'Dataset 정보 수정과 카테고리를 추가/제거 할 수 있습니다.',
      ]),
    },
    {
      selector: '.image-card-step',
      content: OnboardingContent('이미지 카드', [
        '이미지 카드를 클릭하면 해당 이미지의 Annotator 페이지로 이동합니다.',
      ]),
    },
    {
      selector: '.train-step',
      content: OnboardingContent('모델 학습', [
        '학습을 실행할 수 있습니다.',
        '학습 중인 Dataset은 다른 사용자가 수정할 수 없습니다.',
      ]),
      action: clickElement,
    },
    {
      selector: '.modal-step',
      content: OnboardingContent('모델 학습을 위한 항목', [
        'New Model Name: 새로운 모델 이름',
        'Directory: 새로운 모델이 저장될 경로',
      ]),
      actionAfter: () => {
        const target = document.querySelector(
          '.close-modal-button',
        ) as HTMLElement;

        if (!target) return;
        target.click();
      },
    },
  ],
  annotator: [
    {
      selector: '.toolbar-step',
      content: OnboardingContent('툴바', [
        '툴바에서 원하는 툴을 선택하거나 현재 상태를 저장할 수 있습니다.',
      ]),
      position: 'right',
    },
    {
      selector: '.toolbar-step',
      content: OnboardingContent(
        '',
        [],
        <div>
          <Typography
            display="inline-block"
            variant="body1"
            fontWeight={'bold'}
          >
            <BackHandOutlinedIcon />
            Select 툴 (단축키 S)
          </Typography>
          <br />
          mask를 선택하거나 드래그로 이미지를 움직이는 도구
          <br />
          <Typography
            display="inline-block"
            variant="body1"
            fontWeight={'bold'}
          >
            <RectangleOutlinedIcon />
            Box 툴 (단축키 R)
          </Typography>
          <br />
          직사각형 mask를 생성하는 도구
          <br />
          <Typography
            display="inline-block"
            variant="body1"
            fontWeight={'bold'}
          >
            <BrushOutlinedIcon />
            Brush 툴 (단축키 B)
          </Typography>
          <br />
          브러쉬로 그림을 그려 mask를 생성하는 도구
          <br />
          브러쉬 크기는 [ 키와 ] 키로 조절할 수 있습니다.
          <br />
          <Typography
            display="inline-block"
            variant="body1"
            fontWeight={'bold'}
          >
            <AutoFixOffOutlinedIcon />
            Eraser 툴 (단축키 E)
          </Typography>
          <br />
          mask를 지우는 도구
          <br />
          <Typography
            display="inline-block"
            variant="body1"
            fontWeight={'bold'}
          >
            <FacebookOutlinedIcon />
            SAM 툴 (단축키 F)
          </Typography>
          <br />
          AI를 이용한 mask 자동생성 도구
          <br />
          <Typography
            display="inline-block"
            variant="body1"
            fontWeight={'bold'}
          >
            <SaveIcon />
            저장 (단축키 Ctrl + S)
          </Typography>
          <br />
          현재 상태를 저장
          <br />
        </div>,
      ),
      position: 'right',
    },
    {
      selector: '.category-select-step',
      content: OnboardingContent('카테고리 선택', [
        '카테고리를 선택해 해당 카테고리에 대한 작업을 진행합니다.',
      ]),
    },
    {
      selector: '.annotation-buttons-step',
      content: OnboardingContent('Annotation 버튼', [
        'Annotation을 추가하거나 일괄 삭제할 수 있습니다.',
      ]),
    },
    {
      selector: '.annotation-list-step',
      content: OnboardingContent('Annotation 목록', [
        'Annotation을 선택해 해당 annotation에 masking 작업을 할 수 있습니다.',
        '우측 쓰레기통 버튼을 클릭해 해당 annotation을 삭제할 수 있습니다.',
      ]),
    },
    {
      selector: '.canvas-step',
      content: OnboardingContent('Canvas', [
        '이미지에 대한 masking 작업을 할 수 있습니다.',
      ]),
    },
  ],
};

export const OnboardingButton = (props: { page: string }) => {
  const { setIsOpen, setCurrentStep, setSteps } = useTour();
  return (
    <ButtonContainer
      onClick={() => {
        if (!setSteps) return;
        setSteps(steps[props.page]);
        setCurrentStep(0);
        setIsOpen(true);
      }}
    />
  );
};

function clickElement(node: Element | null) {
  const element = node as HTMLElement;
  element.click();
}
