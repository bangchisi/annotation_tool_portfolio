import { useAppDispatch, useAppSelector } from 'App.hooks';
import {
  BrushRadius,
  BrushRadiusContainer,
  Container,
  PrefName,
  ToolName,
} from './BrushToolPanel.style';
import { setBrushRadius } from 'routes/Auth/slices/authSlice';

export default function BrushToolPanel() {
  const dispatch = useAppDispatch();
  const brushRadius = useAppSelector(
    (state) => state.auth.preference.brushRadius,
  );

  function onBrushRadiusChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    dispatch(setBrushRadius(Number(event.target.value)));
  }

  return (
    <Container>
      <ToolName variant="subtitle2">Brush panel</ToolName>
      <BrushRadiusContainer>
        <PrefName variant="h6">radius</PrefName>
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
