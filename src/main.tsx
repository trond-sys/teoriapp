import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Bare latin (dekker æøå) og thai – holder offline-pakken liten.
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-600.css';
import '@fontsource/noto-sans/latin-700.css';
import '@fontsource/noto-sans-thai/thai-400.css';
import '@fontsource/noto-sans-thai/thai-600.css';
import './styles/tokens.css';
import './styles/layout.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
