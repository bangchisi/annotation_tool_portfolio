import { useAppDispatch } from 'App.hooks';
import paper from 'paper';
// import { paths } from 'routes/Annotator/Annotator';
import { AnnotationType, CategoryType } from 'routes/Annotator/Annotator.types';
import {
  setCurrentAnnotation,
  setCurrentCategory,
} from 'routes/Annotator/slices/annotatorSlice';

const dispatch = useAppDispatch();

// export function selectAnnotation(
//   categories: CategoryType[],
//   categoryId: number,
//   annotationId: number,
// ) {
//   {
//     // TODO: make paths.tempPath to selectedAnnotation path
//     const selectedPath = paper.project.activeLayer.children.find(
//       (path) =>
//         path.data.categoryId === categoryId &&
//         path.data.annotationId === annotationId,
//     ) as paper.CompoundPath;

//     paths.tempPath = selectedPath;
//     console.dir(selectedPath);
//   }

//   console.log(`select annotation. (${categoryId}, ${annotationId})`);
//   if (!categories) return;

//   const selectedCategory = categories.find(
//     (category) => category.id === categoryId,
//   );
//   if (!selectedCategory) return;
//   dispatch(setCurrentCategory(selectedCategory));

//   const selectedAnnotation: AnnotationType = {
//     categoryId: selectedCategory.id,
//     id: annotationId,
//   };
//   dispatch(setCurrentAnnotation(selectedAnnotation));
// }
