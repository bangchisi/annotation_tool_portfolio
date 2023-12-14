import {
  ThemeOptions,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';

const defaultTheme = {
  palette: {
    light: {
      border: '#d0d7de',
    },
  },
  typography: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif',
  ],
} as ThemeOptions;

export const ThemeContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleColorMode: (colorMode: 'dark' | 'light') => {
    //
  },
});

export const CustomThemeProvider = ({ children }: PropsWithChildren) => {
  const mode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(mode);

  const toggleColorMode = useCallback((colorMode: 'dark' | 'light') => {
    setColorMode(() => colorMode);
  }, []);

  const theme = useMemo(() => createTheme(defaultTheme), []);

  const value = useMemo(
    () => ({
      toggleColorMode,
    }),
    [toggleColorMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
