import { useAppDispatch, useAppSelector } from 'App.hooks';
import {
  BrushRadius,
  BrushRadiusContainer,
  Container,
  PrefName,
  ToolName,
} from './BrushToolPanel.style';
import { selectAuth, setBrushRadius } from 'routes/Auth/slices/authSlice';

export default function BrushToolPanel() {
  const dispatch = useAppDispatch();
  const { brushRadius } = useAppSelector(selectAuth).preference;

  function onBrushRadiusChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    dispatch(setBrushRadius(Number(event.target.value)));
  }

  return (
    <Container>
      <ToolName variant="subtitle2">Brush Panel</ToolName>
      <BrushRadiusContainer>
        <PrefName variant="h6">Radius</PrefName>
        <BrushRadius
          type="number"
          value={brushRadius}
          onChange={(event) => {
            onBrushRadiusChange(event);
          }}
        />
      </BrushRadiusContainer>
    </Container>
  );
}
