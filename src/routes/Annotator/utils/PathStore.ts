export type SegmentsType = [x: number, y: number][];

export interface PathType {
  categoryId: number;
  annotationId: number;
  segments: SegmentsType;
}

export default class PathStore {
  paths: PathType[] = [];

  constructor(paths: PathType[]) {
    this.paths = paths;
  }

  addPath(path: PathType) {
    this.paths.push(path);
  }

  removePath(categoryId: number, annotationId: number) {
    this.paths = this.paths.filter(
      (path) =>
        path.categoryId !== categoryId && path.annotationId !== annotationId,
    );
  }

  getLastAnnotationIdInCategory(categoryId: number): number {
    let lastId = -1;
    let prevPath;
    this.paths.forEach((path) => {
      if (path.categoryId === categoryId) {
        prevPath = path;
        if (lastId === -1 || path.annotationId > prevPath.annotationId) {
          lastId = path.annotationId;
        }
      }
    });

    return lastId;
  }
}
