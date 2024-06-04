import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import {DynamicProvider} from './context/dynamic'; 

ReactDOM.render(
  <React.StrictMode>
    <DynamicProvider>
      <App />
      </DynamicProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
