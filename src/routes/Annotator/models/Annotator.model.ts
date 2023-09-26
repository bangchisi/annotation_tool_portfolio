import axios from 'axios';

const baseURL = '/api/annotator/';

const initialCategories = {
  data: [
    {
      id: 1,
      name: 'human',
      annotations: [],
    },
    {
      id: 2,
      name: 'animal',
      annotations: [],
    },
    {
      id: 3,
      name: 'building',
      annotations: [],
    },
    {
      id: 4,
      name: 'machine',
      annotations: [],
    },
  ],
};

const AnnotatorModel = {
  getCategories: async (datasetId: number, imageId: number) => {
    try {
      const response =
        process.env.NODE_ENV === 'development'
          ? initialCategories
          : await axios.get(`${baseURL}/${datasetId}/${imageId}`);

      console.log('Annotator.model.ts, getCategories()');
      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log('Failed to get categories');
      if (error instanceof Error) {
        console.log(error.stack);
      }

      return null;
    }
  },
};

export default AnnotatorModel;
