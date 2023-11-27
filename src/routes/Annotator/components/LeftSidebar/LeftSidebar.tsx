import { Box, List, Divider } from '@mui/material';
import ToolIcon from './ToolIcon';
import paper from 'paper';

import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import AutoFixOffOutlinedIcon from '@mui/icons-material/AutoFixOffOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { Container } from './LeftSidebar.style';
import { Tool } from 'routes/Annotator/Annotator';
import FunctionIcon from './FunctionIcon';
import { getConvertedAnnotation } from 'routes/Annotator/helpers/Annotator.helper';
import { useAppSelector } from 'App.hooks';
import { useParams } from 'react-router-dom';
import AnnotatorModel from 'routes/Annotator/models/Annotator.model';
import { axiosErrorHandler } from 'helpers/Axioshelpers';

export default function LeftSidebar() {
  const imageId = Number(useParams().imageId);
  const categories = useAppSelector((state) => state.annotator.categories);
  const datasetId = useAppSelector((state) => state.annotator.datasetId);

  function createCategoriesToUpdate() {
    const children = paper.project.activeLayer.children;

    const categoriesToUpdate = JSON.parse(JSON.stringify(categories));

    // @이슈: 브러쉬 커브 없던 거
    // 이유: 기존 숨겨진 속성이 없는 채로 save를 했음.
    // segmentation만 바로 보내니까 브러쉬 커브가 없던 거였음.
    // 전체 객체를 serialize해서 보내는 것이 아니라 일부(segmentation)만 보냈음
    // 해결방법: 전체 객체를 serialize해서 보내기. 그리고 data 객체도 서버에 저장하고 load하면 보내기
    children.forEach((child) => {
      if (child instanceof paper.CompoundPath) {
        const { categoryId, annotationId } = child.data;

        categoriesToUpdate[categoryId].annotations[annotationId] =
          getConvertedAnnotation(child);
      }
    });

    // 속성 이름 kebab_case로 맞춤
    Object.entries(categoriesToUpdate).map(([categoryId]) => {
      categoriesToUpdate[categoryId]['category_id'] = categoryId;
      delete categoriesToUpdate[categoryId].categoryId;
      delete categoriesToUpdate[categoryId].name;
    });

    return categoriesToUpdate;
  }

  async function saveData(datasetId: number | undefined, imageId: number) {
    if (!datasetId || !imageId) return;

    try {
      const categoriesToUpdate = createCategoriesToUpdate();

      const response = await AnnotatorModel.saveData(
        datasetId,
        imageId,
        categoriesToUpdate,
      );
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
            toolName="Select"
            toolId={Tool.Select}
            iconComponent={<BackHandOutlinedIcon />}
          />
          <ToolIcon
            toolName="Box"
            toolId={Tool.Box}
            iconComponent={<RectangleOutlinedIcon />}
          />
          <ToolIcon
            toolName="Brush"
            toolId={Tool.Brush}
            iconComponent={<BrushOutlinedIcon />}
          />
          <ToolIcon
            toolName="Eraser"
            toolId={Tool.Eraser}
            iconComponent={<AutoFixOffOutlinedIcon />}
          />
          <ToolIcon
            toolName="SAM"
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
