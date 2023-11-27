import {
  Button,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import {
  Container,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from './ExportDatasetModal.style';
import { Fragment, useState } from 'react';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import DatasetModel from 'routes/Dataset/models/Dataset.model';

interface ExportDatasetModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  exportId?: number;
}

export default function ExportDatasetModal(props: ExportDatasetModalProps) {
  const { open, setOpen, exportId } = props;
  const [format, setFormat] = useState<string>('coco');

  function onFormatChange(event: SelectChangeEvent) {
    setFormat(event.target.value);
  }

  async function exportDataset(datasetId: number, exportFormat: string) {
    try {
      const response = await DatasetModel.exportDataset(
        datasetId,
        exportFormat,
      );

      const link = response.data['downloadLink'];

      DatasetModel.download(link);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to export dataset');
      alert('Export에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setOpen(false);
    }
  }

  return (
    <Fragment>
      {exportId && (
        <Container>
          <Modal open={open}>
            <ModalBody>
              <ModalHeader>
                <Typography variant="h6">
                  Export Dataset (id: {exportId})
                </Typography>
              </ModalHeader>
              <ModalContent>
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
              </ModalContent>
              <ModalFooter>
                <Button color="warning" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => exportDataset(exportId, format)}>
                  Export
                </Button>
              </ModalFooter>
            </ModalBody>
          </Modal>
        </Container>
      )}
    </Fragment>
  );
}
