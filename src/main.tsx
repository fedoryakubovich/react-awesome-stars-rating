import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';

import Examples from './examples';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Examples />
  </StrictMode>,
);
