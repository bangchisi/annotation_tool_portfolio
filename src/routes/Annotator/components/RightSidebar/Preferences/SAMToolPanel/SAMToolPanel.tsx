import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import paper from 'paper';
import { useEffect, useState } from 'react';
import useSAMTool from 'routes/Annotator/components/Workbench/Canvas/tools/useSAMTool';
import useReloadAnnotator from 'routes/Annotator/hooks/useReloadAnnotator';
import SAMModel from 'routes/Annotator/models/SAM.model';
import {
  selectSAM,
  setSAMEverythingLoading,
  setSAMModel,
} from 'routes/Annotator/slices/SAMSlice';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { LogType } from 'routes/Models/logTypes';
import ParameterButtonGroup, {
  ParameterType,
} from './ParameterButtons/ParameterButtonGroup';
import {
  Container,
  EverythingButton,
  ModelContainer,
  ParameterContainer,
  ParameterContent,
  RangeLabelContainer,
  SelectModel,
} from './SAMToolPanel.style';
import useSAMParameter from './hooks/useSAMParameter';

export let tempRect: paper.Path.Rectangle;

export default function SAMToolPanel() {
  const userId = useAppSelector((state) => state.auth.user.userId);
  const preference = useAppSelector((state) => state.auth.preference);
  const { categories, initData, drawPaths } = useReloadAnnotator();
  const [isFinetuneModelLoading, setIsFinetuneModelLoading] = useState(false);
  const [finetuneModelList, setFinetuneModelList] = useState<LogType[]>([]);
  const [isFinetune, setIsFinetune] = useState(false);
  // const [currentModel, setCurrentModel] = useState('vit_h');
  const { model: currentModel } = useAppSelector(selectSAM);

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

  const {
    predIOUThresh,
    setPredIOUThresh,
    boxNMSThresh,
    setBoxNMSThresh,
    pointsPerSide,
    setPointsPerSide,
  } = useSAMParameter();

  function onChangeModel(event: SelectChangeEvent<string>) {
    // setCurrentModel(event.target.value);
    dispatch(setSAMModel(event.target.value));
    if (
      event.target.value === 'vit_h' ||
      event.target.value === 'vit_l' ||
      event.target.value === 'vit_b'
    ) {
      loadSAM(event.target.value).then(() => {
        setIsFinetune(false);
      });
    } else {
      const selectedFinetunedModel = finetuneModelList.find((finetuneModel) => {
        return finetuneModel.finetuneName === event.target.value;
      });

      if (!selectedFinetunedModel) return;

      loadFinetunedModel(Number(selectedFinetunedModel.finetuneId)).then(() => {
        setIsFinetune(true);
      });
    }
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
      calculatedTopLeft,
      calculatedBottomRight,
      {
        predIOUThresh,
        boxNMSThresh,
        pointsPerSide,
      },
      SAMModelLoaded,
      embeddingId,
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
  }

  async function everything(
    imageId: number,
    categoryId: number,
    topLeft: paper.Point,
    bottomRight: paper.Point,
    params: {
      predIOUThresh: number;
      boxNMSThresh: number;
      pointsPerSide: number;
    },
    isSAMModelLoaded: boolean,
    embeddingId: number | null,
  ) {
    console.log(currentModel);
    dispatch(setSAMEverythingLoading(true));
    if (!isSAMModelLoaded) return;
    if (!embeddingId || embeddingId !== imageId) return;
    const isBaseModel =
      currentModel === 'vit_h' ||
      currentModel === 'vit_l' ||
      currentModel === 'vit_b';
    try {
      const response = await SAMModel.everything(
        imageId,
        categoryId,
        topLeft,
        bottomRight,
        params,
        isBaseModel ? false : true,
      );

      if (response.status !== 200) {
        alert('everything 모드 실패, F5를 눌러 새로고침 해주세요.');
        return;
      }
    } catch (error) {
      axiosErrorHandler(error, 'Failed to SAM Everything');
      alert('everything 모드 실패, F5를 눌러 새로고침 해주세요.');
    }
    dispatch(setSAMEverythingLoading(false));
    if (!image || !categories) return;
    await initData(image.imageId as number);
    drawPaths(categories);
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
            value={currentModel}
          >
            <MenuItem value="vit_h">vit_h</MenuItem>
            <MenuItem value="vit_l">vit_l</MenuItem>
            <MenuItem value="vit_b">vit_b</MenuItem>
            {finetuneModelList
              .filter(
                (finetuneModel) => finetuneModel.status === 'Finetuning Done',
              )
              .map((finetuneModel) => (
                <MenuItem
                  key={finetuneModel.finetuneId}
                  value={finetuneModel.finetuneName}
                >
                  {finetuneModel.finetuneName}
                </MenuItem>
              ))}
          </Select>
        </SelectModel>
      </ModelContainer>
      <Typography variant="subtitle2">EVERYTHING</Typography>
      <ParameterContainer>
        <ParameterContent>
          <Typography variant="body2">Sensitivity</Typography>
          <RangeLabelContainer>
            <Typography variant="caption">low</Typography>
            <Typography variant="caption">high</Typography>
          </RangeLabelContainer>
          <ParameterButtonGroup
            onClick={setPredIOUThresh}
            currentParamValue={predIOUThresh}
            paramType={ParameterType.predIOUThresh}
          />
        </ParameterContent>
        <ParameterContent>
          <Typography variant="body2">Overlap</Typography>
          <RangeLabelContainer>
            <Typography variant="caption">low</Typography>
            <Typography variant="caption">high</Typography>
          </RangeLabelContainer>
          <ParameterButtonGroup
            onClick={setBoxNMSThresh}
            currentParamValue={boxNMSThresh}
            paramType={ParameterType.boxNMSThresh}
          />
        </ParameterContent>
        <ParameterContent>
          <Typography variant="body2">Size of Obejct</Typography>
          <RangeLabelContainer>
            <Typography variant="caption">large focus</Typography>
            <Typography variant="caption">include small</Typography>
          </RangeLabelContainer>
          <ParameterButtonGroup
            onClick={setPointsPerSide}
            currentParamValue={pointsPerSide}
            paramType={ParameterType.pointsPerSide}
          />
        </ParameterContent>
      </ParameterContainer>
      <EverythingButton
        onClick={onEverything}
        variant="contained"
        color="primary"
        disabled={!SAMModelLoaded || !embeddingId}
      >
        START EVERYTHING
      </EverythingButton>
    </Container>
  );
}
