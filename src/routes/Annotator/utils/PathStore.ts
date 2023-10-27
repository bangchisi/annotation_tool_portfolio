import paper from 'paper';
export type SegmentationType = number[][];

export interface PathType {
  categoryId: number;
  annotationId: number;
  segmentations: SegmentationType;
}

export default class PathStore {
  paths: PathType[] | null;
  tempPath: paper.CompoundPath | null;

  constructor() {
    this.paths = null;
    this.tempPath = null;
  }

  getAll() {
    return this.paths;
  }

  setPaths(paths: PathType[]) {
    this.paths = paths;
  }

  appendPath(path: PathType) {
    if (!this.paths) return;
    this.paths.push(path);
  }

  removePath(categoryId: number, annotationId: number) {
    if (!this.paths) return;

    this.paths = this.paths.filter(
      (path) =>
        path.categoryId !== categoryId && path.annotationId !== annotationId,
    );
  }

  getCategoryPath(categoryId: number) {
    if (!this.paths) return;

    const categoryPaths = this.paths.filter((path) => {
      if (path.categoryId === categoryId) {
        return true;
      }
      return false;
    });

    return categoryPaths;
  }

  getLastAnnotationId() {
    if (!this.paths) return;

    if (this.paths.length > 0) {
      const maxIdObject = this.paths.reduce((max, current) => {
        return current.annotationId > max.annotationId ? current : max;
      });
      return maxIdObject.annotationId;
    }

    return -1;
  }

  getLastAnnotationIdInCategory(categoryId: number) {
    if (!this.paths) return;

    let lastId = -1;
    let prevPath: PathType;
    if (this.paths.length > 0) {
      this.paths.forEach((path) => {
        if (!!prevPath && path.categoryId === categoryId) {
          if (lastId === -1 || path.annotationId > prevPath.annotationId) {
            lastId = path.annotationId;
          }
        }
        prevPath = path;
      });
    }

    return lastId;
  }

  getSelectedPath(categoryId: number, annotationId: number) {
    if (!this.paths) return;

    const selectedPath = this.paths.find(
      (path) =>
        path.categoryId === categoryId && path.annotationId === annotationId,
    );

    return selectedPath;
  }

  async initPathsToCanvas() {
    if (!this.paths) return;

    this.paths.forEach((path) => {
      const polygons = this.segmentationsToPolygons(path.segmentations);
      const unitedPolygon = this.unitePolygons(polygons);
      new paper.CompoundPath({
        children: [unitedPolygon],
        strokeWidth: 1,
        strokeColor: new paper.Color(0, 1, 0, 1),
        fillColor: new paper.Color(1, 1, 1, 0.7),
      });
    });
  }

  // segmentation -> paper.Path
  segmentationToPath(segmentation: number[]) {
    const points: number[][] = [];

    segmentation.forEach((point, index) => {
      if (index % 2 === 0) {
        const x = point;
        const y = segmentation[index + 1];
        points.push([x, y]);
      }
    });

    return new paper.Path({
      segments: points,
      closed: true,
    });
  }

  // segmentations -> paper.Path[]
  segmentationsToPolygons(segmentations: number[][]) {
    return segmentations.map((segmentation) =>
      this.segmentationToPath(segmentation),
    );
  }

  // polygons를 unite하는 함수
  unitePolygons(polygons: paper.PathItem[]) {
    const unitedPolygon = polygons.reduce(
      (result: paper.PathItem | null, path) => {
        if (!result) return path.clone();

        result = result.unite(path);
        return result;
      },
      null,
    );
    return unitedPolygon;
  }
}
