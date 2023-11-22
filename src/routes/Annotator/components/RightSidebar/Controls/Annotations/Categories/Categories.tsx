import { useAppDispatch, useAppSelector } from 'App.hooks';
import { Container, Select } from './Categories.style';
import {
  setCurrentCategory,
  selectAnnotator,
} from 'routes/Annotator/slices/annotatorSlice';

export default function Categories() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector(selectAnnotator);

  // 카테고리 선택 변경
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!categories) return;
    // select value
    const selectedCategoryId = Number(event.target.value);

    // 선택한 id와 같은 category 검색
    const selectedCategory = categories[`${selectedCategoryId}`];

    if (selectedCategory) {
      dispatch(setCurrentCategory(selectedCategory));
    }
  };

  return (
    <Container id="category-dropdown" fullWidth>
      {categories && (
        <Select
          defaultValue={'thing'}
          inputProps={{
            name: 'category',
            id: 'uncontrolled-native',
          }}
          onChange={handleCategoryChange}
        >
          {Object.entries(categories).map(([categoryId, category]) => (
            <option key={categoryId} value={categoryId}>
              {category.name}
            </option>
          ))}
        </Select>
      )}
    </Container>
  );
}
