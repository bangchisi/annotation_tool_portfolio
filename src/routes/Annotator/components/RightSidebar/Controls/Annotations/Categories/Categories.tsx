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

// 카테고리 선택 컴포넌트
export default function Categories() {
  const dispatch = useAppDispatch();
  const { categories, currentCategory } = useAppSelector(selectAnnotator); // 카테고리 목록, 현재 선택된 카테고리

  // 카테고리 선택 변경
  const handleCategoryChange = useCallback(
    (event: SelectChangeEvent) => {
      if (!categories) return;
      // select value
      const selectedCategoryId = Number(event.target.value);

      // 선택한 id와 같은 category 검색
      const selectedCategory = categories[`${selectedCategoryId}`];

      // 선택한 카테고리가 존재하면 현재 카테고리 변경
      if (selectedCategory) {
        dispatch(setCurrentCategoryByCategoryId(selectedCategoryId));
      }
    },
    [categories, dispatch],
  );

  return (
    // 카테고리 선택 셀렉트 박스
    <FormControl
      className="category-select-step"
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
      {/* 선택 가능한 카테고리 목록을 Select 엘리먼트로 렌더링 */}
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
