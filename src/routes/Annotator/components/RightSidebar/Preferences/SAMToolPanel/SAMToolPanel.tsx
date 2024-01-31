import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { axiosErrorHandler, typedAxios } from 'helpers/Axioshelpers';
import paper from 'paper';
import { useState } from 'react';
import useSAMTool from 'routes/Annotator/components/Workbench/Canvas/tools/useSAMTool';
import useReloadAnnotator from 'routes/Annotator/hooks/useReloadAnnotator';
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
import { AnnotationTool } from 'routes/Annotator/components/Workbench/Canvas/hooks/useTools';
import { KeyedMutator } from 'swr';
import { InitDataType } from 'routes/Annotator/Annotator';
import { useTypedSWR } from 'hooks';
import useSWRMutation from 'swr/mutation';

// SAM Tool Panel 컴포넌트 props
type SAMToolPanelProps = {
  reload: KeyedMutator<InitDataType>; // 카테고리 목록 갱신 함수
};

// SAM Tool Panel 컴포넌트
export default function SAMToolPanel(props: SAMToolPanelProps) {
  const userId = useAppSelector((state) => state.auth.user.userId); // redux, 현재 사용자 id
  const { categories, drawPaths } = useReloadAnnotator(); // 카테고리 목록 객체, 캔버스에 mask를 그리는 함수
  // const [isFinetuneModelLoading, setIsFinetuneModelLoading] = useState(false);
  // const [finetuneModelList, setFinetuneModelList] = useState<LogType[]>([]);
  const [isFinetune, setIsFinetune] = useState(false); // 현재 모델이 finetune 모델인지 여부
  // const [currentModel, setCurrentModel] = useState('vit_h');
  const { model: currentModel } = useAppSelector(selectSAM); // redux, 현재 선택한 모델

  const dispatch = useAppDispatch();

  const image = useAppSelector((state) => state.annotator.image); // redux, 현재 이미지
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  ); // redux, 현재 선택된 카테고리
  const { currentAnnotation } = useAppSelector(selectAnnotator); // redux, 현재 선택된 어노테이션
  const SAMModelLoaded = useAppSelector((state) => state.sam.modelLoaded); // redux, 현재 모델이 로드되었는지 여부
  const embeddingId = useAppSelector((state) => state.sam.embeddingId); // redux, 현재 이미지의 임베딩 id

  const { loadSAM, loadFinetunedModel, getRegion, getConvertedCoordinate } =
    useSAMTool(); // SAM 모델 로드 함수, finetune 모델 로드 함수, 캔버스 영역 계산 함수, 서버에 전송할 좌표로 변환하는 함수

  const {
    predIOUThresh,
    setPredIOUThresh,
    boxNMSThresh,
    setBoxNMSThresh,
    pointsPerSide,
    setPointsPerSide,
  } = useSAMParameter(); // everything 모드를 위한 params

  // finetune 모델 목록 요청 mutation
  const { data } = useTypedSWR<LogType[]>({
    method: 'get',
    endpoint: `/finetune/${userId}`,
  });

  // everything api 요청 fetcher
  const everythingFetcher = async (url: string, { arg }: { arg: any }) => {
    return typedAxios('post', '/sam/everything', {
      image_id: image?.imageId,
      category_id: currentCategory?.categoryId,
      image_left_top_coord: [
        Math.floor(arg.topLeft.x),
        Math.floor(arg.topLeft.y),
      ],
      image_right_bottom_coord: [
        Math.floor(arg.bottomRight.x),
        Math.floor(arg.bottomRight.y),
      ],
      params: {
        pred_iou_thresh: arg.predIOUThresh,
        box_nms_thresh: arg.boxNMSThresh,
        points_per_side: arg.pointsPerSide,
      },
      is_finetune: arg.isFinetune,
    });
  };

  // everything api 요청 mutation
  const { trigger: everythingTrigger } = useSWRMutation(
    '/sam/everything',
    everythingFetcher,
  );

  // 모델 목록 변경 핸들러
  function onChangeModel(event: SelectChangeEvent<string>) {
    // setCurrentModel(event.target.value);
    // redux의 현재 선택한 모델을 변경
    dispatch(setSAMModel(event.target.value));

    // 선택한 모델이 베이스 모델 중 하나면
    if (
      event.target.value === 'vit_h' ||
      event.target.value === 'vit_l' ||
      event.target.value === 'vit_b'
    ) {
      // SAM 모델 로드 함수 실행
      loadSAM(event.target.value).then(() => {
        // finetune 모델이 아니라는 상태로 변경
        setIsFinetune(false);
      });
    } else {
      // 선택한 모델이 finetune 모델 목록에 있는지 검사
      const selectedFinetunedModel = data?.find((finetuneModel) => {
        return finetuneModel.finetuneName === event.target.value;
      });

      // 선택한 모델이 없다면 return
      if (!selectedFinetunedModel) return;

      // 선택한 모델이 있다면 finetune 모델 로드 함수 실행
      loadFinetunedModel(Number(selectedFinetunedModel.finetuneId)).then(() => {
        // finetune 모델이라는 상태로 변경
        setIsFinetune(true);
      });
    }
  }

  // everything 모드 실행 핸들러
  function onEverything() {
    const viewBounds = paper.view.bounds; // 캔버스 영역
    const raster = paper.project.activeLayer.children.find(
      (child) => child instanceof paper.Raster,
    ) as paper.Raster; // 현재 이미지 객체

    // 이미지 객체가 없으면 return
    if (!raster) return;

    const rasterBounds = raster.bounds; // 현재 이미지 객체의 영역

    const { topLeft, bottomRight } = getRegion(viewBounds, rasterBounds); // 캔버스 영역과 이미지 객체의 영역을 비교하여 캔버스 영역에 맞는 이미지 객체의 영역을 계산

    const [calculatedTopLeft, calculatedBottomRight] = getConvertedCoordinate(
      topLeft,
      bottomRight,
      raster,
    ); // 캔버스 영역에 맞는 이미지 객체의 영역을 서버에 전송할 좌표로 변환

    // 이미지, 현재 카테고리, 현재 어노테이션이 없으면 return
    if (!image || !currentCategory || !currentAnnotation) return;

    // everything 모드 실행
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

    // SAM Region(줌 했을때 빨간 사각형)이 있다면 삭제
    if (AnnotationTool.tempRect) AnnotationTool.tempRect.remove();
    // SAM Region 다시 생성
    AnnotationTool.tempRect = new paper.Path.Rectangle({
      from: topLeft,
      to: bottomRight,
      strokeColor: new paper.Color('red'),
      strokeWidth: 5,
      guide: true,
    });
  }

  // everything 모드 요청 함수
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
    // redux, everything 모드 로딩 상태 변경
    dispatch(setSAMEverythingLoading(true));
    // 현재 모델 로드가 되지 않았으면 return
    if (!isSAMModelLoaded) return;
    // 이미지 임베딩이 없으면 return
    if (!embeddingId || embeddingId !== imageId) return;
    const isBaseModel =
      currentModel === 'vit_h' ||
      currentModel === 'vit_l' ||
      currentModel === 'vit_b'; // 현재 모델이 베이스 모델인지 여부

    try {
      const response = await everythingTrigger({
        topLeft,
        bottomRight,
        predIOUThresh: params.predIOUThresh,
        boxNMSThresh: params.boxNMSThresh,
        pointsPerSide: params.pointsPerSide,
        isFinetune: !isBaseModel,
      }); // everything api 요청 response

      // 요청이 실패하면 에러 처리
      if (response.status !== 200) {
        alert('everything 모드 실패, F5를 눌러 새로고침 해주세요.');
        return;
      }
    } catch (error) {
      axiosErrorHandler(error, 'Failed to SAM Everything');
      alert('everything 모드 실패, F5를 눌러 새로고침 해주세요.');
    }
    // redux, everything 모드 로딩 상태 변경
    dispatch(setSAMEverythingLoading(false));
    // 이미지와 카테고리 목록 객체가 없다면 return. 새로고침 대상이 없다면 return 하는 것.
    if (!image || !categories) return;

    // 카테고리 목록 객체 갱신하고 캔버스에 mask를 그림
    props.reload();
    drawPaths(categories);
  }

  return (
    <Container>
      <Typography variant="subtitle2">SAM</Typography>
      {/* 모델 선택 */}
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
            {data &&
              data
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
      {/* Everything 모드를 위한 parameter */}
      <Typography variant="subtitle2">EVERYTHING</Typography>
      {/* Sensitivity */}
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
        {/* Overlap */}
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
        {/* Size of Object */}
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
      {/* Everything 모드 실행 버튼 */}
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
