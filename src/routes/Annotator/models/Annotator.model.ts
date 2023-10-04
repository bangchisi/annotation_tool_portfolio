import axios from 'axios';

const baseURL = '/api/annotator/';

const initialCategories = {
  data: [
    {
      id: 0,
      name: 'human',
      annotations: [
        {
          id: 0,
          categoryId: 0,
          path: null,
        },
        {
          id: 1,
          categoryId: 0,
          path: null,
        },
        {
          id: 2,
          categoryId: 0,
          path: null,
        },
      ],
    },
    {
      id: 1,
      name: 'animal',
      annotations: [
        {
          id: 0,
          categoryId: 1,
          path: null,
        },
        {
          id: 1,
          categoryId: 1,
          path: null,
        },
        {
          id: 2,
          categoryId: 1,
          path: null,
        },
      ],
    },
    {
      id: 2,
      name: 'building',
      annotations: [],
    },
    {
      id: 3,
      name: 'machine',
      annotations: [],
    },
  ],
};

const AnnotatorModel = {
  getCategories: async (datasetId: number, imageId: number) => {
    try {
      // console.group('%cAnnotator.model.ts, getCategories()', 'color: red');
      const response =
        process.env.NODE_ENV === 'development'
          ? initialCategories
          : await axios.get(`${baseURL}/${datasetId}/${imageId}`);

      // console.group('%cresponse.data', 'color: blue');
      // console.dir(response.data);
      // console.groupEnd();
      return response.data;
    } catch (error) {
      console.log('Failed to get categories');
      if (error instanceof Error) {
        console.log(error.stack);
      }

      return null;
    } finally {
      // console.groupEnd();
    }
  },
};

export default AnnotatorModel;
