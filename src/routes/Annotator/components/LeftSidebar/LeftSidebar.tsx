import { Box, Divider, List } from '@mui/material';
import ToolIcon from './ToolIcon';

import AutoFixOffOutlinedIcon from '@mui/icons-material/AutoFixOffOutlined';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { useAppSelector } from 'App.hooks';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { useParams } from 'react-router-dom';
import { createCategoriesToUpdate } from 'routes/Annotator/helpers/Annotator.helper';
import AnnotatorModel from 'routes/Annotator/models/Annotator.model';
import { Tool } from 'types';
import FunctionIcon from './FunctionIcon';
import { Container } from './LeftSidebar.style';

type LeftSidebarProps = {
  onSave: () => void;
};

export default function LeftSidebar({ onSave: handleSave }: LeftSidebarProps) {
  const imageId = Number(useParams().imageId);
  const categories = useAppSelector((state) => state.annotator.categories);
  const datasetId = useAppSelector((state) => state.annotator.datasetId);

  async function saveData(datasetId: number | undefined, imageId: number) {
    if (!datasetId || !imageId) return;

    try {
      const categoriesToUpdate = createCategoriesToUpdate(categories);

      const response = await AnnotatorModel.saveData(
        datasetId,
        imageId,
        categoriesToUpdate,
      );
      if (response.status !== 200) {
        throw new Error('Failed to save annotator data');
      }

      handleSave();
    } catch (error) {
      axiosErrorHandler(error, 'Failed to save annotator data');
    }
  }

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
            functionName="Save"
            iconComponent={<SaveIcon />}
            handleClick={() => saveData(datasetId, imageId)}
            isFunction={true}
          />
        </List>
      </Box>
    </Container>
  );
}
