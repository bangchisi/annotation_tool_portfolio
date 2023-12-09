import paper from 'paper';

export const print = (message: any) => {
  console.log(JSON.parse(JSON.stringify(message)));
};

export const printExportedCompoundPaths = () => {
  const { children } = paper.project.activeLayer;
  children.forEach((child) => {
    if (child instanceof paper.CompoundPath) {
      console.log(JSON.parse(child.exportJSON()));
    }
  });
};

export const printActiveLayerChildren = () => {
  const { children } = paper.project.activeLayer;
  console.log(children);
};

export const printAllCompoundPath = () => {
  console.group('All Compound Paths');
  const { children } = paper.project.activeLayer;
  children.forEach((child) => {
    if (child instanceof paper.CompoundPath) {
      console.log(JSON.parse(child.exportJSON()));
    }
  });
  console.groupEnd();
};

export const printCompoundPathWithChildren = () => {
  const { children } = paper.project.activeLayer;
  children.forEach((child) => {
    if (child instanceof paper.CompoundPath && child.children.length > 0) {
      console.log(JSON.parse(child.exportJSON()));
    }
  });
};

export const printCompoundPathWithoutChildren = () => {
  const { children } = paper.project.activeLayer;
  children.forEach((child) => {
    if (child instanceof paper.CompoundPath && child.children.length === 0) {
      console.log(JSON.parse(child.exportJSON()));
    }
  });
};
