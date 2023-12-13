import { PropsWithChildren } from 'react';
import { CookiesProvider } from 'react-cookie';
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from 'store';
import { CustomThemeProvider as ThemeProvider } from './ThemeProvider';

export const Provider = ({ children }: PropsWithChildren) => {
  return (
    <>
      <PersistGate persistor={persistor}>
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
          <HelmetProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </HelmetProvider>
        </CookiesProvider>
      </PersistGate>
    </>
  );
};
