import axios from 'axios';
import { CategoriesType } from '../Annotator.types';

const DEV_URL = 'http://143.248.249.11:60133';
const SERVER_URL = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const AnnotatorModel = {
  getData: (imageId: number) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/annotator/data/${imageId}`
        : `${SERVER_URL}/annotator/data/${imageId}`;

    return axios.get(url);
  },
  saveData: (
    datasetId: number,
    imageId: number,
    categories: CategoriesType,
  ) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/annotator/data`
        : `${SERVER_URL}/annotator/data`;

    return axios.post(url, {
      image_id: imageId,
      dataset_id: datasetId,
      categories,
    });
  },
};

export default AnnotatorModel;

// import axios from 'axios';

// const baseURL = 'api/annotator';

// const initialCategories = {
//   data: [
//     {
//       id: 0,
//       name: 'human',
//       annotations: [0],
//     },
//     {
//       id: 1,
//       name: 'animal',
//       annotations: [0],
//     },
//     {
//       id: 2,
//       name: 'building',
//       annotations: [],
//     },
//     {
//       id: 3,
//       name: 'machine',
//       annotations: [],
//     },
//   ],
// };

// const initialPaths = {
//   data: [
//     {
//       segmentations: [],
//       categoryId: 0,
//       annotationId: 0,
//     },
//     {
//       segmentations: [],
//       categoryId: 1,
//       annotationId: 0,
//     },
//     // {
//     //   segmentations: [[385, 798, 385, 813, 319, 813, 319, 798, 385, 798]],
//     //   categoryId: 0,
//     //   annotationId: 0,
//     // },
//     // {
//     //   segmentations: [[500, 500, 500, 700, 700, 700, 700, 500, 500, 500]],
//     //   categoryId: 1,
//     //   annotationId: 0,
//     // },
//   ],
// };

// const initialAnnotations = {
//   data: {
//     annotations: [],
//   },
// };

// const getServerAndBaseURL = (): string => {
//   return `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/${baseURL}`;
// };

// const axiosErrorHandler = (error: unknown, message: string) => {
//   if (error instanceof Error) {
//     console.log(message);
//     console.dir(error.stack);
//   }

//   return null;
// };

// const AnnotatorModel = {
//   // GET, categories 불러옴
//   getCategories: async (datasetId: number, imageId: number) => {
//     try {
//       const url = `${getServerAndBaseURL()}/categories/${datasetId}/${imageId}`;
//       const response =
//         process.env.NODE_ENV === 'development'
//           ? initialCategories
//           : await axios.get(url);

//       return response.data;
//     } catch (error) {
//       axiosErrorHandler(error, 'Failed to get categories');
//     }
//   },
//   // GET, paths 불러옴
//   getPaths: async () => {
//     try {
//       const url = `${getServerAndBaseURL()}/paths`;
//       const response =
//         process.env.NODE_ENV === 'development'
//           ? initialPaths
//           : await axios.get(url);

//       return response.data;
//     } catch (error) {
//       axiosErrorHandler(error, 'Failed to get paths');
//     }
//   },
//   getAnnotations: async (datasetId: number, imageId: number) => {
//     try {
//       const url = `${getServerAndBaseURL()}/annotations/${datasetId}/${imageId}`;
//       const response =
//         process.env.NODE_ENV === 'development'
//           ? initialAnnotations
//           : await axios.get(url);

//       return response.data;
//     } catch (error) {
//       axiosErrorHandler(error, 'Failed to get annotations');
//     }
//   },
// };

// export default AnnotatorModel;
