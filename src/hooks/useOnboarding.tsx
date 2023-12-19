import { Typography, styled } from '@mui/material';
import { StepType, useTour } from '@reactour/tour';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';

const ButtonContainer = styled(HelpOutlinedIcon)(() => {
  return {
    position: 'fixed',
    bottom: '5%',
    left: '2%',
    cursor: 'pointer',
    width: '3rem',
    height: '3rem',
    zIndex: 1000,
    '&:hover': {
      color: '#3f51b5',
    },
  };
});

export const OnboardingContent = (title: string, descriptions: string[]) => {
  return (
    <>
      <Typography variant="h5">{title}</Typography>
      {descriptions.length > 0 &&
        descriptions.map((description) => (
          <Typography key={description} variant="body1">
            {description}
          </Typography>
        ))}
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

const useOnboarding = () => {
  const { setSteps } = useTour();

  return { setSteps };
};

export default useOnboarding;
