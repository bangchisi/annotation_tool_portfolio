import paper from 'paper';
export type SegmentationType = number[][];

export interface PathType {
  categoryId: number;
  annotationId: number;
  segmentations: SegmentationType;
}

export default class PathStore {
  children: paper.Item[];
  tempPath: paper.CompoundPath | null;

  constructor(children: paper.Item[]) {
    this.children = children;
    this.tempPath = null;
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

  static compoundPathToSegmentation(compoundPath: paper.CompoundPath) {
    if (compoundPath.children.length <= 0) return;
    const segmentations: number[][] = [];
    const segmentation: number[] = [];
    compoundPath.children.map((e) => {
      const path = e as paper.Path;

      const segments = path.segments;

      segments.map((segment) => {
        segmentation.push(segment.point.x);
        segmentation.push(segment.point.y);
      });
    });

    segmentations.push(segmentation);
    return segmentations;
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
