import { Container } from './AnnotationList.style';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { setAnnotation } from 'routes/Annotator/helpers/Annotator.helper';
import { addAnnotation } from 'routes/Annotator/slices/annotationsSlice';
import { useAppDispatch } from 'App.hooks';
import FunctionIcon from 'routes/Annotator/components/LeftSidebar/FunctionIcon';

// TODO: categories should be 'API response' later
export default function AnnotationList() {
  const dispatch = useAppDispatch();

  function createAnnotation() {
    console.log('create annotation');
    const newAnnotation = setAnnotation(11, 'bird', null);
    dispatch(addAnnotation(newAnnotation));
  }

  return (
    <Container>
      <FunctionIcon
        functionName="Add annotation"
        iconComponent={<AddCircleOutlineOutlinedIcon />}
        handleClick={createAnnotation}
        placement="left"
        isFunction={true}
      />
      {/* {annotations.map((annotation, index) => {
        return <Annotation key={index} annotation={annotation} />;
      })} */}
    </Container>
  );
}
