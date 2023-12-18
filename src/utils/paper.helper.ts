import paper from 'paper';

export const initializePaper = (canvas: HTMLCanvasElement) => {
  if (paper.project) paper.project.clear();
  paper.setup(canvas);
  paper.activate();
};

export const optimizePathItem = (pathItem: paper.PathItem) => {
  pathItem.flatten(1.5);
};

export const deselectPath = (pathItem: paper.Path) => {
  pathItem?.segments.forEach((segment) => {
    segment.selected = false;
  });
};
