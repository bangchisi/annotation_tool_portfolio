import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { ModalFooter } from './ExportDatasetModal.style';
import { Fragment, useState } from 'react';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import ModalWrapper from 'components/ModalWrapper/ModalWrapper';
import { useTypedSWRMutation } from 'hooks';
import axios from 'axios';

// ExportDatasetModal 컴포넌트 props 타입
interface ExportDatasetModalProps {
  open: boolean; // 모달 활성화 여부
  handleClose: () => void; // 모달 닫기 함수
  exportId?: number; // 데이터셋 내보내기를 위한 데이터셋 id
}

// 내보내기 응답 타입
type ExportResponse = {
  downloadLink: string; // 다운로드 링크
};

// ExportDatasetModal 컴포넌트
export default function ExportDatasetModal(props: ExportDatasetModalProps) {
  const { open, handleClose, exportId } = props; // props 디스트럭처링
  const [format, setFormat] = useState<string>('coco'); // 내보내기 포맷

  // 내보내기 포맷 변경 함수
  function onFormatChange(event: SelectChangeEvent) {
    setFormat(event.target.value);
  }

  // useTypedSWRMutation 커스텀 훅을 이용해 내보내기 요청
  const { data, trigger } = useTypedSWRMutation<ExportResponse>(
    {
      method: 'post',
      endpoint: `/dataset/export/${exportId}`,
    },
    {
      export_format: format,
    },
  );

  // 내보내기 요청 함수
  async function exportDataset() {
    try {
      // 내보내기 요청
      await trigger();

      // 응답이 없으면 종료
      if (!data) return;

      // 다운로드 링크를 저장
      const link = data['downloadLink'];

      // 다운로드 링크가 없으면 종료
      if (!link) return;

      // 다운로드 링크로 요청
      await axios.get(link);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to export dataset');
      alert('Export에 실패했습니다. 다시 시도해주세요.');
    } finally {
      // 모달 닫기
      handleClose();
    }
  }

  return (
    <Fragment>
      {exportId && (
        // 모달 랜더링
        <ModalWrapper
          title={`Export Dataset (id: ${exportId})`}
          open={open}
          handleClose={handleClose}
        >
          <Typography variant="body1">export format</Typography>
          {/* 내보내기 포맷 선택 */}
          <Select
            value={format}
            size="small"
            onChange={(e) => onFormatChange(e)}
          >
            <MenuItem value="coco">
              <Typography variant="subtitle1">COCO v1.0</Typography>
            </MenuItem>
            <MenuItem value="nibabel">
              <Typography variant="subtitle1">NiBabel</Typography>
            </MenuItem>
          </Select>
          <ModalFooter>
            {/* 닫기 버튼 */}
            <Button color="warning" onClick={handleClose}>
              Cancel
            </Button>
            {/* 내보내기 버튼 */}
            <Button onClick={() => exportDataset()}>Export</Button>
          </ModalFooter>
        </ModalWrapper>
      )}
    </Fragment>
  );
}
