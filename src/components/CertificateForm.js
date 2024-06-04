import React, { useState } from 'react';
import { createCertificateAttestation } from 'certified-sdk';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import SignMessageButton from './SignMessageButton';
import DynamicConnectButton from "./walletWidget";

const CertificateForm = () => {
  const { primaryWallet } = useDynamicContext();
  const [formData, setFormData] = useState({
    name: '',
    note: '',
    certificationName: '',
    certificationOrganization: '',
    issuedToWallet: '',
    expirationDate: '',
    extra: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [records, setRecords] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!primaryWallet) {
      setError('Primary wallet not connected');
      return;
    }

    try {
      const attestationResult = await createCertificateAttestation(
        primaryWallet,
        formData.name,
        formData.note,
        formData.certificationName,
        formData.certificationOrganization,
        formData.issuedToWallet,
        new Date(formData.expirationDate),
        formData.extra,
        "0" // templateId default 0
      );
      setResult(attestationResult);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/func/fetch-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ schemaId: 'YOUR_SCHEMA_ID' }) // Replace with your actual schemaId
      });

      const data = await response.json();
      if (response.ok) {
        setRecords(data.records);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <><div>

         
      </div><div>
              <h1>Create Certificate Attestation</h1>
              
              <DynamicConnectButton />


              <form onSubmit={handleSubmit}>
                  <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                  <input name="note" placeholder="Note" value={formData.note} onChange={handleChange} />
                  <input name="certificationName" placeholder="Certification Name" value={formData.certificationName} onChange={handleChange} />
                  <input name="certificationOrganization" placeholder="Certification Organization" value={formData.certificationOrganization} onChange={handleChange} />
                  <input name="issuedToWallet" placeholder="Issued To Wallet" value={formData.issuedToWallet} onChange={handleChange} />
                  <input type="date" name="expirationDate" placeholder="Expiration Date" value={formData.expirationDate} onChange={handleChange} />
                  <input name="extra" placeholder="Extra" value={formData.extra} onChange={handleChange} />
                  <button type="submit">Create Attestation</button>
              </form>
              {result && <div>Attestation Created: {JSON.stringify(result)}</div>}
              {error && <div>Error: {error}</div>}
              <SignMessageButton />
              <button onClick={handleFetchRecords}>Fetch Records</button>
              {records && <div>Records: {JSON.stringify(records)}</div>}
          </div></>
  );
};

export default CertificateForm;
