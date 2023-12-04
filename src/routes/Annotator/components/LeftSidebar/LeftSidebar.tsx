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
import { Tool } from 'routes/Annotator/Annotator';
import { createCategoriesToUpdate } from 'routes/Annotator/helpers/Annotator.helper';
import AnnotatorModel from 'routes/Annotator/models/Annotator.model';
import FunctionIcon from './FunctionIcon';
import { Container } from './LeftSidebar.style';

export default function LeftSidebar() {
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
      if (response.status === 200) {
        console.log('Successfully saved annotator data');
      }
    } catch (error) {
      axiosErrorHandler(error, 'Failed to save annotator data');
    } finally {
      //
    }
  }

  return (
    <Container id="annotator-left-sidebar">
      <Box
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
