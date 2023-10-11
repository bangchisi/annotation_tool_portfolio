import axios from 'axios';

const baseURL = 'api/annotator';

const initialCategories = {
  data: [
    {
      id: 0,
      name: 'human',
      annotations: [0],
    },
    {
      id: 1,
      name: 'animal',
      annotations: [],
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

const initialPaths = {
  data: [
    {
      segmentations: [[385, 798, 385, 813, 319, 813, 319, 798, 385, 798]],
      categoryId: 0,
      annotationId: 0,
    },
  ],
};

const initialAnnotations = {
  data: {
    annotations: [],
  },
};

const getServerAndBaseURL = (): string => {
  return `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/${baseURL}`;
};

const axiosErrorHandler = (error: unknown, message: string) => {
  if (error instanceof Error) {
    console.log(message);
    console.dir(error.stack);
  }

  return null;
};

const AnnotatorModel = {
  // GET, categories 불러옴
  getCategories: async (datasetId: number, imageId: number) => {
    try {
      const url = `${getServerAndBaseURL()}/categories/${datasetId}/${imageId}`;
      const response =
        process.env.NODE_ENV === 'development'
          ? initialCategories
          : await axios.get(url);

      return response.data;
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get categories');
    }
  },
  // GET, paths 불러옴
  getPaths: async () => {
    try {
      const url = `${getServerAndBaseURL()}/paths`;
      const response =
        process.env.NODE_ENV === 'development'
          ? initialPaths
          : await axios.get(url);

      return response.data;
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get paths');
    }
  },
  getAnnotations: async (datasetId: number, imageId: number) => {
    try {
      const url = `${getServerAndBaseURL()}/annotations/${datasetId}/${imageId}`;
      const response =
        process.env.NODE_ENV === 'development'
          ? initialAnnotations
          : await axios.get(url);

      return response.data;
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get annotations');
    }
  },
};

export default AnnotatorModel;
