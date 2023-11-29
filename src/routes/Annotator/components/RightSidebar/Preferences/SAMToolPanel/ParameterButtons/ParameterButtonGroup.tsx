import { Container, ParameterButton } from './ParameterButtonGroup.style';

// - pred_iou_thresh (1, 2, 3단계 순) : 0.7, 0.88, 0.96 (default : 2단계, 0.88)
// - box_nms_thresh : 0.7, 0.4, 0.1 (default : 1단계, 0.7)
// - points_per_side : 16, 32, 48 (default : 2단계, 32)
export enum ParameterType {
  predIOUThresh = 'predIOUThresh',
  boxNMSThresh = 'boxNMSThresh',
  pointsPerSide = 'pointsPerSide',
}

interface ParameterButtonGroupProps {
  onClick: React.Dispatch<React.SetStateAction<number>>;
  currentParamValue: number;
  paramType: ParameterType;
}

const ParameterButtonGroup = (props: ParameterButtonGroupProps) => {
  const { onClick, currentParamValue, paramType } = props;
  const value = {
    predIOUThresh: [0.7, 0.88, 0.96],
    boxNMSThresh: [0.7, 0.4, 0.1],
    pointsPerSide: [16, 32, 48],
  };

  return (
    <Container value={currentParamValue} size="small" color="primary">
      <ParameterButton
        value={value[paramType][0]}
        onClick={() => onClick(value[paramType][0])}
      >
        1
      </ParameterButton>
      <ParameterButton
        value={value[paramType][1]}
        onClick={() => onClick(value[paramType][1])}
      >
        2
      </ParameterButton>
      <ParameterButton
        value={value[paramType][2]}
        onClick={() => onClick(value[paramType][2])}
      >
        3
      </ParameterButton>
    </Container>
  );
};

export default ParameterButtonGroup;
