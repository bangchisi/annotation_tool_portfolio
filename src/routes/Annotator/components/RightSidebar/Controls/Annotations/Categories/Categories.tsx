import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { useCallback } from 'react';
import {
  selectAnnotator,
  setCurrentCategoryByCategoryId,
} from 'routes/Annotator/slices/annotatorSlice';

export default function Categories() {
  const dispatch = useAppDispatch();
  const { categories, currentCategory } = useAppSelector(selectAnnotator);

  // 카테고리 선택 변경
  const handleCategoryChange = useCallback(
    (event: SelectChangeEvent) => {
      if (!categories) return;
      // select value
      const selectedCategoryId = Number(event.target.value);

      // 선택한 id와 같은 category 검색
      const selectedCategory = categories[`${selectedCategoryId}`];

      if (selectedCategory) {
        dispatch(setCurrentCategoryByCategoryId(selectedCategoryId));
      }
    },
    [categories, dispatch],
  );

  return (
    <FormControl
      fullWidth
      sx={{
        '& .MuiInputBase-root': {
          borderRadius: '0px',
          outline: 'none',
          borderBottom: '1px solid var(--border-color)',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          display: 'none',
        },
        '& .MuiPaper-root': {
          top: '2rem !important',
        },
      }}
    >
      {currentCategory && categories && (
        <Select
          value={currentCategory.categoryId + '' || ''}
          onChange={handleCategoryChange}
          size="small"
          fullWidth
          notched={false}
        >
          {Object.entries(categories)
            .filter((x) => x)
            .map(([categoryId, category]) => (
              <MenuItem
                key={categoryId}
                value={categoryId + ''}
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {category.name}
              </MenuItem>
            ))}
        </Select>
      )}
    </FormControl>
  );
}
