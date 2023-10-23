import 'assets/css/datasets.css';

import CreateDatasetModal from './CreateDatasetModal/CreateDatasetModal';
import DatasetList from './DatasetList/DatasetList';
import { useState } from 'react';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import DatasetsModel from './models/Datasets.model';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

export interface DatasetType {
  datasetId: number; // Dataset 고유 ID
  datasetName: string; // Dataset 이름. 중복 가능?
  lastUpdate: string; // 마지막 변경시간. or Date
  created: string; // 생성 날짜. or Date
  description: string;
  numImages: number; // 이미지 갯수?
  progress: number; // annotation 진행률
  categories: [
    {
      categoryId: number; // category 고유 ID
      name: string; // category 이름
      color: string; // category 색깔
      supercategory: string; // 상위 카테고리
    },
  ];
}

export default function Datasets() {
  const [datasets, setDatasets] = useState<DatasetType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const setDatasetList = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await DatasetsModel.getDatasetsByUserId(userId);
      const datasetList = response.data.data;
      setDatasets([...datasetList]);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get datasets');
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: style dataset-search
  return (
    <div id="datasets" className="pe-5 ps-5">
      <div id="datasets-controls" className="mb-4">
        <div id="datasets-search">
          <button className="btn btn-secondary">Sort by</button>
          <form id="datasets-search-form">
            <input
              type="text"
              className="form-control ms-2 me-2"
              placeholder="Search.."
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
        <CreateDatasetModal setDatasetList={setDatasetList} />
      </div>
      <DatasetList datasets={datasets} setDatasetList={setDatasetList} />
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
