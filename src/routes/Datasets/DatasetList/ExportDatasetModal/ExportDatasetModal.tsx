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

interface ExportDatasetModalProps {
  open: boolean;
  handleClose: () => void;
  exportId?: number;
}

type ExportResponse = {
  downloadLink: string;
};

export default function ExportDatasetModal(props: ExportDatasetModalProps) {
  const { open, handleClose, exportId } = props;
  const [format, setFormat] = useState<string>('coco');

  function onFormatChange(event: SelectChangeEvent) {
    setFormat(event.target.value);
  }

  const { data, trigger } = useTypedSWRMutation<ExportResponse>(
    {
      method: 'post',
      endpoint: `/dataset/export/${exportId}`,
    },
    {
      export_format: format,
    },
  );

  async function exportDataset() {
    try {
      await trigger();

      if (!data) return;

      const link = data['downloadLink'];

      await axios.get(link);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to export dataset');
      alert('Export에 실패했습니다. 다시 시도해주세요.');
    } finally {
      handleClose();
    }
  }

  return (
    <Fragment>
      {exportId && (
        <ModalWrapper
          title={`Export Dataset (id: ${exportId})`}
          open={open}
          handleClose={handleClose}
        >
          <Typography variant="body1">export format</Typography>
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
            <Button color="warning" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => exportDataset()}>Export</Button>
          </ModalFooter>
        </ModalWrapper>
      )}
    </Fragment>
  );
}
