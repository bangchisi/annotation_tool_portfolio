import { Container } from './CategoryTag.style';

interface CategoryTagProps {
  categoryName: string;
  categorycolor: string;
  textcolor: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function CategoryTag(props: CategoryTagProps) {
  const { categoryName, categorycolor, textcolor, onClick } = props;
  return (
    <Container
      categorycolor={categorycolor}
      textcolor={textcolor}
      onClick={onClick}
    >
      {categoryName}
    </Container>
  );
}
