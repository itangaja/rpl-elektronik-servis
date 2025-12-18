import React from 'react';
import { createRoot } from 'react-dom/client';
import Start from './Start';
import '../css/app.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Start />
  </React.StrictMode>
);
