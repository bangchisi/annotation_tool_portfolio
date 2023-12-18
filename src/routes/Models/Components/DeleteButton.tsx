import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { Button, ButtonProps } from '@mui/material';

const DeleteButton = (props: ButtonProps) => {
  const { children, ...rest } = props;
  return (
    <Button
      variant="contained"
      size="small"
      color="error"
      sx={{
        width: '72px',
        height: '35px',
        backgroundColor: 'transparent',
        border: '1px solid #FA4549',
        boxShadow: 'none',
        borderRadius: '3',
        transition: 'all 0.25s ease-in-out',
        fontSize: '12px',
        padding: 'none !important',
        marginRight: '24px',
        color: '#FA4549',
        '&:hover': {
          backgroundColor: '#FA4549',
          color: '#fff',
        },
      }}
      disableFocusRipple={true}
      {...rest}
    >
      <DeleteSweepOutlinedIcon
        sx={{
          marginRight: '4px',
          fontSize: '20px',
        }}
      />
      {children}
    </Button>
  );
};

export default DeleteButton;
