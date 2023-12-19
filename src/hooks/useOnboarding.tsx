import { Typography, styled } from '@mui/material';
import { StepType, useTour } from '@reactour/tour';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';

const ButtonContainer = styled(HelpOutlinedIcon)(() => {
  return {
    position: 'absolute',
    bottom: '5%',
    left: '2%',
    cursor: 'pointer',
    width: '3rem',
    height: '3rem',
    '&:hover': {
      color: '#3f51b5',
    },
  };
});

export const OnboardingContent = (title: string, description: string) => {
  return (
    <>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
    </>
  );
};

export const OnboardingButton = () => {
  const { setIsOpen, setCurrentStep } = useTour();
  return (
    <ButtonContainer
      onClick={() => {
        setCurrentStep(0);
        setIsOpen(true);
      }}
    />
  );
};

export const steps: { [key: string]: StepType[] } = {
  datasets: [
    {
      selector: '.search-step',
      content: OnboardingContent(
        'Dataset 검색',
        'Project, Dataset, 카테고리 이름으로 검색할 수 있습니다.',
      ),
    },
    {
      selector: '.create-dataset-step',
      content: OnboardingContent(
        'Dataset 생성',
        '새로운 Dataset을 생성할 수 있습니다.',
      ),
      action: clickElement,
    },
    {
      selector: '.modal-step',
      content: OnboardingContent(
        'Dataset 생성을 위한 항목',
        `Super Dataset Name: 프로젝트 이름
        Dataset Name: Dataset 이름
        Description: Dataset에 대한 설명
        Categories: Dataset에 포함될 카테고리
        `,
      ),
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
      content: OnboardingContent(
        'Dataset 선택',
        'Dataset을 선택하면 해당 Dataset의 Annotation 페이지로 이동합니다.',
      ),
      highlightedSelectors: ['.dataset-card'],
      action: clickElement,
      actionAfter: clickElement,
    },
  ],
};

function clickElement(node: Element | null) {
  const element = node as HTMLElement;
  element.click();
}
