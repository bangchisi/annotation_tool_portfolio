import Categories from './Categories/Categories';
import AnnotationList from './AnnotationList/AnnotationList';
import { Container } from './Annotatoins.style';
import { ChangeEvent, useState } from 'react';

export default function Annotations() {
  const [currentCategory, setCurrentCategory] = useState<string>('thing');

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentCategory(event.target.value);
  };

  return (
    <Container>
      <Categories
        currentCategory={currentCategory}
        handleChange={handleCategoryChange}
      />
      <AnnotationList currentCategory={currentCategory} />
    </Container>
  );
}
