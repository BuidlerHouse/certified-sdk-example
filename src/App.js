import React from 'react';
// import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import CertificateForm from './components/CertificateForm';

import DynamicProvider from './context/dynamic'; 

const App = () => (
    <div className="App">
      <h1>Certificate Attestation Demo</h1>
      <CertificateForm />
    </div>
);

export default App;
