import { FormControl, NativeSelect } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { setCurrentCategory } from 'routes/Annotator/slices/annotatorSlice';

export default function Categories() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.annotator.categories);

  // 카테고리 선택 변경
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    // select value
    const selectedCategoryId = Number(event.target.value);

    // 선택한 id와 같은 category 검색
    const selectedCategory = categories.find(
      (category) => category.id === selectedCategoryId,
    );

    if (selectedCategory) {
      dispatch(setCurrentCategory(selectedCategory));
    }
  };

  return (
    <FormControl id="category-dropdown" fullWidth>
      <NativeSelect
        defaultValue={'thing'}
        inputProps={{
          name: 'category',
          id: 'uncontrolled-native',
        }}
        onChange={handleCategoryChange}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
}
