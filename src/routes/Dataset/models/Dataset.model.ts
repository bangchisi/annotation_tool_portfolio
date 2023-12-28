import axios from 'axios';

const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/dataset`;

const DatasetModel = {
  exportDataset: (datasetId: number, exportFormat: string) => {
    const url = `${SERVER_URL}/export/${datasetId}`;

    return axios.post(url, {
      export_format: exportFormat,
    });
  },
  download: (link: string) => {
    const url = link;

    return axios.get(url);
  },
  addCategory: (
    datasetId: number,
    categoryName: string,
    categoryColor: string,
  ) => {
    const url = `${SERVER_URL}/category/${datasetId}`;

    return axios.post(url, {
      name: categoryName,
      color: categoryColor,
    });
  },
  deleteCategory: (categoryId: number) => {
    const url = `${SERVER_URL}/category/${categoryId}`;

    return axios.delete(url);
  },
  // updateDataset: (
  //   datasetId: number, // int
  //   superdatasetName: string,
  //   datasetName: string,
  //   description: string,
  // ) => {
  //   const url = `${SERVER_URL}`;

  //   return axios.put(url, {
  //     dataset_id: datasetId,
  //     dataset_name: datasetName,
  //     superdataset_name: superdatasetName,
  //     description: description,
  //   });
  // },
};

export default DatasetModel;
