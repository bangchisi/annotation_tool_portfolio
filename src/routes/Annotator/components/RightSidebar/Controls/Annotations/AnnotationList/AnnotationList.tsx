import { Annotation, AnnotationType } from '../../../../Annotation/Annotation';
import { Container } from './AnnotationList.style';

interface AnnotationListProps {
  currentCategory: string;
}

interface CategoryType {
  name: string;
  annotations: AnnotationType[];
}

export default function AnnotationList(props: AnnotationListProps) {
  // TODO: categories should be 'API response' later
  const categories: CategoryType[] = [
    {
      name: 'thing',
      annotations: [
        {
          id: 1,
          polygon: 1,
        },
        {
          id: 2,
          polygon: 2,
        },
        {
          id: 3,
          polygon: 3,
        },
      ],
    },
    {
      name: 'other',
      annotations: [
        {
          id: 4,
          polygon: 4,
        },
        {
          id: 5,
          polygon: 5,
        },
      ],
    },
    {
      name: 'something',
      annotations: [
        {
          id: 6,
          polygon: 6,
        },
        {
          id: 7,
          polygon: 7,
        },
        {
          id: 8,
          polygon: 8,
        },
      ],
    },
  ];
  return (
    <Container>
      {categories.map((category) => (
        <div key={category.name}>
          {category.name === props.currentCategory ? (
            <div className="annotations">
              {category.annotations.map((annotation) => (
                <Annotation
                  key={annotation.id}
                  id={annotation.id}
                  polygon={annotation.polygon}
                />
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </Container>
  );
}
