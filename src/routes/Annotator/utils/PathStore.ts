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

  getAll() {
    return this.paths;
  }

  appendPath(path: PathType) {
    this.paths.push(path);
  }

  removePath(categoryId: number, annotationId: number) {
    this.paths = this.paths.filter(
      (path) =>
        path.categoryId !== categoryId && path.annotationId !== annotationId,
    );
  }

  getCategoryPath(categoryId: number): PathStore {
    return new PathStore(
      this.paths.filter((path) => path.categoryId === categoryId),
    );
  }

  getLastAnnotationId(): number {
    if (this.paths.length > 0) {
      const maxIdObject = this.paths.reduce((max, current) => {
        return current.annotationId > max.annotationId ? current : max;
      });
      return maxIdObject.annotationId;
    }

    return -1;
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

  getSelectedPath(
    categoryId: number,
    annotationId: number,
  ): PathType | undefined {
    const selectedPath = this.paths.find(
      (path) =>
        path.categoryId === categoryId && path.annotationId === annotationId,
    );

    return selectedPath;
  }
}
