import RightSidebar from './components/RightSidebar/RightSidebar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import { Container } from './Annotator.style';
import Workbench from './components/Workbench/Workbench';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import {
  setCategories,
  setCurrentCategory,
  updateCurrentCategory,
} from './slices/annotatorSlice';
import AnnotatorModel from './models/Annotator.model';
import { useEffect, useState } from 'react';

export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

export default function Annotator() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.annotator.categories);
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const currentAnnotation = useAppSelector(
    (state) => state.annotator.currentAnnotation,
  );
  // undo 기능을 위해 prevAnnotation을 store에 undo list를 만들어 저장하는게 좋을듯
  const [prevAnnotation, setPrevAnnotation] = useState(currentAnnotation);

  // 처음 한번 categories 세팅
  useEffect(() => {
    // console.group(
    //   '%cAnnotator.tsx, useEffect, [categories, dispatch]',
    //   'color: green',
    // );

    // categories 가져오는 async 함수
    async function fetchCategories() {
      try {
        const newCategories = await AnnotatorModel.getCategories(0, 0);
        // 받아온 정보로 categories init
        dispatch(setCategories(newCategories));

        // 받아온 categories 내용이 있으면
        if (newCategories.length > 0) {
          // 0번째 category를 currentCategory로
          dispatch(setCurrentCategory({ currentCategory: newCategories[0] }));
        }
      } catch (error) {
        console.error('Error init categories:', error);
      }
    }

    if (categories.length === 0) {
      // categories가 비어있을 때만 데이터를 가져옴
      fetchCategories();
    }
    // console.groupEnd();
  }, [dispatch]);

  // currentCategory 세팅
  useEffect(() => {
    // console.group(
    //   '%cAnnotator.tsx, useEffect, [currentCategory]',
    //   'color: green',
    // );
    if (categories.length > 0) {
      dispatch(setCurrentCategory({ currentCategory: categories[0] }));
    }
    console.groupEnd();
  }, [dispatch]);

  // currentCategory 변경 -> categories 갱신
  useEffect(() => {
    // console.group(
    //   '%cAnnotator.tsx, useEffect, [currentCategory]',
    //   'color: green',
    // );
    if (currentCategory) {
      const updatedCategories = categories.map((category) =>
        category.id === currentCategory.id ? currentCategory : category,
      );
      dispatch(setCategories(updatedCategories));
    }
    // console.groupEnd();
  }, [currentCategory, dispatch]);

  // currentAnnotation.path 변경 -> currentCategory 갱신
  useEffect(() => {
    // console.group(
    //   '%cAnnotator.tsx, useEffect, [currentAnnotation, currentAnnotation?.path]',
    //   'color: green',
    // );

    // console.log('prevAnnotation', prevAnnotation);
    // console.log('currentAnnotation', currentAnnotation);

    // currentAnnotation과 이전 currentAnnotation의 id 비교
    if (prevAnnotation && prevAnnotation.id === currentAnnotation?.id) {
      // id가 같으면 path만 변경
      console.log('Only path has changed.');
      // currentAnnotation의 path 변경 로직 작성
      // currentCategory.annotations 업데이트 로직 작성
      // console.log(currentAnnotation);
      dispatch(updateCurrentCategory(currentAnnotation));
    } else {
      // id가 다르면 currentAnnotation 전체를 변경
      console.log('Annotation has changed.');
      // TODO: currentAnnotation 전체를 업데이트하는 로직 작성
      // selection에 currentAnnotation.path를 넣어야 함
    }

    // 현재 currentAnnotation을 이전 currentAnnotation으로 설정
    setPrevAnnotation(currentAnnotation);
    // console.groupEnd();
  }, [currentAnnotation, dispatch]);

  return (
    <Container>
      <LeftSidebar />
      <Workbench />
      <RightSidebar />
    </Container>
  );
}
