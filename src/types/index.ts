export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}
export const ToolNames = {
  [Tool.Select]: 'Select',
  [Tool.Box]: 'Box',
  [Tool.Brush]: 'Brush',
  [Tool.Eraser]: 'Eraser',
  [Tool.SAM]: 'SAM',
};

export const MutationTypeTool = [Tool.Brush, Tool.Box, Tool.Eraser, Tool.SAM];
