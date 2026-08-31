import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';

import E2EHarness from './E2EHarness';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <E2EHarness />
  </StrictMode>,
);
