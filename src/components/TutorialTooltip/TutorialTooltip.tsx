import { TooltipProps } from '@mui/material';
import { Container } from './TutorialTooltip.style';

type TutorialTooltipProps = TooltipProps;

export default function TutorialTooltip(props: TutorialTooltipProps) {
  return (
    <Container
      {...props}
      open={true}
      disableFocusListener
      disableHoverListener
      disableTouchListener
    >
      {props.children}
    </Container>
  );
}
