import axios from 'axios';
import { CategoriesType } from '../Annotator.types';

// const DEV_URL = 'http://143.248.249.11:60133';
const DEV_URL = `http://${process.env.REACT_APP_DEV_IP}:${process.env.REACT_APP_DEV_PORT}`;
const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

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
  createAnnotation: (
    imageId: number,
    datasetId: number,
    categoryId: number,
    color: string,
  ) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/annotation`
        : `${SERVER_URL}/annotation`;

    return axios.post(url, {
      image_id: imageId,
      dataset_id: datasetId,
      category_id: categoryId,
      color: color,
    });
  },
  deleteAnnotation: (annotationId: number) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/annotation/${annotationId}`
        : `${SERVER_URL}/annotation/${annotationId}`;

    return axios.delete(url);
  },
  deleteAllAnnotations: (imageId: number, categoryId: number) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/annotation/clear/${imageId}/${categoryId}`
        : `${SERVER_URL}/annotation/clear/${imageId}/${categoryId}`;

    return axios.delete(url);
  },
};

export default AnnotatorModel;
