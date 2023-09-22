import { AnnotationType } from 'routes/Annotator/Annotator.types';
import { Container } from './AnnotationList.style';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ToolIcon from 'routes/Annotator/components/LeftSidebar/ToolIcon';

interface AnnotationListProps {
  annotations: AnnotationType[];
  onAnnotationsChange: React.Dispatch<React.SetStateAction<AnnotationType[]>>;
}

// TODO: categories should be 'API response' later
export default function AnnotationList({
  annotations,
  onAnnotationsChange,
}: AnnotationListProps) {
  function createAnnotation() {
    const nextAnnotations = annotations.slice();
    nextAnnotations.push({
      path: null,
    });
    onAnnotationsChange(nextAnnotations);
  }

  return (
    <Container>
      <ToolIcon
        toolName="Add annotation"
        iconComponent={<AddCircleOutlineOutlinedIcon />}
        onClick={createAnnotation}
        placement="left"
      />
      {annotations.map((annotation, index) => {
        return (
          <div key={index}>
            <span>annotation</span>
            <span>some path</span>
          </div>
        );
      })}
    </Container>
  );
}
