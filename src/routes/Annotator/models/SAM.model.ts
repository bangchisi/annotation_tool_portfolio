import axios from 'axios';

// const DEV_URL = 'http://143.248.249.11:60133';
const DEV_URL = `http://${process.env.REACT_APP_DEV_IP}:${process.env.REACT_APP_DEV_PORT}`;
const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const SAMModel = {
  loadModel: (modelType: string) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/sam/load/${modelType}`
        : `${SERVER_URL}/sam/load/${modelType}`;

    return axios.get(url);
  },
  embedImage: (
    imageId: number,
    topLeft: paper.Point,
    bottomRight: paper.Point,
  ) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/sam/embed`
        : `${SERVER_URL}/sam/embed`;

    return axios.post(url, {
      image_id: imageId,
      image_left_top_coord: [Math.floor(topLeft.x), Math.floor(topLeft.y)],
      image_right_bottom_coord: [
        Math.floor(bottomRight.x),
        Math.floor(bottomRight.y),
      ],
    });
  },
  everything: (
    imageId: number,
    categoryId: number,
    topLeft: paper.Point,
    bottomRight: paper.Point,
    params: {
      predIOUThresh: number;
      boxNmsThresh: number;
      pointsPerSide: number;
    },
  ) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/sam/everything`
        : `${SERVER_URL}/sam/everything`;

    return axios.post(url, {
      image_id: imageId,
      category_id: categoryId,
      image_left_top_coord: [Math.floor(topLeft.x), Math.floor(topLeft.y)],
      image_right_bottom_coord: [
        Math.floor(bottomRight.x),
        Math.floor(bottomRight.y),
      ],
      // FIX: is_finetune을 model 종류에 따라 받아와야 함. 일단은 false로 고정
      is_finetune: false,
      params: {
        pred_iou_thresh: params.predIOUThresh,
        box_nms_thresh: params.boxNmsThresh,
        points_per_side: params.pointsPerSide,
      },
    });
  },
  click: (
    imageId: number,
    coords: [number, number][],
    labels: number[],
    topLeft: paper.Point,
    bottomRight: paper.Point,
  ) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/sam/click`
        : `${SERVER_URL}/sam/click`;

    return axios.post(url, {
      image_id: imageId,
      point_coords: coords, // 클릭한 위치 배열, float
      point_labels: labels, // positive or negative 배열, int
      image_left_top_coord: [Math.floor(topLeft.x), Math.floor(topLeft.y)],
      image_right_bottom_coord: [
        Math.floor(bottomRight.x),
        Math.floor(bottomRight.y),
      ],
    });
  },
};

export default SAMModel;
