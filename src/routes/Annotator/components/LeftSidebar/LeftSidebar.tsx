import { Box, Divider, List } from '@mui/material';
import ToolIcon from './ToolIcon';

import AutoFixOffOutlinedIcon from '@mui/icons-material/AutoFixOffOutlined';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { Tool } from 'types';
import FunctionIcon from './FunctionIcon';
import { Container } from './LeftSidebar.style';
import { useCallback, useMemo } from 'react';
import { useKeyEvents } from 'routes/Annotator/hooks/useKeyEvents';
import { useParams } from 'react-router-dom';
import { useAppSelector } from 'App.hooks';
import { createCategoriesToUpdate } from 'routes/Annotator/helpers/Annotator.helper';
import { axiosErrorHandler, typedAxios } from 'helpers/Axioshelpers';
import useSWRMutation from 'swr/mutation';

// LeftSidebar props 타입
type LeftSidebarProps = {
  onSave: () => void; // 데이터 저장 핸들러
};

// LeftSidebar 컴포넌트
export default function LeftSidebar({ onSave: handleSave }: LeftSidebarProps) {
  const imageId = Number(useParams().imageId); // 이미지 아이디
  const categories = useAppSelector((state) => state.annotator.categories); // redux, 카테고리
  const datasetId = useAppSelector((state) => state.annotator.datasetId); // redux, 데이터셋 아이디

  // 데이터 저장 fetcher
  const saveFetcher = useCallback(
    (
      url: string,
      { arg }: { arg: { categories: typeof createCategoriesToUpdate } },
    ) => {
      // ...
      return typedAxios('post', url, {
        dataset_id: datasetId,
        image_id: imageId,
        categories: arg.categories,
      });
    },
    [datasetId, imageId],
  );

  // 데이터 저장 요청 mutation
  const { trigger: save } = useSWRMutation('/annotator/data', saveFetcher);

  // 데이터 저장 함수
  const saveData = useCallback(
    async (datasetId: number | undefined, imageId: number) => {
      // 데이터셋 아이디, 이미지 아이디가 없으면 리턴
      if (!datasetId || !imageId) return;

      try {
        const categoriesToUpdate = createCategoriesToUpdate(categories); // 새로운 카테고리 목록 객체가 될 객체. 카테고리 목록을 업데이트 하기 위해 사용

        await save({ categories: categoriesToUpdate }); // 데이터 저장 요청

        handleSave(); // 데이터 저장 핸들러 실행
      } catch (error) {
        axiosErrorHandler(error, 'Failed to save annotator data');
      }
    },
    [categories, handleSave, save],
  );

  // Ctrl + S 키 이벤트
  const ctrlSKeyEvent = useMemo(
    () => ({
      KeyS: (event: KeyboardEvent) => {
        // Ctrl + S 키 이벤트이면 데이터 저장 함수 실행
        if (event.ctrlKey) saveData(datasetId, imageId);
      },
    }),
    [datasetId, imageId, saveData],
  );

  // Ctrl + S 키 이벤트 등록
  useKeyEvents(ctrlSKeyEvent);

  return (
    <Container id="annotator-left-sidebar">
      <Box
        className="toolbar-step"
        sx={{
          pl: 0.5,
          paddingTop: 3,
        }}
      >
        {/* 툴 목록 */}
        <List>
          {/* Select 툴 */}
          <ToolIcon
            toolName="Select (S)"
            toolId={Tool.Select}
            iconComponent={<BackHandOutlinedIcon />}
          />
          {/* Box 툴 */}
          <ToolIcon
            toolName="Box (R)"
            toolId={Tool.Box}
            iconComponent={<RectangleOutlinedIcon />}
          />
          {/* Brush 툴 */}
          <ToolIcon
            toolName="Brush (B)"
            toolId={Tool.Brush}
            iconComponent={<BrushOutlinedIcon />}
          />
          {/* Eraser 툴 */}
          <ToolIcon
            toolName="Eraser (E)"
            toolId={Tool.Eraser}
            iconComponent={<AutoFixOffOutlinedIcon />}
          />
          {/* SAM (F) 툴 */}
          <ToolIcon
            toolName="SAM (F)"
            toolId={Tool.SAM}
            iconComponent={<FacebookOutlinedIcon />}
          />
        </List>
        <Divider />
        <List>
          {/* 저장 버튼 */}
          <FunctionIcon
            functionName="Save (Ctrl + S)"
            iconComponent={<SaveIcon />}
            handleClick={() => saveData(datasetId, imageId)}
            isFunction={true}
          />
        </List>
      </Box>
    </Container>
  );
}
