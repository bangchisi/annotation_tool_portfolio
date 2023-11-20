import { useEffect, useState } from 'react';
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
import { useAppSelector } from 'App.hooks';
import {
  dummy,
  loadFinetunedModel,
  loadSAM,
} from 'routes/Annotator/components/Workbench/Canvas/tools/SAMTool';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import { LogType } from 'routes/Models/Models';

export default function SAMToolPanel() {
  const userId = useAppSelector((state) => state.auth.user.userId);
  const preference = useAppSelector((state) => state.auth.preference);
  const [isFinetuneModelLoading, setIsFinetuneModelLoading] = useState(false);
  const [finetuneModelList, setFinetuneModelList] = useState<LogType[]>([]);

  function onChangeModel(
    event: SelectChangeEvent<string> | SelectChangeEvent<number>,
  ) {
    // ...
    if (event.target.value === 'vit_l' || event.target.value === 'vit_b')
      loadSAM(event.target.value);
    else loadFinetunedModel(Number(event.target.value));
  }

  async function getFinetuneModels(userId: string) {
    setIsFinetuneModelLoading(true);
    try {
      const response = await FinetuneModel.getLogs(userId);
      if (!response.data) return;

      setFinetuneModelList(response.data);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get finetuned models in SAM Panel');
    } finally {
      setIsFinetuneModelLoading(false);
    }
  }

  useEffect(() => {
    getFinetuneModels(userId);
  }, []);

  return (
    <Container>
      <Typography variant="subtitle2">SAM</Typography>
      <ModelContainer>
        <SelectModel>
          <Typography variant="caption">모델</Typography>
          <Select
            onChange={(event) => onChangeModel(event)}
            size="small"
            defaultValue="vit_l"
          >
            <MenuItem value="vit_l">vit_l</MenuItem>
            <MenuItem value="vit_b">vit_b</MenuItem>
            {finetuneModelList
              .filter(
                (finetuneModel) => finetuneModel.status === 'finetune done',
              )
              .map((finetuneModel) => (
                <MenuItem
                  key={finetuneModel.finetuneId}
                  value={finetuneModel.finetuneId}
                >
                  {finetuneModel.finetuneName}
                </MenuItem>
              ))}
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
