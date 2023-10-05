import { FormControl, NativeSelect } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { setCurrentCategory } from 'routes/Annotator/slices/annotatorSlice';

export default function Categories() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.annotator.categories);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedCategoryName = event.target.value;

    const selectedCategory = categories.find(
      (category) => category.name === selectedCategoryName,
    );

    console.log(selectedCategory);

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
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
}
