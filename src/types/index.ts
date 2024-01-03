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

export type userType = {
  userId: string;
  userName: string;
  isOnline: boolean;
  preference: {
    bboxBlackOrWhite: boolean;
    brushStrokeColor: string;
    brushRadius: number;
    eraserStrokeColor: string;
    eraserRadius: number;
    selectShowText: boolean;
    shortcutMoveUpAnnotations: string[];
    shortcutMoveDownAnnotations: string[];
    shortcutExpandCategory: string[];
    shortcutCollapseCategory: string[];
    shortcutNewAnnotation: string[];
    shortcutDeleteCurrentAnnotation: string[];
    shortcutUndoLastAction: string[];
    shortcutSelectTool: string[];
    shortcutBboxTool: string[];
    shortcutNextImage: string[];
    shortcutPreviousImage: string[];
    shortcutBrushTool: string[];
    shortcutEraserTool: string[];
    shortcutSamTool: string[];
    shortcutCenterImage: string[];
    shortcutSave: string[];
    shortcutRemoveCurrentBbox: string[];
    shortcutBrushIncreaseRadius: string[];
    shortcutBrushDecreaseRadius: string[];
    shortcutSubtractSelection: string[];
    shortcutEraserIncreaseRadius: string[];
    shortcutEraserDecreaseRadius: string[];
  };
};
