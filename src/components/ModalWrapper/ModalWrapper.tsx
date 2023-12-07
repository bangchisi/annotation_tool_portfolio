import styled from '@emotion/styled';
import { Modal, Typography } from '@mui/material';
import { PropsWithChildren, useCallback, useState } from 'react';

type ModalWrapperProps = {
  title: string;
  open: boolean;
  handleClose: () => void;
} & PropsWithChildren;

const ModalWrapper = ({
  title,
  open,
  handleClose,
  children,
}: ModalWrapperProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      disableScrollLock={true}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      slotProps={{
        backdrop: {
          timeout: 250,
        },
      }}
    >
      <ModalShadowContainer>
        <ModalShadow>
          <Container>
            <Header>
              <Typography
                variant="h5"
                sx={{
                  fontSize: '22px',
                }}
              >
                {title}
              </Typography>
            </Header>
            <Body>
              <Content>{children}</Content>
            </Body>
          </Container>
        </ModalShadow>
      </ModalShadowContainer>
    </Modal>
  );
};

export default ModalWrapper;

export const useModal = () => {
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  return {
    open,
    setOpen,
    handleOpen,
    handleClose,
  };
};

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f6fafd;
  border: 1px solid #1976d2;
  padding: 0px 15px 15px 15px;
  outline: none;
  border-radius: 7px;
`;

const Body = styled('div')`
  width: 400px;
`;

const Header = styled('div')`
  padding: 8px;
  display: flex;
  justify-content: center;
  color: #0e1116;
`;

const Content = styled('div')`
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 1);
  padding: 15px;
  border-radius: 3px;
  justify-content: space-between;
  border: 1px solid #1976d2;
`;

const ModalShadowContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-width: 850px;
  margin-left: -100px;
`;

const ModalShadow = styled('div')`
  box-shadow: 0 1px 7px 4px rgba(0, 0, 0, 0.3);
  border-radius: 7px;
`;
