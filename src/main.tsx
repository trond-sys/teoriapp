import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Bare latin (dekker æøå) og thai – holder offline-pakken liten.
// Atkinson Hyperlegible er laget for å være lett å lese, også for den som leser på et andrespråk.
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';
import '@fontsource/noto-sans-thai/thai-400.css';
import '@fontsource/noto-sans-thai/thai-600.css';
import '@fontsource/noto-sans-thai/thai-700.css';
import './styles/tokens.css';
import './styles/layout.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
