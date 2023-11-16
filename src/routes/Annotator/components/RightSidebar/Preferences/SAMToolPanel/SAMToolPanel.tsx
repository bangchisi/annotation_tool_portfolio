import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from '@mui/material';
import {
  Container,
  EverythingButton,
  ModelContainer,
  SelectModel,
  SliderContainer,
  SliderContent,
} from './SAMToolPanel.style';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { setSAMModelLoading } from 'routes/Annotator/slices/annotatorSlice';
import {
  dummy,
  loadSAM,
} from 'routes/Annotator/components/Workbench/Canvas/tools/SAMTool';

export default function SAMToolPanel() {
  const dispatch = useAppDispatch();
  const preference = useAppSelector((state) => state.auth.preference);

  function onChangeModel(event: SelectChangeEvent<string>) {
    // ...
    loadSAM(event.target.value);
  }

  return (
    <Container>
      <Typography variant="subtitle2">SAM</Typography>
      <ModelContainer>
        <SelectModel>
          <Typography variant="caption">기존 모델</Typography>
          <Select
            onChange={(event) => onChangeModel(event)}
            size="small"
            defaultValue="vit_h"
          >
            <MenuItem value="vit_h">vit_h</MenuItem>
            <MenuItem value="vit_l">vit_l</MenuItem>
            <MenuItem value="vit_b">vit_b</MenuItem>
          </Select>
        </SelectModel>
        <SelectModel>
          <Typography variant="caption">Finetuned 모델</Typography>
          <Select size="small" defaultValue="vit_h">
            <MenuItem value="vit_h">vit_h</MenuItem>
            <MenuItem value="vit_l">vit_l</MenuItem>
            <MenuItem value="vit_b">vit_b</MenuItem>
          </Select>
        </SelectModel>
      </ModelContainer>
      <Typography variant="subtitle2">EVERYTHING</Typography>
      <SliderContainer>
        <SliderContent>
          <Typography variant="caption">pred_iou_thresh</Typography>
          <Slider
            defaultValue={0.88}
            valueLabelDisplay="auto"
            step={0.01}
            marks
            min={0.0}
            max={1.0}
          />
        </SliderContent>
        <SliderContent>
          <Typography variant="caption">box_nms_thresh</Typography>
          <Slider
            defaultValue={0.7}
            valueLabelDisplay="auto"
            step={0.1}
            marks
            min={0.0}
            max={1.0}
          />
        </SliderContent>
        <SliderContent>
          <Typography variant="caption">points_per_side</Typography>
          <Slider
            defaultValue={16}
            valueLabelDisplay="auto"
            step={4}
            marks
            min={12}
            max={40}
          />
        </SliderContent>
      </SliderContainer>
      <EverythingButton onClick={dummy} variant="contained" color="primary">
        START EVERYTHING
      </EverythingButton>
    </Container>
  );
}
