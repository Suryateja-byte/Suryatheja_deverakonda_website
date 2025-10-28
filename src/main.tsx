import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { ImageSlotRegistryProvider } from '@components/providers/ImageSlotRegistry';
import { ThemeProvider } from '@components/providers/ThemeProvider';
import { ResumeProvider } from '@components/providers/ResumeProvider';
import '@/styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element with id `root` not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <ImageSlotRegistryProvider>
        <ResumeProvider>
          <App />
        </ResumeProvider>
      </ImageSlotRegistryProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
