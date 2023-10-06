import axios from 'axios';

const baseURL = '/api/annotator/';

const initialCategories = {
  data: [
    {
      id: 0,
      name: 'human',
    },
    {
      id: 1,
      name: 'animal',
    },
    {
      id: 2,
      name: 'building',
    },
    {
      id: 3,
      name: 'machine',
    },
  ],
};

const initialAnnotations = {
  data: {
    annotations: [],
  },
};

const AnnotatorModel = {
  getCategories: async (datasetId: number, imageId: number) => {
    try {
      const response =
        process.env.NODE_ENV === 'development'
          ? initialCategories
          : await axios.get(`${baseURL}/categories/${datasetId}/${imageId}`);

      return response.data;
    } catch (error) {
      console.log('Failed to get categories');
      if (error instanceof Error) {
        console.log(error.stack);
      }

      return null;
    }
  },
  getAnnotations: async (datasetId: number, imageId: number) => {
    try {
      const response =
        process.env.NODE_ENV === 'development'
          ? initialAnnotations
          : await axios.get(`${baseURL}/annotations/${datasetId}/${imageId}`);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to get annotations');
        console.log(error.stack);

        return null;
      }
    }
  },
};

export default AnnotatorModel;
