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
      <Typography variant="h4">{title}</Typography>
      <Typography variant="caption">{description}</Typography>
    </>
  );
};

export const OnboardingButton = () => {
  const { setIsOpen } = useTour();
  return <ButtonContainer onClick={() => setIsOpen(true)} />;
};

export const steps: { [key: string]: StepType[] } = {
  datasets: [
    {
      selector: '.search-step',
      content: OnboardingContent(
        'Search',
        'Search datasets by name, description, or category',
      ),
    },
  ],
};

const useOnboarding = () => {
  const { setIsOpen } = useTour();

  const startTour = () => {
    setIsOpen(true);
  };
  return { startTour };
};

export default useOnboarding;
