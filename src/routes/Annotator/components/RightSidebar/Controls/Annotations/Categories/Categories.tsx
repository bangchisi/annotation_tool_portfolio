import { useAppSelector } from 'App.hooks';
import { Container, Select } from './Categories.style';

export default function Categories() {
  const categories = useAppSelector((state) => state.annotator.categories);

  // 카테고리 선택 변경
  // const handleCategoryChange = (
  //   event: React.ChangeEvent<HTMLSelectElement>,
  // ) => {
  //   // select value
  //   const selectedCategoryId = Number(event.target.value);

  //   // 선택한 id와 같은 category 검색
  //   const selectedCategory = categories.find(
  //     (category) => category.id === selectedCategoryId,
  //   );

  //   if (selectedCategory) {
  //     dispatch(setCurrentCategory(selectedCategory));
  //   }
  // };

  return (
    <Container id="category-dropdown" fullWidth>
      <Select
        defaultValue={'thing'}
        inputProps={{
          name: 'category',
          id: 'uncontrolled-native',
        }}
        onChange={() => console.log('handleCategoryChange()')}
      >
        {categories.map((category) => (
          <option key={category.categoryId} value={category.categoryId}>
            {category.name}
          </option>
        ))}
      </Select>
    </Container>
  );
}
