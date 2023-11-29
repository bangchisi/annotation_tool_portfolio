import { useState } from 'react';

const useSAMParameter = () => {
  const [predIOUThresh, setPredIOUThresh] = useState<number>(0.88);
  const [boxNMSThresh, setBoxNMSThresh] = useState<number>(0.7);
  const [pointsPerSide, setPointsPerSide] = useState<number>(32);

  return {
    predIOUThresh,
    setPredIOUThresh,
    boxNMSThresh,
    setBoxNMSThresh,
    pointsPerSide,
    setPointsPerSide,
  };
};

export default useSAMParameter;
