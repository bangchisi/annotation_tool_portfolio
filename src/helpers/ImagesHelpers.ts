const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

export const getImagePath = (imageId: number, length = 100): string => {
  const url = `${SERVER_URL}/image/${imageId}?length=${length}`;

  return url;
};

export function getCanvasImage(imageId: number): string {
  const baseUrl = SERVER_URL;

  return new URL(`/image/${imageId}`, baseUrl).href;
}
