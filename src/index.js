import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactStarsExamples from './examples';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ReactStarsExamples />
  </React.StrictMode>,
  root,
);
