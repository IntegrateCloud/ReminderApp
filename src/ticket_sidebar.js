import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming';

import 'promise-polyfill/src/polyfill';

import TicketSidebar from './components/TicketSidebar';
import '@zendeskgarden/css-bedrock';
import zafClient from './zafClient';
import ZAFContext from './context/ZAFContext';

zafClient.on('app.registered', (appData) => {
  const contextValue = {
    subdomain: appData.context.account.subdomain,
    location: appData.context.location,
    appId: appData.metadata.appId,
    installationId: appData.metadata.appId,
    settings: appData.metadata.settings,
    client: zafClient,
  };

  function App() {
    return (
      <ZAFContext.Provider value={contextValue}>
        <ThemeProvider theme={DEFAULT_THEME}>
          <TicketSidebar />
        </ThemeProvider>
      </ZAFContext.Provider>
    );
  }
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
});
