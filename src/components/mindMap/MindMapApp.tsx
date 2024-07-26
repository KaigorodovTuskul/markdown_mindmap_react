import React from 'react';
import { createRoot } from 'react-dom/client';
import MarkmapHooks from './markmap-hooks';
import './style.scss';

function MindMapApp() {
  return (
    <MarkmapHooks />
  );
}

export default MindMapApp;

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <MindMapApp />
  </React.StrictMode>
);
