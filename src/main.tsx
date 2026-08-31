import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';

import Examples from './examples';
import E2EHarness from './E2EHarness';
import './index.css';

const App = window.location.pathname === '/e2e' ? E2EHarness : Examples;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
