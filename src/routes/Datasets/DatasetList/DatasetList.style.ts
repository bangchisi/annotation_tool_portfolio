import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from '@mui/material';

export const Container = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 16px',
    marginTop: '30px',
    gap: '16px',
  };
});

export const StyledAccordion = styled(Accordion)(() => {
  return {
    boxShadow: 'none',
  };
});

export const StyledAccordionSummary = styled(AccordionSummary)(() => {
  return {
    padding: '16px 8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--surface-bg)',

    '& .MuiAccordionSummary-content': {
      margin: '0',
    },

    '& h2': {
      fontSize: '24px',
      fontWeight: '500',
      margin: '0',
      color: 'var(--light-gray)',
      marginLeft: '16px',
    },
  };
});

export const StyledAccordionDetails = styled(AccordionDetails)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '3% 32px',

    '&:first-of-type': {
      marginTop: '16px',
    },
  };
});
