import { Container, ParameterButton } from './ParameterButtonGroup.style';

// - pred_iou_thresh (1, 2, 3단계 순) : 0.7, 0.88, 0.92 (default : 2단계, 0.88)
// - box_nms_thresh : 0.1, 0.4, 0.7 (default : 1단계, 0.7)
// - points_per_side : 16, 32, 48 (default : 2단계, 32)
export enum ParameterType {
  predIOUThresh = 'predIOUThresh',
  boxNMSThresh = 'boxNMSThresh',
  pointsPerSide = 'pointsPerSide',
}

// Everything parameter 버튼 그룹 컴포넌트 props
interface ParameterButtonGroupProps {
  onClick: React.Dispatch<React.SetStateAction<number>>; // 1, 2, 3 버튼 클릭 시 실행할 핸들러
  currentParamValue: number; // 현재 선택된 버튼의 값
  paramType: ParameterType; // 현재 선택된 버튼의 종류
}

const ParameterButtonGroup = (props: ParameterButtonGroupProps) => {
  const { onClick, currentParamValue, paramType } = props;
  const value = {
    predIOUThresh: [0.7, 0.88, 0.92],
    boxNMSThresh: [0.1, 0.4, 0.7],
    pointsPerSide: [16, 32, 48],
  }; // 각 옵션 별 버튼 값

  return (
    <Container value={currentParamValue} size="small" color="primary">
      {/* 옵션 1 버튼*/}
      <ParameterButton
        value={value[paramType][0]}
        onClick={() => onClick(value[paramType][0])}
      >
        1
      </ParameterButton>
      {/* 옵션 2 버튼*/}
      <ParameterButton
        value={value[paramType][1]}
        onClick={() => onClick(value[paramType][1])}
      >
        2
      </ParameterButton>
      {/* 옵션 3 버튼*/}
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
