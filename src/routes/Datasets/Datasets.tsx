import 'assets/css/datasets.css';

import CreateDatasetModal from './CreateDatasetModal/CreateDatasetModal';
import DatasetList from './DatasetList/DatasetList';

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
        <CreateDatasetModal />
      </div>
      <DatasetList />
    </div>
  );
}
