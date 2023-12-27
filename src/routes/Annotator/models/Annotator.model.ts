import axios from 'axios';
import { CategoriesType } from '../Annotator.types';

const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const AnnotatorModel = {
  saveData: (
    datasetId: number,
    imageId: number,
    categories: CategoriesType,
  ) => {
    const url = `${SERVER_URL}/annotator/data`;

    return axios.post(url, {
      image_id: imageId,
      dataset_id: datasetId,
      categories,
      serialized_data: '',
    });
  },
  createAnnotation: (
    imageId: number,
    datasetId: number,
    categoryId: number,
    color: string,
  ) => {
    const url = `${SERVER_URL}/annotation`;

    return axios.post(url, {
      image_id: imageId,
      dataset_id: datasetId,
      category_id: categoryId,
      color: color,
    });
  },
  deleteAnnotation: (annotationId: number) => {
    const url = `${SERVER_URL}/annotation/${annotationId}`;

    return axios.delete(url);
  },
  deleteAllAnnotations: (imageId: number, categoryId: number) => {
    const url = `${SERVER_URL}/annotation/clear/${imageId}/${categoryId}`;

    return axios.delete(url);
  },
};

export default AnnotatorModel;
