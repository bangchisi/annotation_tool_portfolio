export interface AnnotationType {
  annotationId?: number;
  category?: string;
  path?: paper.CompoundPath | paper.PathItem | null;
  // points: number[][];
  // color: string;
}
