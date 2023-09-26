import RightSidebar from './components/RightSidebar/RightSidebar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import { Container } from './Annotator.style';
import Workbench from './components/Workbench/Workbench';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { setCategories, setCurrentCategory } from './slices/annotatorSlice';
import AnnotatorModel from './models/Annotator.model';
import { useEffect } from 'react';

export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

// 서버에서 받아와야 할 정보. category 목록, 각 category의 annotation 목록
// categories 안에 category가 있고 category 안에 annotations가 있음
// const initialCategories = ['human', 'animal', 'building', 'machine'].map(
//   (categoryName, index) => setCategory(index, categoryName, []),
// );

export default function Annotator() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.annotator.categories);
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  console.log('init categories');
  console.dir(categories);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const newCategories = await AnnotatorModel.getCategories(0, 0);
        dispatch(setCategories(newCategories));

        if (categories.length === 0) {
          if (newCategories.length > 0) {
            dispatch(setCurrentCategory({ currentCategory: newCategories[0] }));
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    if (categories.length === 0) {
      // categories가 비어있을 때만 데이터를 가져옴
      fetchCategories();
    }
  }, [categories, dispatch]);

  useEffect(() => {
    console.log('Annotator.tsx, currentCategory changed!');
    if (currentCategory !== null) {
      const prevCategory = categories.find(
        (category) => category.id === currentCategory.id,
      );

      console.log(prevCategory === currentCategory);
    }
  }, [currentCategory]);

  return (
    <Container>
      <LeftSidebar />
      <Workbench />
      <RightSidebar />
    </Container>
  );
}
