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

type LeftSidebarProps = {
  onSave: () => void;
};

export default function LeftSidebar({ onSave: handleSave }: LeftSidebarProps) {
  const imageId = Number(useParams().imageId);
  const categories = useAppSelector((state) => state.annotator.categories);
  const datasetId = useAppSelector((state) => state.annotator.datasetId);

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

  const { trigger: save } = useSWRMutation('/annotator/data', saveFetcher);

  const saveData = useCallback(
    async (datasetId: number | undefined, imageId: number) => {
      if (!datasetId || !imageId) return;

      try {
        const categoriesToUpdate = createCategoriesToUpdate(categories);

        await save({ categories: categoriesToUpdate });

        handleSave();
      } catch (error) {
        axiosErrorHandler(error, 'Failed to save annotator data');
      }
    },
    [categories, handleSave, save],
  );

  const ctrlSKeyEvent = useMemo(
    () => ({
      KeyS: (event: KeyboardEvent) => {
        if (event.ctrlKey) saveData(datasetId, imageId);
      },
    }),
    [datasetId, imageId, saveData],
  );

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
        <List>
          <ToolIcon
            toolName="Select (S)"
            toolId={Tool.Select}
            iconComponent={<BackHandOutlinedIcon />}
          />
          <ToolIcon
            toolName="Box (R)"
            toolId={Tool.Box}
            iconComponent={<RectangleOutlinedIcon />}
          />
          <ToolIcon
            toolName="Brush (B)"
            toolId={Tool.Brush}
            iconComponent={<BrushOutlinedIcon />}
          />
          <ToolIcon
            toolName="Eraser (E)"
            toolId={Tool.Eraser}
            iconComponent={<AutoFixOffOutlinedIcon />}
          />
          <ToolIcon
            toolName="SAM (F)"
            toolId={Tool.SAM}
            iconComponent={<FacebookOutlinedIcon />}
          />
        </List>
        <Divider />
        <List>
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
