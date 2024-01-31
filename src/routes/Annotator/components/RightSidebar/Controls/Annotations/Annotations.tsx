import Categories from './Categories/Categories';
import AnnotationList from './AnnotationList/AnnotationList';
import { Container } from './Annotatoins.style';

// 카테고리 선택, 어노테이션 목록 컴포넌트
export default function Annotations() {
  return (
    <Container>
      {/* 카테고리 선택 */}
      <Categories />
      {/* 어노테이션 목록 */}
      <AnnotationList />
    </Container>
  );
}
