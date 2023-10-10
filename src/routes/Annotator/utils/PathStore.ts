type SegmentsType = [x: number, y: number][];

interface PathType {
  categoryId: number;
  annotationId: number;
  segments: SegmentsType;
}

export default class PathStore {
  paths: PathType[] = [];

  constructor(paths: PathType[]) {
    this.paths = paths;
  }

  public get Paths() {
    return this.paths;
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
}
