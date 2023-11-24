import paper from 'paper';
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
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import { LogType } from 'routes/Models/Models';
import SAMModel from 'routes/Annotator/models/SAM.model';
import { setSAMEverythingLoading } from 'routes/Annotator/slices/SAMSlice';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import useSAMTool from 'routes/Annotator/components/Workbench/Canvas/tools/useSAMTool';

let tempRect: paper.Path.Rectangle;

export default function SAMToolPanel() {
  const userId = useAppSelector((state) => state.auth.user.userId);
  const preference = useAppSelector((state) => state.auth.preference);
  const [isFinetuneModelLoading, setIsFinetuneModelLoading] = useState(false);
  const [finetuneModelList, setFinetuneModelList] = useState<LogType[]>([]);

  const dispatch = useAppDispatch();

  // everything params
  const image = useAppSelector((state) => state.annotator.image);
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const { currentAnnotation } = useAppSelector(selectAnnotator);
  const SAMModelLoaded = useAppSelector((state) => state.sam.modelLoaded);
  const embeddingId = useAppSelector((state) => state.sam.embeddingId);

  const { loadSAM, loadFinetunedModel, getRegion, getConvertedCoordinate } =
    useSAMTool();

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

  function onEverything() {
    const viewBounds = paper.view.bounds;
    const raster = paper.project.activeLayer.children.find(
      (child) => child instanceof paper.Raster,
    ) as paper.Raster;
    if (!raster) return;
    const rasterBounds = raster.bounds;

    const { topLeft, bottomRight } = getRegion(viewBounds, rasterBounds);

    console.log('boundary');
    console.dir(
      `(${topLeft.x}, ${topLeft.y}), (${bottomRight.x}, ${bottomRight.y})`,
    );

    // draw SAM Region
    if (tempRect) tempRect.remove();

    tempRect = new paper.Path.Rectangle({
      from: topLeft,
      to: bottomRight,
      strokeColor: new paper.Color('red'),
      strokeWidth: 5,
      guide: true,
    });

    // prompt, everything api 요청
    const [calculatedTopLeft, calculatedBottomRight] = getConvertedCoordinate(
      topLeft,
      bottomRight,
      raster,
    );

    // everything
    if (!image || !currentCategory || !currentAnnotation) return;
    everything(
      image.imageId,
      currentCategory.categoryId,
      currentAnnotation.annotationId,
      calculatedTopLeft,
      calculatedBottomRight,
      // FIX: params need to be state, not hard-coded
      {
        predIOUThresh: 0.88,
        boxNmsThresh: 0.7,
        pointsPerSide: 16,
      },
      SAMModelLoaded,
      embeddingId,
    );
  }

  async function everything(
    imageId: number,
    categoryId: number,
    annotationId: number,
    topLeft: paper.Point,
    bottomRight: paper.Point,
    params: {
      predIOUThresh: number;
      boxNmsThresh: number;
      pointsPerSide: number;
    },
    isSAMModelLoaded: boolean,
    embeddingId: number | null,
  ) {
    dispatch(setSAMEverythingLoading(true));
    if (!isSAMModelLoaded) return;
    if (!embeddingId || embeddingId !== imageId) return;
    try {
      const response = await SAMModel.everything(
        imageId,
        categoryId,
        annotationId,
        topLeft,
        bottomRight,
        params,
      );

      console.log('everything, response');
      console.log(response);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to SAM Everything');
      alert('everything 모드 실패, 다시 시도해주세요.');
    } finally {
      dispatch(setSAMEverythingLoading(false));
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
                (finetuneModel) => finetuneModel.status === 'Finetuning Done',
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
      <EverythingButton
        onClick={onEverything}
        variant="contained"
        color="primary"
      >
        START EVERYTHING
      </EverythingButton>
    </Container>
  );
}
