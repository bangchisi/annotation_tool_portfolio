import paper from 'paper';
export type SegmentationsType = number[][];

export interface PathType {
  categoryId: number;
  annotationId: number;
  segmentations: SegmentationsType;
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
    const newPathStore = new PathStore(
      this.paths.filter((path) => {
        if (path.categoryId === categoryId) {
          return true;
        }
        return false;
      }),
    );

    return newPathStore;
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

  async initPathsToCanvas() {
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
