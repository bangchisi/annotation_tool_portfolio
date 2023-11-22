import { useAppDispatch, useAppSelector } from 'App.hooks';
import {
  Container,
  EraserRadius,
  EraserRadiusContainer,
  PrefName,
  ToolName,
} from './EraserToolPanel.style';
import { selectAuth, setEraserRadius } from 'routes/Auth/slices/authSlice';

export default function EraserToolPanel() {
  const dispatch = useAppDispatch();
  const { eraserRadius } = useAppSelector(selectAuth).preference;

  function onEraserRadiusChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    dispatch(setEraserRadius(Number(event.target.value)));
  }

  return (
    <Container>
      <ToolName variant="subtitle2">Brush panel</ToolName>
      <EraserRadiusContainer>
        <PrefName variant="h6">radius</PrefName>
        <EraserRadius
          type="number"
          value={eraserRadius}
          onChange={(event) => {
            onEraserRadiusChange(event);
          }}
        />
      </EraserRadiusContainer>
    </Container>
  );
}
