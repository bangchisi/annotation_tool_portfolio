import Categories from './Categories/Categories';
import AnnotationList from './AnnotationList/AnnotationList';
import { Container } from './Annotatoins.style';

export default function Annotations() {
  return (
    <Container>
      <Categories />
      <AnnotationList />
    </Container>
  );
}
