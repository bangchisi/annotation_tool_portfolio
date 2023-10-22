import RightSidebar from './components/RightSidebar/RightSidebar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import { Container } from './Annotator.style';
import Workbench from './components/Workbench/Workbench';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { setCategories, setCurrentCategory } from './slices/annotatorSlice';
import AnnotatorModel from './models/Annotator.model';
import { useEffect, useState } from 'react';
import PathStore from './utils/PathStore';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { useParams } from 'react-router-dom';

export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

// path 정보들을 저장한 배열
export let paths: PathStore;
fetchPaths();

export default function Annotator() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { imageId } = useParams();
  // const selectedTool = useAppSelector((state) => state.annotator.selectedTool);
  const categories = useAppSelector((state) => state.annotator.categories);
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );

  // const getData = async (imageId: number) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await AnnotatorModel.getData(imageId);
  //     const data = response.data.data;

  //     return data;
  //     // {
  //     //   "datasetId": 34,
  //     //   "image": {
  //     //     "imageId": 2026,
  //     //     "width": 3000,
  //     //     "height": 1828,
  //     //     "fileName": "gunicorn_logo.png",
  //     //     "previousImageId": null,
  //     //     "nextImageId": null
  //     //   },
  //     //   "categories": []
  //     // }
  //   } catch (error) {
  //     axiosErrorHandler(error, 'Failed to get annotator data');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const data = getData(Number(imageId));
  //   console.log('Annotator.tsx, data');
  //   console.dir(data);
  // }, [dispatch]);

  // init categories, paths
  useEffect(() => {
    // categories 가져오는 async 함수
    async function fetchCategories() {
      try {
        const newCategories = await AnnotatorModel.getCategories(0, 0);
        // 받아온 정보로 categories init
        dispatch(setCategories(newCategories));

        // 받아온 categories 내용이 있으면
        if (newCategories.length > 0) {
          // 0번째 category를 currentCategory로
          dispatch(setCurrentCategory(newCategories[0]));
        }
      } catch (error) {
        console.error('Error init categories:', error);
      }
    }

    async function fetchPaths() {
      const pathArray = await AnnotatorModel.getPaths();
      paths = new PathStore(pathArray);
    }

    if (categories.length === 0) {
      // categories가 비어있을 때만 데이터를 가져옴
      fetchCategories();
      fetchPaths();
    }
  }, [dispatch]);

  // currentCategory 변경 -> categories 갱신
  useEffect(() => {
    if (currentCategory) {
      const updatedCategories = categories.map((category) =>
        category.id === currentCategory.id ? currentCategory : category,
      );
      dispatch(setCategories(updatedCategories));
    }
  }, [currentCategory, dispatch]);

  return (
    <Container>
      <LeftSidebar />
      <Workbench />
      <RightSidebar />
    </Container>
  );
}

async function fetchPaths() {
  const pathArray = await AnnotatorModel.getPaths();
  paths = new PathStore(pathArray);
  console.dir(paths);
}
